import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Entitlement } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private api = inject(ApiService);

  getMyDownloads(): Observable<any> {
    return this.api.get<any>('/customer/downloads');
  }

  generateDownloadToken(productId: number, versionId?: number): Observable<any> {
    return this.api.post<any>('/downloads/generate-token', {
      product_id: productId,
      version_id: versionId
    });
  }

  getMyLicenses(): Observable<any> {
    return this.api.get<any>('/customer/licenses');
  }

  /**
   * 1-Click Secure Software Download Engine:
   * Requests single-use ephemeral token from backend and triggers immediate browser stream
   */
  initiateSecureDownload(productId: number, versionId?: number): Observable<any> {
    return this.generateDownloadToken(productId, versionId).pipe(
      tap(res => {
        if (res.success && res.data?.download_url) {
          const downloadUrl = res.data.download_url;
          // Trigger browser direct download without page reload
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', '');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
    );
  }
}

