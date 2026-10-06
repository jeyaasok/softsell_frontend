import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-md mx-auto py-12">
      <div class="glass-panel rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-6 shadow-2xl">
        
        <!-- Header -->
        <div class="text-center space-y-2">
          <div class="w-14 h-14 rounded-2xl bg-slate-900/70 border border-slate-800 p-1.5 mx-auto shadow-lg shadow-blue-500/25">
            <img [src]="brandIconPath" alt="Bracezin logo" class="w-full h-full object-contain">
          </div>
          <h2 class="text-2xl font-extrabold text-white">Sign In to Bracezin</h2>
          <p class="text-xs text-slate-400">Access your purchased software, download tokens, and license keys.</p>
        </div>

        <!-- Error Alert -->
        <div *ngIf="errorMessage" class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Form -->
        <form (ngSubmit)="login()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" required
                   placeholder="e.g. john@example.com"
                   class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required
                   placeholder="••••••••"
                   class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors">
          </div>

          <button type="submit" [disabled]="loading"
                  class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
            <i *ngIf="loading" class="fa-solid fa-circle-notch fa-spin"></i>
            <span>{{ loading ? 'Signing In...' : 'Sign In' }}</span>
          </button>
        </form>

        <!-- Demo Account Quick Switch Buttons -->
        <div class="pt-4 border-t border-slate-800/80 space-y-2.5" *ngIf="!isProduction">
          <p class="text-[11px] text-slate-400 text-center uppercase tracking-wider font-semibold">⚡ Quick Demo Login</p>
          <div class="grid grid-cols-2 gap-2">
            <button (click)="fillCustomer()" type="button"
                    class="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-emerald-400 text-xs font-bold transition-all text-center">
              Customer Demo
            </button>
            <button (click)="fillAdmin()" type="button"
                    class="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-amber-400 text-xs font-bold transition-all text-center">
              Super Admin
            </button>
          </div>
        </div>

        <!-- Footer link -->
        <p class="text-xs text-slate-400 text-center pt-2">
          Don't have an account yet? 
          <a routerLink="/register" class="text-blue-400 font-bold hover:underline">Create Account</a>
        </p>

      </div>
    </div>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  brandIconPath = environment.app.brandIconPath;
  isProduction = environment.production;

  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  login(): void {
    if (!this.email || !this.password) return;

    this.loading = true;
    this.errorMessage = '';

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || (res.data?.user?.role === 'customer' ? '/my-purchases' : '/admin');
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid email or password.';
      }
    });
  }

  fillCustomer(): void {
    this.email = 'customer@bracezin.com';
    this.password = 'Customer@12345';
  }

  fillAdmin(): void {
    this.email = 'admin@bracezin.com';
    this.password = 'Admin@12345';
  }
}

