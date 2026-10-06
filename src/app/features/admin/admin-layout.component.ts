import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex flex-col lg:flex-row min-h-[calc(100vh-140px)] gap-8">
      
      <!-- Admin Sidebar Navigation -->
      <aside class="w-full lg:w-64 flex-shrink-0">
        <div class="glass-panel rounded-3xl p-5 border border-slate-800 space-y-6 sticky top-24">
          
          <div class="pb-4 border-b border-slate-800">
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">Administration</span>
            <h2 class="text-lg font-bold text-white mt-0.5">Control Center</h2>
          </div>

          <nav class="space-y-1.5">
            <a routerLink="/admin" routerLinkActive="bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20" [routerLinkActiveOptions]="{exact: true}"
               class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors">
              <i class="fa-solid fa-chart-line text-sm w-4"></i> Dashboard & Sales
            </a>
            
            <a routerLink="/admin/products" routerLinkActive="bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
               class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors">
              <i class="fa-solid fa-cube text-sm w-4"></i> Products & Releases
            </a>
            
            <a routerLink="/admin/orders" routerLinkActive="bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
               class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors">
              <i class="fa-solid fa-receipt text-sm w-4"></i> Orders & Refunds
            </a>

            <a routerLink="/admin/download-logs" routerLinkActive="bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
               class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors">
              <i class="fa-solid fa-shield-halved text-sm w-4"></i> Download Telemetry
            </a>

            <a routerLink="/admin/settings" routerLinkActive="bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
               class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors">
              <i class="fa-solid fa-sliders text-sm w-4"></i> System Settings
            </a>
          </nav>

          <div class="pt-4 border-t border-slate-800">
            <a routerLink="/" class="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
              <i class="fa-solid fa-arrow-left"></i> Return to Storefront
            </a>
          </div>

        </div>
      </aside>

      <!-- Admin Main Content Area -->
      <main class="flex-1 min-w-0">
        <router-outlet></router-outlet>
      </main>

    </div>
  `
})
export class AdminLayoutComponent {
  public auth = inject(AuthService);
}

