import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialService } from '../../core/services/social.service';
import { SocialShareData } from '../../core/models';

@Component({
  selector: 'app-social-share-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div class="glass-panel w-full max-w-md rounded-2xl border border-slate-800 p-6 shadow-2xl relative" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-share-nodes text-blue-400"></i> Share Software
            </h3>
            <p class="text-xs text-slate-400 mt-0.5 truncate max-w-[280px]">{{ shareData?.product_name }}</p>
          </div>
          <button (click)="close.emit()" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Social Grid -->
        <div class="grid grid-cols-3 gap-3 my-6">
          
          <!-- WhatsApp -->
          <button (click)="share('whatsapp')" 
                  class="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/20 text-emerald-400 transition-all group">
            <i class="fa-brands fa-whatsapp text-2xl mb-1 group-hover:scale-110 transition-transform"></i>
            <span class="text-xs font-semibold">WhatsApp</span>
          </button>

          <!-- Twitter / X -->
          <button (click)="share('twitter')" 
                  class="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-400 hover:bg-blue-400/10 text-white transition-all group">
            <i class="fa-brands fa-x-twitter text-2xl mb-1 group-hover:scale-110 transition-transform"></i>
            <span class="text-xs font-semibold">X (Twitter)</span>
          </button>

          <!-- LinkedIn -->
          <button (click)="share('linkedin')" 
                  class="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 hover:border-sky-500/50 hover:bg-sky-500/20 text-sky-400 transition-all group">
            <i class="fa-brands fa-linkedin-in text-2xl mb-1 group-hover:scale-110 transition-transform"></i>
            <span class="text-xs font-semibold">LinkedIn</span>
          </button>

          <!-- Facebook -->
          <button (click)="share('facebook')" 
                  class="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-600/10 border border-blue-600/20 hover:border-blue-600/50 hover:bg-blue-600/20 text-blue-400 transition-all group">
            <i class="fa-brands fa-facebook-f text-2xl mb-1 group-hover:scale-110 transition-transform"></i>
            <span class="text-xs font-semibold">Facebook</span>
          </button>

          <!-- Telegram -->
          <button (click)="share('telegram')" 
                  class="flex flex-col items-center justify-center p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/20 text-cyan-400 transition-all group">
            <i class="fa-brands fa-telegram text-2xl mb-1 group-hover:scale-110 transition-transform"></i>
            <span class="text-xs font-semibold">Telegram</span>
          </button>

          <!-- Email -->
          <button (click)="share('email')" 
                  class="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/50 hover:bg-indigo-500/20 text-indigo-400 transition-all group">
            <i class="fa-solid fa-envelope text-2xl mb-1 group-hover:scale-110 transition-transform"></i>
            <span class="text-xs font-semibold">Email</span>
          </button>

        </div>

        <!-- Copy Link Section -->
        <div class="mt-4 pt-4 border-t border-slate-800">
          <label class="block text-xs font-semibold text-slate-400 mb-1.5">Direct Share & Referral Link</label>
          <div class="flex items-center gap-2">
            <input type="text" [value]="directUrl" readonly
                   class="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-blue-500">
            <button (click)="copyLink()"
                    class="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    [ngClass]="copied ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'">
              <i class="fa-solid mr-1" [ngClass]="copied ? 'fa-check' : 'fa-copy'"></i>
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class SocialShareModalComponent {
  @Input() shareData: SocialShareData | null = null;
  @Output() close = new EventEmitter<void>();

  private social = inject(SocialService);
  copied = false;

  get directUrl(): string {
    return this.shareData?.platforms?.['copy_link']?.url || window.location.href;
  }

  share(platform: string): void {
    if (!this.shareData) return;
    const target = this.shareData.platforms[platform];
    if (target) {
      this.social.openShareWindow(target.url, platform, this.shareData.product_slug, this.shareData.referral_code);
    }
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.directUrl);
    this.copied = true;
    setTimeout(() => this.copied = false, 2500);
  }
}

