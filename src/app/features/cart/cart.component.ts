import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-8">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-white">Your Shopping Cart</h1>
          <p class="text-xs text-slate-400 mt-1">Review your selected software packages and proceed to checkout.</p>
        </div>
        <button *ngIf="cart.count() > 0" (click)="cart.clearCart()" 
                class="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors">
          Clear Cart
        </button>
      </div>

      <!-- Empty Cart State -->
      <div *ngIf="cart.count() === 0" class="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
        <div class="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto text-2xl">
          <i class="fa-solid fa-cart-shopping"></i>
        </div>
        <h3 class="text-xl font-bold text-white">Your cart is currently empty</h3>
        <p class="text-xs text-slate-400">Explore our catalog of production-ready software and developer suites.</p>
        <a routerLink="/" class="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all">
          Explore Software Catalog
        </a>
      </div>

      <!-- Cart with items -->
      <div *ngIf="cart.count() > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Items List -->
        <div class="lg:col-span-2 space-y-4">
          <div *ngFor="let item of cart.items()" 
               class="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div class="flex items-center gap-4">
              <img [src]="item.product.thumbnail_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80'" 
                   class="w-16 h-16 rounded-xl object-cover border border-slate-800 bg-slate-900 flex-shrink-0" [alt]="item.product.name">
              <div>
                <a [routerLink]="['/products', item.product.slug]" class="text-sm font-bold text-white hover:text-blue-400 transition-colors line-clamp-1">
                  {{ item.product.name }}
                </a>
                <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 mt-1">
                  {{ item.product.current_version }}
                </span>
                <span class="text-xs text-slate-400 ml-2">{{ item.product.category?.name }}</span>
              </div>
            </div>

            <div class="flex items-center justify-between w-full sm:w-auto sm:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
              <div class="text-right">
                <p class="text-base font-extrabold text-white">
                  ₹{{ (item.product.discount_price || item.product.price) | number:'1.0-0' }}
                </p>
                <p *ngIf="item.product.discount_price" class="text-[10px] text-slate-500 line-through">
                  ₹{{ item.product.price | number:'1.0-0' }}
                </p>
              </div>

              <button (click)="cart.removeFromCart(item.product.id)" 
                      class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 flex items-center justify-center transition-colors"
                      title="Remove">
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            </div>

          </div>
        </div>

        <!-- Order Summary & Checkout Card -->
        <div class="space-y-6">
          <div class="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
            <h3 class="text-lg font-bold text-white pb-4 border-b border-slate-800">Order Summary</h3>

            <div class="space-y-3 text-xs">
              <div class="flex items-center justify-between text-slate-300">
                <span>Items Subtotal</span>
                <span class="font-bold text-white">₹{{ cart.subtotal() | number:'1.0-0' }}</span>
              </div>
              <div class="flex items-center justify-between text-slate-300">
                <span>Estimated Tax (GST)</span>
                <span class="text-emerald-400 font-semibold">Included</span>
              </div>
              <div class="flex items-center justify-between text-slate-300">
                <span>Delivery Type</span>
                <span class="text-blue-400 font-semibold">Instant Digital Download</span>
              </div>
              
              <div class="pt-4 border-t border-slate-800 flex items-baseline justify-between">
                <span class="text-sm font-bold text-white">Total Amount</span>
                <span class="text-2xl font-extrabold text-white">₹{{ cart.subtotal() | number:'1.0-0' }}</span>
              </div>
            </div>

            <!-- Checkout Action Button -->
            <button (click)="proceedToCheckout()" [disabled]="processing"
                    class="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              <i *ngIf="processing" class="fa-solid fa-circle-notch fa-spin"></i>
              <i *ngIf="!processing" class="fa-solid fa-lock text-emerald-300"></i>
              <span>{{ processing ? 'Processing...' : 'Pay with Razorpay' }}</span>
            </button>

            <!-- Trust Badge -->
            <div class="text-center space-y-1 pt-2">
              <p class="text-[11px] text-slate-400">
                <i class="fa-solid fa-shield-check text-emerald-400 mr-1"></i> Gated single-use download tokens issued immediately upon payment.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  `
})
export class CartComponent {
  public cart = inject(CartService);
  private checkoutService = inject(CheckoutService);
  private auth = inject(AuthService);
  private router = inject(Router);

  processing = false;

  proceedToCheckout(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }

    const items = this.cart.items().map(i => ({ product_id: i.product.id, quantity: 1 }));
    if (items.length === 0) return;

    this.processing = true;

    this.checkoutService.createOrder({ items }).subscribe({
      next: (res) => {
        if (res.success && res.data?.razorpay) {
          this.checkoutService.openRazorpayModal(
            res.data.razorpay,
            (paymentResponse) => {
              this.verifyAndComplete(res.data.order_id, paymentResponse);
            },
            () => {
              this.processing = false;
            }
          );
        }
      },
      error: (err) => {
        this.processing = false;
        alert(err.error?.message || 'Failed to initialize Razorpay checkout.');
      }
    });
  }

  private verifyAndComplete(orderId: number, paymentResponse: any): void {
    this.checkoutService.verifyPayment({
      order_id: orderId,
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature
    }).subscribe({
      next: () => {
        this.cart.clearCart();
        this.processing = false;
        this.router.navigate(['/my-purchases']);
      },
      error: (err) => {
        this.processing = false;
        alert('Payment verification error: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }
}

