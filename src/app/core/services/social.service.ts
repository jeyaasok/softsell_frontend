import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  private api = inject(ApiService);

  getShareLinks(productSlug: string): Observable<any> {
    return this.api.get<any>(`/products/${productSlug}/share-links`);
  }

  trackClick(productSlug: string, platform: string, referralCode?: string): Observable<any> {
    return this.api.post<any>('/social/track-click', {
      product_slug: productSlug,
      platform,
      referral_code: referralCode
    });
  }

  openShareWindow(url: string, platform: string, productSlug: string, referralCode?: string): void {
    this.trackClick(productSlug, platform, referralCode).subscribe({ error: () => {} });
    
    if (platform === 'email') {
      window.location.href = url;
    } else if (platform === 'copy_link') {
      navigator.clipboard.writeText(url);
    } else {
      window.open(url, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes');
    }
  }
}

