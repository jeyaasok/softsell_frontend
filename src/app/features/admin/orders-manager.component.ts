import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Order } from '../../core/models';

@Component({
  selector: 'app-orders-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-white">Orders & Refunds Ledger</h1>
          <p class="text-xs text-slate-400 mt-1">Review Razorpay payments, customer billing, and process entitlement-revoking refunds.</p>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th class="p-4">Order Ref</th>
                <th class="p-4">Customer</th>
                <th class="p-4">Software Items</th>
                <th class="p-4">Amount</th>
                <th class="p-4">Payment</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr *ngFor="let order of orders" class="hover:bg-slate-900/40">
                <td class="p-4 font-mono font-bold text-blue-400">{{ order.order_number }}</td>
                <td class="p-4">
                  <span class="font-bold text-white block">{{ order.user?.name }}</span>
                  <span class="text-[11px] text-slate-400">{{ order.user?.email }}</span>
                </td>
                <td class="p-4">
                  <div *ngFor="let item of order.items" class="text-slate-300">
                    {{ item.product_name }} ({{ item.product_version }})
                  </div>
                </td>
                <td class="p-4 font-bold text-white">₹{{ order.net_amount | number:'1.0-0' }}</td>
                <td class="p-4 font-mono text-[11px]">
                  <span *ngIf="order.latestPayment?.razorpay_payment_id" class="text-emerald-400 font-semibold">
                    {{ order.latestPayment?.razorpay_payment_id }}
                  </span>
                  <span *ngIf="!order.latestPayment?.razorpay_payment_id" class="text-slate-500">Uncaptured</span>
                </td>
                <td class="p-4">
                  <span [ngClass]="order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : (order.status === 'refunded' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20')"
                        class="px-2.5 py-0.5 rounded text-[10px] font-bold border capitalize">
                    {{ order.status }}
                  </span>
                </td>
                <td class="p-4 text-right space-x-2">
                  <button (click)="openDetails(order)" class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-blue-400 text-slate-200 font-bold">
                    View
                  </button>
                  <button *ngIf="order.status === 'completed'" (click)="openRefundModal(order)" class="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 font-bold">
                    Refund
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ORDER DETAILS MODAL -->
      <div *ngIf="selectedOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div class="glass-panel w-full max-w-2xl rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 class="text-lg font-bold text-white">Order {{ selectedOrder.order_number }}</h3>
              <p class="text-xs text-slate-400 mt-0.5">Placed on {{ selectedOrder.created_at | date:'medium' }}</p>
            </div>
            <button (click)="selectedOrder = null" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="space-y-4 text-xs">
            <div class="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <span class="text-slate-400 uppercase font-bold text-[10px] block">Customer</span>
                <span class="text-white font-bold text-sm">{{ selectedOrder.user?.name }}</span>
                <span class="text-slate-400 block">{{ selectedOrder.user?.email }}</span>
              </div>
              <div>
                <span class="text-slate-400 uppercase font-bold text-[10px] block">Payment Total</span>
                <span class="text-white font-extrabold text-base">₹{{ selectedOrder.net_amount | number:'1.0-0' }}</span>
                <span class="text-emerald-400 block font-semibold capitalize">{{ selectedOrder.payment_status }}</span>
              </div>
            </div>

            <div>
              <span class="text-slate-400 uppercase font-bold text-[10px] block mb-2">Purchased Items</span>
              <div *ngFor="let item of selectedOrder.items" class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span class="font-bold text-white">{{ item.product_name }}</span>
                  <span class="text-slate-400 ml-2">({{ item.product_version }})</span>
                </div>
                <span class="font-bold text-white">₹{{ item.total | number:'1.0-0' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- REFUND CONFIRMATION MODAL -->
      <div *ngIf="refundTargetOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div class="glass-panel w-full max-w-md rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
          <h3 class="text-base font-bold text-rose-400 flex items-center gap-2">
            <i class="fa-solid fa-triangle-exclamation"></i> Issue Refund & Revoke Access
          </h3>
          <p class="text-xs text-slate-300 leading-relaxed">
            Processing this refund will call the Razorpay Refund API for <span class="font-bold text-white">₹{{ refundTargetOrder.net_amount }}</span> and instantly revoke the customer's download entitlement and invalidate their license keys.
          </p>

          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Reason for Refund</label>
            <input type="text" [(ngModel)]="refundReason" placeholder="e.g. Customer requested refund / duplicate payment" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
          </div>

          <div class="flex justify-end gap-3 pt-3">
            <button (click)="refundTargetOrder = null" class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">Cancel</button>
            <button (click)="submitRefund()" [disabled]="processingRefund" class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold disabled:opacity-50">
              {{ processingRefund ? 'Processing Refund...' : 'Confirm Refund & Revoke' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class AdminOrdersManagerComponent implements OnInit {
  private admin = inject(AdminService);

  orders: Order[] = [];
  selectedOrder: Order | null = null;
  refundTargetOrder: Order | null = null;
  refundReason = 'Customer requested refund';
  processingRefund = false;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.admin.getOrders().subscribe({
      next: (res) => {
        if (res.success) this.orders = res.data?.data || res.data || [];
      }
    });
  }

  openDetails(order: Order): void {
    this.selectedOrder = order;
  }

  openRefundModal(order: Order): void {
    this.refundTargetOrder = order;
  }

  submitRefund(): void {
    if (!this.refundTargetOrder) return;
    this.processingRefund = true;

    this.admin.issueRefund(this.refundTargetOrder.id, this.refundReason).subscribe({
      next: () => {
        this.processingRefund = false;
        this.refundTargetOrder = null;
        this.loadOrders();
      },
      error: (err) => {
        this.processingRefund = false;
        alert(err.error?.message || 'Refund processing failed.');
      }
    });
  }
}

