import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';
import { SocialService } from '../../core/services/social.service';
import { Product, SocialShareData } from '../../core/models';
import { SocialShareModalComponent } from '../../shared/components/social-share-modal.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SocialShareModalComponent],
  template: `
    <div *ngIf="loading" class="space-y-8 animate-pulse">
      <div class="h-64 glass-panel rounded-3xl bg-slate-900/50"></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 h-96 glass-panel rounded-3xl bg-slate-900/50"></div>
        <div class="h-96 glass-panel rounded-3xl bg-slate-900/50"></div>
      </div>
    </div>

    <div *ngIf="!loading && product" class="space-y-10">
      
      <!-- Top Breadcrumbs & Header -->
      <div>
        <nav class="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <a routerLink="/" class="hover:text-white transition-colors">Store</a>
          <i class="fa-solid fa-chevron-right text-[10px]"></i>
          <span class="text-slate-300">{{ product.category?.name || 'Software' }}</span>
          <i class="fa-solid fa-chevron-right text-[10px]"></i>
          <span class="text-blue-400 font-medium truncate max-w-[200px]">{{ product.name }}</span>
        </nav>

        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="px-3 py-1 rounded-lg bg-blue-600/90 text-white text-xs font-bold shadow-md">
                {{ product.current_version }}
              </span>
              <span class="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
                {{ product.category?.name }}
              </span>
              <span *ngIf="product.is_featured" class="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase">
                Featured Package
              </span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {{ product.name }}
            </h1>
            <p class="text-base text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {{ product.summary }}
            </p>
          </div>

          <!-- Social Share Trigger -->
          <div class="flex items-center gap-3">
            <button (click)="openShareModal()"
                    class="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 shadow-sm">
              <i class="fa-solid fa-share-nodes text-blue-400"></i> Share Software
            </button>
            <a *ngIf="product.demo_url" [href]="product.demo_url" target="_blank"
               class="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-emerald-400 text-xs font-bold transition-all flex items-center gap-2 shadow-sm">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
            </a>
          </div>
        </div>
      </div>

      <!-- Main Grid: Content & Checkout Card -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left 2 Cols: Details, Screenshots, Features, Versions -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Primary Screenshot -->
          <div class="glass-panel rounded-3xl overflow-hidden border border-slate-800 relative bg-slate-900">
            <img [src]="selectedImage || product.thumbnail_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'" 
                 [alt]="product.name"
                 class="w-full h-80 sm:h-96 object-cover">
            
            <!-- Gallery Thumbnails -->
            <div *ngIf="product.gallery_images && product.gallery_images.length > 0" 
                 class="p-4 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/80 flex items-center gap-3 overflow-x-auto">
              <button (click)="selectedImage = product.thumbnail_url || ''"
                      [ngClass]="selectedImage === product.thumbnail_url ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-slate-800 opacity-60 hover:opacity-100'"
                      class="w-16 h-12 rounded-lg overflow-hidden border transition-all flex-shrink-0">
                <img [src]="product.thumbnail_url" class="w-full h-full object-cover">
              </button>
              <button *ngFor="let img of product.gallery_images" (click)="selectedImage = img"
                      [ngClass]="selectedImage === img ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-slate-800 opacity-60 hover:opacity-100'"
                      class="w-16 h-12 rounded-lg overflow-hidden border transition-all flex-shrink-0">
                <img [src]="img" class="w-full h-full object-cover">
              </button>
            </div>
          </div>

          <!-- Tech Stack Badges -->
          <div *ngIf="product.tech_stack" class="glass-panel rounded-2xl p-6 border border-slate-800">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Built With Modern Architecture</h3>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let tech of product.tech_stack" 
                    class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                <i class="fa-solid fa-cube text-[10px] text-blue-400"></i> {{ tech }}
              </span>
            </div>
          </div>

          <!-- Feature Highlights List -->
          <div *ngIf="product.features" class="glass-panel rounded-2xl p-6 border border-slate-800">
            <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <i class="fa-solid fa-star text-amber-400"></i> Key Features Included
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div *ngFor="let feat of product.features" class="flex items-start gap-2.5 text-xs text-slate-300">
                <i class="fa-solid fa-check-circle text-emerald-400 text-sm mt-0.5"></i>
                <span>{{ feat }}</span>
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div class="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-file-lines text-blue-400"></i> Detailed Overview & Architecture
            </h3>
            <div class="text-sm text-slate-300 leading-relaxed whitespace-pre-line prose prose-invert max-w-none">
              {{ product.description }}
            </div>
          </div>

          <!-- Version Releases Changelog -->
          <div *ngIf="product.versions && product.versions.length > 0" class="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-clock-rotate-left text-blue-400"></i> Release History & Changelog
            </h3>
            <div class="space-y-3">
              <div *ngFor="let ver of product.versions" class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-white">{{ ver.version_number }}</span>
                    <span *ngIf="ver.is_latest" class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Latest
                    </span>
                  </div>
                  <span class="text-xs text-slate-400">{{ ver.release_date | date:'mediumDate' }}</span>
                </div>
                <p class="text-xs text-slate-300 whitespace-pre-line">{{ ver.changelog || 'Performance fixes and enhancements.' }}</p>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Col: Pricing Card & Instant Checkout -->
        <div class="space-y-6">
          <div class="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 sticky top-24 space-y-6 shadow-2xl">
            
            <!-- Price Display -->
            <div class="pb-6 border-b border-slate-800">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Commercial License Price</span>
              <div class="flex items-baseline gap-3 mt-1">
                <span class="text-3xl sm:text-4xl font-extrabold text-white">
                  ₹{{ (product.discount_price || product.price) | number:'1.0-0' }}
                </span>
                <span *ngIf="product.discount_price" class="text-sm text-slate-500 line-through font-semibold">
                  ₹{{ product.price | number:'1.0-0' }}
                </span>
                <span *ngIf="product.discount_price" class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  SAVE {{ (100 - (product.discount_price / product.price * 100)) | number:'1.0-0' }}%
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-2">One-time payment • Includes 1 year of updates & private downloads.</p>
            </div>

            <!-- What's included checklist -->
            <div class="space-y-3 text-xs text-slate-300">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-lock text-blue-400 text-sm"></i>
                <span>Gated Single-Use Ephemeral Download Tokens</span>
              </div>
              <div class="flex items-center gap-2.5">
                <i class="fa-brands fa-github text-slate-400 text-sm"></i>
                <span>Private GitHub Release Asset Delivery</span>
              </div>
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-key text-amber-400 text-sm"></i>
                <span>Cryptographic License Key Generation</span>
              </div>
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-receipt text-emerald-400 text-sm"></i>
                <span>Instant GST / Business Tax Invoice</span>
              </div>
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-rotate text-purple-400 text-sm"></i>
                <span>Up to {{ product.max_download_limit }} Verified Downloads</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3 pt-2">
              <button (click)="buyNow()" [disabled]="processingPayment"
                      class="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                <i *ngIf="processingPayment" class="fa-solid fa-circle-notch fa-spin"></i>
                <i *ngIf="!processingPayment" class="fa-solid fa-bolt text-amber-300"></i>
                <span>{{ processingPayment ? 'Opening Razorpay...' : 'Buy Now with Razorpay' }}</span>
              </button>

              <button (click)="addToCart()"
                      class="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2">
                <i class="fa-solid fa-cart-plus"></i>
                <span>Add to Shopping Cart</span>
              </button>
            </div>

            <!-- Secure guarantee notice -->
            <div class="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 text-center flex items-center justify-center gap-2">
              <i class="fa-solid fa-shield-halved text-emerald-400"></i>
              <span>Guaranteed 256-Bit SSL Checkout Protection</span>
            </div>

          </div>
        </div>

      </div>

      <!-- SOCIAL SHARE MODAL -->
      <app-social-share-modal *ngIf="activeShareData" 
                              [shareData]="activeShareData" 
                              (close)="activeShareData = null">
      </app-social-share-modal>

    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private checkoutService = inject(CheckoutService);
  private authService = inject(AuthService);
  private socialService = inject(SocialService);

  product: Product | null = null;
  loading = true;
  selectedImage = '';
  processingPayment = false;
  activeShareData: SocialShareData | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadProduct(slug);
      }
    });
  }

  loadProduct(slug: string): void {
    this.loading = true;
    this.productService.getProductBySlug(slug).subscribe({
      next: (res) => {
        if (res.success) {
          this.product = res.data.product;
          this.selectedImage = this.product?.thumbnail_url || '';
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/']);
      }
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
      this.router.navigate(['/cart']);
    }
  }

  buyNow(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/products/' + this.product?.slug } });
      return;
    }

    if (!this.product) return;

    this.processingPayment = true;

    this.checkoutService.createOrder({
      items: [{ product_id: this.product.id, quantity: 1 }]
    }).subscribe({
      next: (res) => {
        if (res.success && res.data?.razorpay) {
          this.checkoutService.openRazorpayModal(
            res.data.razorpay,
            (paymentSuccessResponse) => {
              this.verifyAndFulfill(res.data.order_id, paymentSuccessResponse);
            },
            () => {
              this.processingPayment = false;
            }
          );
        }
      },
      error: (err) => {
        this.processingPayment = false;
        alert(err.error?.message || 'Failed to initialize checkout.');
      }
    });
  }

  private verifyAndFulfill(orderId: number, paymentResponse: any): void {
    this.checkoutService.verifyPayment({
      order_id: orderId,
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature
    }).subscribe({
      next: (res) => {
        this.processingPayment = false;
        this.router.navigate(['/my-purchases']);
      },
      error: (err) => {
        this.processingPayment = false;
        alert('Payment verification failed: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  openShareModal(): void {
    if (!this.product) return;
    this.socialService.getShareLinks(this.product.slug).subscribe({
      next: (res) => {
        if (res.success) {
          this.activeShareData = res.data;
        }
      }
    });
  }
}

