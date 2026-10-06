import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
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
          <h2 class="text-2xl font-extrabold text-white">Get Started</h2>
          <p class="text-xs text-slate-400">Join Bracezin Soft Store for secure software purchases and automated downloads.</p>
        </div>

        <!-- Error Alert -->
        <div *ngIf="errorMessage" class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Form -->
        <form (ngSubmit)="register()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Full Name</label>
            <input type="text" [(ngModel)]="name" name="name" required
                   placeholder="e.g. Alex Morgan"
                   class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" required
                   placeholder="e.g. alex@example.com"
                   class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Phone Number (Optional)</label>
            <input type="text" [(ngModel)]="phone" name="phone"
                   placeholder="+91 9876543210"
                   class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required minlength="8"
                   placeholder="At least 8 characters"
                   class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Confirm Password</label>
            <input type="password" [(ngModel)]="passwordConfirmation" name="passwordConfirmation" required
                   placeholder="Re-enter password"
                   class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors">
          </div>

          <button type="submit" [disabled]="loading"
                  class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
            <i *ngIf="loading" class="fa-solid fa-circle-notch fa-spin"></i>
            <span>{{ loading ? 'Creating Account...' : 'Register & Continue' }}</span>
          </button>
        </form>

        <!-- Footer link -->
        <p class="text-xs text-slate-400 text-center pt-2">
          Already have an account? 
          <a routerLink="/login" class="text-blue-400 font-bold hover:underline">Sign In</a>
        </p>

      </div>
    </div>
  `
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  brandIconPath = environment.app.brandIconPath;

  name = '';
  email = '';
  phone = '';
  password = '';
  passwordConfirmation = '';
  loading = false;
  errorMessage = '';

  register(): void {
    if (this.password !== this.passwordConfirmation) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.auth.register({
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      password_confirmation: this.passwordConfirmation,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/my-purchases']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please check your details.';
      }
    });
  }
}

