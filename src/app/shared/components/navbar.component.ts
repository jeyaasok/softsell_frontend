import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <nav class="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Brand Logo -->
          <div class="flex items-center gap-3">
            <a routerLink="/" class="flex items-center gap-2.5 group">
              <div class="w-10 h-10 rounded-xl bg-slate-900/70 border border-slate-800 p-1 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <img [src]="brandIconPath" alt="Bracezin logo" class="w-full h-full object-contain">
              </div>
              <div>
                <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
                  BRACEZIN
                </span>
                <span class="block text-[10px] font-semibold tracking-widest text-blue-400 uppercase -mt-1">SOFT STORE</span>
              </div>
            </a>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center gap-1">
            <a routerLink="/" routerLinkActive="text-blue-400 bg-slate-900/60" [routerLinkActiveOptions]="{exact: true}"
               class="px-3.5 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-900/40 transition-colors">
              Explore Store
            </a>
            <a *ngIf="auth.isLoggedIn()" routerLink="/my-purchases" routerLinkActive="text-blue-400 bg-slate-900/60"
               class="px-3.5 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-900/40 transition-colors">
              <i class="fa-solid fa-cloud-arrow-down mr-1.5 text-blue-400"></i> My Purchases
            </a>
            <a *ngIf="auth.isAdmin()" routerLink="/admin" routerLinkActive="text-blue-400 bg-slate-900/60"
               class="px-3.5 py-2 text-sm font-medium rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors">
              <i class="fa-solid fa-shield-halved mr-1.5 text-amber-400"></i> Admin Portal
            </a>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center gap-3">
            
            <!-- Cart Button -->
            <a routerLink="/cart" class="relative p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all">
              <i class="fa-solid fa-bag-shopping text-base"></i>
              <span *ngIf="cart.count() > 0" class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-blue-500/50">
                {{ cart.count() }}
              </span>
            </a>

            <!-- Auth Buttons / User Profile -->
            <ng-container *ngIf="auth.isLoggedIn(); else guestActions">
              <div class="relative group">
                <button class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 hover:border-slate-700 transition-colors">
                  <img [src]="auth.currentUser()?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff'" 
                       class="w-7 h-7 rounded-lg object-cover" alt="Avatar">
                  <span class="text-sm font-medium max-w-[120px] truncate">{{ auth.currentUser()?.name }}</span>
                  <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 group-hover:rotate-180 transition-transform"></i>
                </button>

                <!-- Dropdown Menu -->
                <div class="absolute right-0 mt-2 w-56 glass-panel rounded-2xl border border-slate-800 p-2 hidden group-hover:block hover:block shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div class="px-3 py-2 border-b border-slate-800/80 mb-1">
                    <p class="text-xs text-slate-400">Signed in as</p>
                    <p class="text-sm font-semibold text-slate-200 truncate">{{ auth.currentUser()?.email }}</p>
                    <span class="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {{ auth.currentUser()?.role }}
                    </span>
                  </div>
                  <a routerLink="/my-purchases" class="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 rounded-lg hover:bg-slate-800/60 hover:text-white transition-colors">
                    <i class="fa-solid fa-box-open text-blue-400"></i> My Software & Keys
                  </a>
                  <a *ngIf="auth.isAdmin()" routerLink="/admin" class="flex items-center gap-2.5 px-3 py-2 text-sm text-amber-400 rounded-lg hover:bg-amber-500/10 transition-colors">
                    <i class="fa-solid fa-gauge-high"></i> Admin Dashboard
                  </a>
                  <button (click)="auth.logout()" class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors text-left mt-1 border-t border-slate-800/60">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
                  </button>
                </div>
              </div>
            </ng-container>

            <ng-template #guestActions>
              <a routerLink="/login" class="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Sign In
              </a>
              <a routerLink="/register" class="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                Get Started
              </a>
            </ng-template>

          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  public auth = inject(AuthService);
  public cart = inject(CartService);
  public brandIconPath = environment.app.brandIconPath;
}

