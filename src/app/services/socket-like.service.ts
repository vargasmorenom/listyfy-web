import { Injectable, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// Eventos que el backend puede emitir por SSE o Socket.io
const SSE_EVENTS = ['like:updated', 'follow:updated', 'follower:updated', 'view:updated'] as const;
const SSE_THRESHOLD = 3; // intentos fallidos antes de abrir SSE

@Injectable({
  providedIn: 'root'
})
export class SocketLikeService {

  private socket: Socket;
  private eventSource: EventSource | null = null;
  private usingSSE = false;
  private connectionErrors = 0;

  // Bus unificado: tanto socket como SSE empujan aquí
  private subjects = new Map<string, Subject<any>>();

  private readonly socketUrl: string;
  private readonly sseUrl: string;

  constructor(private ngZone: NgZone, private authService: AuthService) {
    this.socketUrl = new URL(environment.servicio[0].url).origin;
    this.sseUrl = environment.servicio[0].url + 'events';

    this.socket = io(this.socketUrl, {
      transports: ['websocket'],
      withCredentials: true,
      auth: (cb) => cb({ token: this.authService.getToken() ?? '' }),
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Conectado con id:', this.socket.id);
      this.connectionErrors = 0;
      if (this.usingSSE) this.closeSSE();
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('[Socket] Desconectado:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[Socket] Error de conexión:', err.message);
      this.connectionErrors++;
      if (this.connectionErrors >= SSE_THRESHOLD && !this.usingSSE) {
        this.openSSE();
      }
    });

    // Todos los eventos del socket pasan por el bus unificado
    this.socket.onAny((event, data) => {
      console.log('[Socket] Evento recibido →', event, data);
      this.pushToSubject(event, data);
    });
  }

  // ─── SSE fallback ────────────────────────────────────────────────────────

  private openSSE(): void {
    const token = this.authService.getToken();
    if (!token) {
      console.warn('[SSE] Sin token, no se puede abrir conexión');
      return;
    }

    const url = `${this.sseUrl}?token=${encodeURIComponent(token)}`;
    console.log('[SSE] Abriendo conexión fallback...');
    this.eventSource = new EventSource(url);
    this.usingSSE = true;

    this.eventSource.onopen = () => console.log('[SSE] Conexión establecida');
    this.eventSource.onerror = (err) => console.error('[SSE] Error:', err);

    SSE_EVENTS.forEach(event => {
      this.eventSource!.addEventListener(event, (e: MessageEvent) => {
        console.log('[SSE] Evento recibido →', event, e.data);
        const data = JSON.parse(e.data);
        this.ngZone.run(() => this.pushToSubject(event, data));
      });
    });
  }

  private closeSSE(): void {
    this.eventSource?.close();
    this.eventSource = null;
    this.usingSSE = false;
    console.log('[SSE] Cerrada — socket reconectado');
  }

  // ─── Bus interno ─────────────────────────────────────────────────────────

  private pushToSubject(event: string, data: any): void {
    this.subjects.get(event)?.next(data);
  }

  // ─── API pública ─────────────────────────────────────────────────────────

  on<T>(event: string): Observable<T> {
    if (!this.subjects.has(event)) {
      this.subjects.set(event, new Subject<any>());
    }
    return this.subjects.get(event)!.asObservable() as Observable<T>;
  }

  // off() es no-op con el bus de subjects: takeUntil() en el componente maneja la baja
  off(_event: string): void {}

  emit(event: string, data: any): void {
    console.log('[Socket] Emit:', event, data);
    this.socket.emit(event, data);
  }

  reconnectWithToken(): void {
    this.closeSSE();
    this.connectionErrors = 0;
    this.socket.disconnect().connect();
  }

  get isConnected(): boolean { return this.socket.connected; }
  get transport(): 'socket' | 'sse' | 'none' {
    if (this.socket.connected) return 'socket';
    if (this.usingSSE) return 'sse';
    return 'none';
  }
}
