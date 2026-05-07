import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VIDEO_CONFIG } from './video-config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private sanitizer = inject(DomSanitizer);
  protected readonly title = signal('airi-angular');
  
  // Об'єкт з обробленими посиланнями
  videos = {
    intro: this.getVideoData('intro'),
    infographic: this.getVideoData('infographic'),
    demo: this.getVideoData('demo'),
    fullVideo: this.getVideoData('fullVideo'),
    model3d: this.getVideoData('model3d')
  };

  private getVideoData(key: keyof typeof VIDEO_CONFIG.googleDriveVideos) {
    const gdId = VIDEO_CONFIG.googleDriveVideos[key];
    const isBackground = ['intro', 'infographic', 'model3d'].includes(key);

    if (gdId) {
      if (isBackground) {
        // Використовуємо пряме посилання для тегу <video>, щоб працював loop та autoplay
        return {
          isDrive: true,
          useVideoTag: true,
          url: this.sanitizer.bypassSecurityTrustResourceUrl(`https://drive.google.com/uc?id=${gdId}&export=download`)
        };
      }
      // Для звичайних відео (демо, повне) залишаємо стандартний плеєр Google
      return {
        isDrive: true,
        useVideoTag: false,
        url: this.sanitizer.bypassSecurityTrustResourceUrl(`https://drive.google.com/file/d/${gdId}/preview`)
      };
    }
    
    return {
      isDrive: false,
      useVideoTag: true,
      url: VIDEO_CONFIG.localPaths[key]
    };
  }
}
