import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DownloadService } from '../../core/services/download.service';
import { AuthService } from '../../core/services/auth.service';
import { Entitlement } from '../../core/models';

@Component({
  selector: 'app-my-purchases',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">
      
      <!-- Welcome Header -->
      <div class="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <img [src]="auth.currentUser()?.avatar_url || 'https://ui-avatars.com/api/?name=User'" 
               class="w-14 h-14 rounded-2xl border border-slate-700 object-cover" alt="Avatar">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-extrabold text-white">{{ auth.currentUser()?.name }}</h1>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                Verified Customer
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">{{ auth.currentUser()?.email }} • Member since {{ auth.currentUser()?.created_at | date:'mediumDate' }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <a routerLink="/" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
            <i class="fa-solid fa-bag-shopping"></i> Browse Store
          </a>
        </div>
      </div>

      <!-- Main Purchases Section -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-white flex items-center gap-2.5">
              <i class="fa-solid fa-box-open text-blue-400"></i> My Purchased Software & Entitlements
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">Secure, authenticated downloads delivered via private GitHub releases.</p>
          </div>
          <span class="text-xs text-slate-400 font-semibold">
            {{ entitlements.length }} Total Software Packages
          </span>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="space-y-4">
          <div *ngFor="let i of [1,2]" class="glass-card rounded-2xl p-6 h-48 animate-pulse bg-slate-900/40"></div>
        </div>

        <!-- Empty state -->
        <div *ngIf="!loading && entitlements.length === 0" class="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <div class="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto text-xl">
            <i class="fa-solid fa-cube"></i>
          </div>
          <h3 class="text-lg font-bold text-white">No software purchases yet</h3>
          <p class="text-xs text-slate-400">Explore the marketplace and acquire your first software package or SaaS starter.</p>
          <a routerLink="/" class="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all">
            Browse Software
          </a>
        </div>

        <!-- Entitlement Cards Grid -->
        <div *ngIf="!loading && entitlements.length > 0" class="space-y-6">
          <div *ngFor="let ent of entitlements" 
               class="glass-panel rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 relative overflow-hidden">
            
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              
              <!-- Product info -->
              <div class="flex items-start sm:items-center gap-4">
                <img [src]="ent.product.thumbnail_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80'" 
                     class="w-16 h-16 rounded-2xl object-cover border border-slate-800 bg-slate-900 flex-shrink-0" [alt]="ent.product.name">
                <div>
                  <div class="flex items-center gap-2.5 flex-wrap">
                    <h3 class="text-lg font-bold text-white">{{ ent.product.name }}</h3>
                    <span class="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {{ ent.product.current_version }}
                    </span>
                    <span *ngIf="ent.status === 'active'" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active Entitlement
                    </span>
                    <span *ngIf="ent.status === 'revoked'" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Revoked (Refunded)
                    </span>
                  </div>
                  <p class="text-xs text-slate-400 mt-1">
                    Order Ref: <span class="font-mono text-slate-300 font-semibold">{{ ent.order?.order_number }}</span> • Purchased on {{ ent.access_granted_at | date:'mediumDate' }}
                  </p>
                </div>
              </div>

              <!-- 1-Click Secure Download Button -->
              <div class="flex items-center gap-3">
                <button *ngIf="ent.status === 'active'" 
                        (click)="download(ent)" 
                        [disabled]="downloadingId === ent.id"
                        class="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 disabled:opacity-50">
                  <i *ngIf="downloadingId === ent.id" class="fa-solid fa-circle-notch fa-spin"></i>
                  <i *ngIf="downloadingId !== ent.id" class="fa-solid fa-cloud-arrow-down text-sm"></i>
                  <span>{{ downloadingId === ent.id ? 'Generating Token...' : 'Download Package (.zip)' }}</span>
                </button>
                
                <a *ngIf="ent.product.documentation_url" [href]="ent.product.documentation_url" target="_blank"
                   class="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors" title="Documentation">
                  <i class="fa-solid fa-book text-sm"></i>
                </a>
              </div>

            </div>

            <!-- Details Row: License Key & Download Quota -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- License Key Block -->
              <div *ngIf="ent.license_key" class="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <i class="fa-solid fa-key text-amber-400"></i> Assigned Software License Key
                  </span>
                  <span class="text-[11px] text-slate-400">
                    Activations: {{ ent.license_key.current_activations }}/{{ ent.license_key.max_activations }}
                  </span>
                </div>
                
                <div class="flex items-center gap-2">
                  <span class="font-mono text-sm font-bold text-amber-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 select-all flex-1">
                    {{ ent.license_key.license_key }}
                  </span>
                  <button (click)="copyLicense(ent.license_key.license_key, ent.id)" 
                          class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors">
                    {{ copiedKeyId === ent.id ? 'Copied!' : 'Copy' }}
                  </button>
                </div>
              </div>

              <!-- Download Quota Block -->
              <div class="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <i class="fa-solid fa-shield-halved text-blue-400"></i> Download Telemetry & Access
                  </span>
                  <span class="text-[11px] text-slate-400">
                    {{ ent.download_count }} / {{ ent.max_downloads }} Used
                  </span>
                </div>
                <div class="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div class="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                       [style.width.%]="(ent.download_count / ent.max_downloads) * 100"></div>
                </div>
                <p class="text-[10px] text-slate-500">
                  Single-use cryptographic tokens expire in 60 seconds after issuance to prevent hotlinking.
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  `
})
export class MyPurchasesComponent implements OnInit {
  public auth = inject(AuthService);
  private downloadService = inject(DownloadService);

  entitlements: Entitlement[] = [];
  loading = true;
  downloadingId: number | null = null;
  copiedKeyId: number | null = null;

  ngOnInit(): void {
    this.loadEntitlements();
  }

  loadEntitlements(): void {
    this.loading = true;
    this.downloadService.getMyDownloads().subscribe({
      next: (res) => {
        if (res.success) {
          this.entitlements = res.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  download(entitlement: Entitlement): void {
    this.downloadingId = entitlement.id;

    this.downloadService.initiateSecureDownload(entitlement.product_id).subscribe({
      next: () => {
        setTimeout(() => {
          this.downloadingId = null;
          // Refresh download count
          entitlement.download_count++;
        }, 1500);
      },
      error: (err) => {
        this.downloadingId = null;
        alert(err.error?.message || 'Failed to generate download token.');
      }
    });
  }

  copyLicense(key: string, id: number): void {
    navigator.clipboard.writeText(key);
    this.copiedKeyId = id;
    setTimeout(() => this.copiedKeyId = null, 2500);
  }
}

