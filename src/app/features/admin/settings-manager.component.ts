import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-settings-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-4xl">
      
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-extrabold text-white">System & Integration Credentials</h1>
        <p class="text-xs text-slate-400 mt-1">Configure Razorpay payment gateway parameters, private GitHub PAT tokens, and store identity.</p>
      </div>

      <div *ngIf="successMessage" class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
        <i class="fa-solid fa-check-circle"></i>
        <span>{{ successMessage }}</span>
      </div>

      <div class="space-y-6">
        
        <!-- Razorpay Configuration -->
        <div class="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div class="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <i class="fa-solid fa-credit-card"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">Razorpay Payment Gateway</h3>
              <p class="text-[11px] text-slate-400">Used for customer orders, webhook verification, and automated refund processing.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-bold text-slate-300 mb-1">Razorpay Key ID</label>
              <input type="text" [(ngModel)]="settings.razorpay_key_id" placeholder="rzp_live_..." class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono">
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">Razorpay Key Secret</label>
              <input type="password" [(ngModel)]="settings.razorpay_key_secret" placeholder="••••••••••••••••" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono">
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-300 mb-1 text-xs">Razorpay Webhook Secret</label>
            <input type="password" [(ngModel)]="settings.razorpay_webhook_secret" placeholder="Webhook signing secret" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs">
          </div>
        </div>

        <!-- GitHub Integration -->
        <div class="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div class="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-white flex items-center justify-center">
              <i class="fa-brands fa-github"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">GitHub Private Release Integration</h3>
              <p class="text-[11px] text-slate-400">Server-side PAT token used to stream release zip files without exposing repos or tokens to customers.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-bold text-slate-300 mb-1">GitHub Personal Access Token (PAT)</label>
              <input type="password" [(ngModel)]="settings.github_access_token" placeholder="ghp_..." class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono">
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">Default Organization / Owner</label>
              <input type="text" [(ngModel)]="settings.github_org_name" placeholder="bracezin-mdu" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white">
            </div>
          </div>
        </div>

        <!-- Store Identity -->
        <div class="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div class="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <i class="fa-solid fa-store"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">Store Identity & Support</h3>
              <p class="text-[11px] text-slate-400">Customer notification email and store branding metadata.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-bold text-slate-300 mb-1">Store Name</label>
              <input type="text" [(ngModel)]="settings.store_name" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white">
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">Support Email</label>
              <input type="email" [(ngModel)]="settings.store_email" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white">
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button (click)="saveSettings()" [disabled]="saving"
                  class="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 disabled:opacity-50">
            <i *ngIf="saving" class="fa-solid fa-circle-notch fa-spin"></i>
            <span>{{ saving ? 'Saving Settings...' : 'Save Configuration' }}</span>
          </button>
        </div>

      </div>

    </div>
  `
})
export class AdminSettingsManagerComponent implements OnInit {
  private admin = inject(AdminService);

  settings: any = {
    store_name: 'Bracezin Soft Store',
    store_email: 'projects.bracezin@gmail.com',
    razorpay_key_id: '',
    razorpay_key_secret: '',
    razorpay_webhook_secret: '',
    github_access_token: '',
    github_org_name: 'bracezin-mdu',
  };

  saving = false;
  successMessage = '';

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.admin.getSettings().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          Object.keys(res.data).forEach(key => {
            this.settings[key] = res.data[key]?.value ?? '';
          });
        }
      }
    });
  }

  saveSettings(): void {
    this.saving = true;
    this.successMessage = '';

    const payload = Object.keys(this.settings).map(key => ({
      key,
      value: this.settings[key]
    }));

    this.admin.updateSettings(payload).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'System settings & API credentials updated successfully!';
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: () => {
        this.saving = false;
        alert('Failed to update system settings.');
      }
    });
  }
}

