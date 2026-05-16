import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { PopupService } from 'src/app/services/popup.service';
import { ViewTiktokComponent } from '../view-tiktok/view-tiktok.component';
import { DeleteContentComponent } from '../delete-content/delete-content.component';
import { SlicePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tiktok',
  templateUrl: './tiktok.component.html',
  styleUrls: ['./tiktok.component.scss'],
  standalone: true,
  imports: [
    SlicePipe,
    TranslatePipe,
    IonCard,
    IonCardContent,
    DeleteContentComponent,
  ],
})
export class TiktokComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() contenido: any;
  @Input() idpost!: any;
  @Input() session: boolean = false;

  constructor(
    public popUp: PopupService
  ) {}

  ngOnInit() {}

  toggleIcon(item: any, event: Event) {
    event.stopPropagation();
    item.showIcon = !item.showIcon;
  }

  async viewcontent(data: any) {
    const result = await this.popUp.showPopupDinamic(
      {
        title: 'Ver Contenido TikTok',
        message: 'TikTok',
        confirmText: '',
        id: data,
        cssClass: 'tiktok-popup-modal',
      },
      ViewTiktokComponent
    );

    if (result?.cancelled) {
      console.warn('Modal no se abrió porque ya existía uno');
    } else if (result?.error) {
      console.error('Error al abrir modal:', result.message);
    }
  }
  ngAfterViewInit() {
    this.cargarTikTokScript().then(() => {
      this.reprocesarEmbeds();
    });
  }

  ngOnDestroy() {
    // Limpieza opcional si tu modal se destruye y quieres quitar el script
    const script = document.getElementById('tiktok-embed-script');
    if (script) {
      script.remove();
    }
  }

  private cargarTikTokScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Verificamos si ya está cargado
      if (document.getElementById('tiktok-embed-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'tiktok-embed-script';
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    });
  }

  private reprocesarEmbeds() {
    // Forzamos a TikTok a re-renderizar
    if ((window as any).tiktokEmbedLoaded) {
      (window as any).tiktokEmbedLoaded();
    } else {
      // TikTok se autoejecuta al encontrar blockquotes,
      // pero si ya estaba cargado, podemos recrear el script para reprocesar
      const oldScript = document.getElementById('tiktok-embed-script');
      if (oldScript) oldScript.remove();
      this.cargarTikTokScript();
    }
  }
}
