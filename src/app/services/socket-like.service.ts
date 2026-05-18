import { Injectable, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketLikeService {

  private socket: Socket;
  private url: string = new URL(environment.servicio[0].url).origin;

  constructor(private ngZone: NgZone) {
    this.socket = io(this.url, {
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Conectado con id:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('[Socket] Desconectado:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[Socket] Error de conexión:', err.message);
    });
  }

  emit(event: string, data: any): void {
    console.log('[Socket] Emit:', event, data);
    this.socket.emit(event, data);
  }

  on<T>(event: string): Observable<T> {
    return new Observable<T>(observer => {
      const handler = (data: T) => {
        console.log('[Socket] Recibido:', event, data);
        this.ngZone.run(() => observer.next(data));
      };
      console.log('[Socket] Escuchando evento:', event);
      this.socket.on(event, handler);
      return () => this.socket.off(event, handler);
    });
  }

  off(event: string): void {
    this.socket.off(event);
  }
}
