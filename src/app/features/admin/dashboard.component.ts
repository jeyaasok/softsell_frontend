import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { AdminStats } from '../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">
      
      <!-- Top Overview Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-white">Executive Store Analytics</h1>
          <p class="text-xs text-slate-400 mt-1">Real-time revenue, download telemetry, and order fulfillment status.</p>
        </div>
        <button (click)="loadStats()" class="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors">
          <i class="fa-solid fa-rotate text-blue-400"></i> Refresh
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
        <div *ngFor="let i of [1,2,3,4]" class="glass-card rounded-2xl p-6 h-32 bg-slate-900/40"></div>
      </div>

      <!-- Metric Cards Grid -->
      <div *ngIf="!loading && stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- Total Revenue -->
        <div class="glass-panel rounded-2xl p-6 border border-slate-800 space-y-2 relative overflow-hidden">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <i class="fa-solid fa-indian-rupee-sign text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-extrabold text-white">₹{{ stats.metrics.total_revenue | number:'1.0-0' }}</p>
          <span class="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <i class="fa-solid fa-arrow-trend-up"></i> 100% Razorpay Verified
          </span>
        </div>

        <!-- Total Orders -->
        <div class="glass-panel rounded-2xl p-6 border border-slate-800 space-y-2 relative overflow-hidden">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-xs font-bold uppercase tracking-wider">Completed Orders</span>
            <div class="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <i class="fa-solid fa-bag-shopping text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-extrabold text-white">{{ stats.metrics.total_orders }}</p>
          <span class="text-[11px] text-blue-400 font-semibold">Active Commercial Customers</span>
        </div>

        <!-- Software Downloads -->
        <div class="glass-panel rounded-2xl p-6 border border-slate-800 space-y-2 relative overflow-hidden">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-xs font-bold uppercase tracking-wider">Verified Downloads</span>
            <div class="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <i class="fa-solid fa-cloud-arrow-down text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-extrabold text-white">{{ stats.metrics.total_downloads }}</p>
          <span class="text-[11px] text-purple-400 font-semibold">Gated Single-Use Tokens</span>
        </div>

        <!-- Active Products -->
        <div class="glass-panel rounded-2xl p-6 border border-slate-800 space-y-2 relative overflow-hidden">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-xs font-bold uppercase tracking-wider">Catalog Products</span>
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <i class="fa-solid fa-cube text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-extrabold text-white">{{ stats.metrics.total_products }}</p>
          <span class="text-[11px] text-amber-400 font-semibold">In Active Catalog</span>
        </div>

      </div>

      <!-- Recent Orders & Top Products Grid -->
      <div *ngIf="!loading && stats" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Recent Orders Table (2 cols) -->
        <div class="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-receipt text-blue-400"></i> Recent Orders
            </h3>
            <a routerLink="/admin/orders" class="text-xs text-blue-400 hover:underline font-semibold">View All</a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                <tr>
                  <th class="py-2.5">Order</th>
                  <th class="py-2.5">Customer</th>
                  <th class="py-2.5">Amount</th>
                  <th class="py-2.5">Status</th>
                  <th class="py-2.5">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                <tr *ngFor="let order of stats.recent_orders" class="hover:bg-slate-900/40">
                  <td class="py-3 font-mono font-bold text-blue-400">{{ order.order_number }}</td>
                  <td class="py-3 font-medium text-slate-200">{{ order.user?.name }}</td>
                  <td class="py-3 font-bold text-white">₹{{ order.net_amount | number:'1.0-0' }}</td>
                  <td class="py-3">
                    <span [ngClass]="order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'"
                          class="px-2 py-0.5 rounded text-[10px] font-bold border capitalize">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="py-3 text-slate-400">{{ order.created_at | date:'shortDate' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top Selling Products (1 col) -->
        <div class="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div class="pb-3 border-b border-slate-800">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-trophy text-amber-400"></i> Top Products
            </h3>
          </div>

          <div class="space-y-3">
            <div *ngFor="let prod of stats.top_products" class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div class="truncate mr-3">
                <p class="text-xs font-bold text-white truncate">{{ prod.name }}</p>
                <p class="text-[10px] text-slate-400">₹{{ (prod.discount_price || prod.price) | number:'1.0-0' }}</p>
              </div>
              <span class="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold whitespace-nowrap">
                {{ prod.current_version }}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private admin = inject(AdminService);

  stats: AdminStats | null = null;
  loading = true;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.admin.getStats().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}

