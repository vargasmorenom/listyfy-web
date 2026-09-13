import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmbedUrlService {
  youtube(item: any): string {
    return `https://www.youtube.com/embed/${item.id}?autoplay=1`;
  }

  instagram(item: any): string {
    return `https://www.instagram.com/p/${item.id}/embed/`;
  }

  twitter(item: any): string {
    return `https://platform.twitter.com/embed/Tweet.html?id=${item.id}`;
  }

  tiktok(item: any): string {
    return `https://www.tiktok.com/embed/v2/${item.id}`;
  }

  linkedin(item: any): string {
    const postId = item.idpost ?? item.id;
    return `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${postId}?compact=1`;
  }

  telegram(item: any): string {
    return `https://t.me/${item.id}?embed=1&color=2AABEE`;
  }

  facebook(item: any): string {
    const tipo = item.listas?.tipo ?? item.tipo ?? 'posts';
    const postId = item.listas?.id ?? item.id;
    const postId1 = item.listas?.id1 ?? item.id1;

    switch (tipo) {
      case 'videos':
        return `https://www.facebook.com/video/embed?video_id=${postId}`;
      case 'reel': {
        const href = encodeURIComponent(`https://www.facebook.com/reel/${postId}/`);
        return `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&height=476&width=267`;
      }
      case 'photo': {
        const href = encodeURIComponent(
          `https://www.facebook.com/photo.php?fbid=${postId}&set=${postId1}&type=3`
        );
        return `https://www.facebook.com/plugins/post.php?href=${href}&show_text=true&width=500`;
      }
      default: {
        const href = encodeURIComponent(`https://www.facebook.com/watch?v=${postId}`);
        return `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&width=500`;
      }
    }
  }

  /** Devuelve la URL de embed cruda para un typePost (1-7) e item dado, o null si el tipo no está soportado. */
  buildEmbedUrl(typePost: number, item: any): string | null {
    switch (Number(typePost)) {
      case 1:
        return this.twitter(item);
      case 2:
        return this.facebook(item);
      case 3:
        return this.instagram(item);
      case 4:
        return this.tiktok(item);
      case 5:
        return this.youtube(item);
      case 6:
        return this.linkedin(item);
      case 7:
        return this.telegram(item);
      default:
        return null;
    }
  }
}
