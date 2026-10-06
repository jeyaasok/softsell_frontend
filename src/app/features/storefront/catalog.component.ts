import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { SocialService } from '../../core/services/social.service';
import { Category, Product, SocialShareData } from '../../core/models';
import { SocialShareModalComponent } from '../../shared/components/social-share-modal.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SocialShareModalComponent],
  template: `
    <div class="space-y-12">
      
      <!-- HERO BANNER -->
      <section class="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-slate-950 p-8 sm:p-12 lg:p-16 glow-effect">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="relative z-10 max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <i class="fa-solid fa-code text-xs"></i> Verified Enterprise Source Code Marketplace
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Production-Ready Software. <span class="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Zero Exposure.</span>
          </h1>
          <p class="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            Acquire fully-featured web platforms, SaaS starters, automation bots, and enterprise suites. Authenticated downloads delivered securely directly from private GitHub releases.
          </p>

          <!-- Search & Filter Input -->
          <div class="mt-8 flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
              <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="applyFilters()"
                     placeholder="Search software by name, stack, or keywords (e.g. ERP, Laravel, SaaS)..."
                     class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner">
            </div>
            <button (click)="applyFilters()"
                    class="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2">
              <i class="fa-solid fa-arrow-right"></i> Search
            </button>
          </div>

          <!-- Feature badges -->
          <div class="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <span class="flex items-center gap-2"><i class="fa-solid fa-check-circle text-emerald-400"></i> Lifetime Updates</span>
            <span class="flex items-center gap-2"><i class="fa-solid fa-check-circle text-emerald-400"></i> Full Source Included</span>
            <span class="flex items-center gap-2"><i class="fa-solid fa-check-circle text-emerald-400"></i> Instant Razorpay Delivery</span>
            <span class="flex items-center gap-2"><i class="fa-solid fa-check-circle text-emerald-400"></i> 100% Private GitHub Assets</span>
          </div>
        </div>
      </section>

      <!-- CATALOG + CATEGORY NAVIGATION -->
      <section class="grid grid-cols-1 lg:grid-cols-[280px,minmax(0,1fr)] gap-6 lg:gap-8 items-start">

        <!-- LEFT CATEGORY NAV -->
        <aside class="glass-panel rounded-2xl border border-slate-800 p-4 lg:p-5 lg:sticky lg:top-24 max-h-[70vh] overflow-y-auto pr-2">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <i class="fa-solid fa-layer-group text-blue-400"></i> Categories
            </h2>
            <button *ngIf="selectedCategory" (click)="selectCategory('')"
                    class="text-[11px] text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Reset
            </button>
          </div>

          <nav class="space-y-1.5">
            <button (click)="selectCategory('')"
                    [ngClass]="!selectedCategory ? 'bg-blue-600/90 text-white border-blue-500 shadow-md shadow-blue-500/20' : 'bg-slate-900/50 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'"
                    class="w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between text-left">
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-border-all text-[10px]"></i> All Software
              </span>
              <span class="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px]">{{ products.length }}</span>
            </button>

            <button *ngFor="let cat of categories" (click)="selectCategory(cat.slug)"
                    [ngClass]="selectedCategory === cat.slug ? 'bg-blue-600/90 text-white border-blue-500 shadow-md shadow-blue-500/20' : 'bg-slate-900/50 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'"
                    class="w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between text-left">
              <span class="flex items-center gap-2 min-w-0">
                <i class="fa-solid fa-tag text-[10px] shrink-0"></i>
                <span class="truncate">{{ cat.name }}</span>
              </span>
              <span class="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] shrink-0">{{ cat.products_count || 0 }}</span>
            </button>
          </nav>
        </aside>

        <!-- RIGHT PRODUCT CATALOG GRID -->
        <div class="space-y-6 min-w-0">
          <div class="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 class="text-2xl font-bold text-white">Available Software Packages</h2>
            <p class="text-xs text-slate-400 mt-1">Showing {{ products.length }} verified software packages</p>
          </div>
          
          <select [(ngModel)]="sortOrder" (change)="loadProducts()"
                  class="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500">
            <option value="latest">Latest Releases</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Alphabetical</option>
          </select>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let i of [1,2,3,4,5,6]" class="glass-card rounded-2xl p-6 h-80 animate-pulse bg-slate-900/40"></div>
        </div>

        <!-- Products Grid -->
        <div *ngIf="!loading && products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let product of products" 
               class="glass-card rounded-2xl border border-slate-800 flex flex-col justify-between overflow-hidden group">
            
            <!-- Card Image / Header -->
            <div class="relative h-48 overflow-hidden bg-slate-900">
              <img [src]="product.thumbnail_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'" 
                   [alt]="product.name"
                   class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              
              <!-- Badges -->
              <div class="absolute top-3 left-3 flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-lg bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold tracking-wide shadow-md">
                  {{ product.current_version }}
                </span>
                <span *ngIf="product.is_featured" class="px-2.5 py-1 rounded-lg bg-amber-500/90 backdrop-blur-md text-slate-950 text-[11px] font-extrabold uppercase tracking-wide shadow-md">
                  ★ Featured
                </span>
              </div>

              <!-- Quick Share Button -->
              <button (click)="openShareModal(product, $event)" 
                      class="absolute top-3 right-3 w-8 h-8 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-blue-400 hover:border-blue-500/50 flex items-center justify-center transition-all shadow-md">
                <i class="fa-solid fa-share-nodes text-xs"></i>
              </button>

              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span class="text-xs font-semibold text-blue-400 bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-slate-800">
                  {{ product.category?.name || 'Software' }}
                </span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <a [routerLink]="['/products', product.slug]" class="block group-hover:text-blue-400 transition-colors">
                  <h3 class="text-lg font-bold text-white tracking-tight line-clamp-1">{{ product.name }}</h3>
                </a>
                <p class="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {{ product.summary }}
                </p>

                <!-- Tech stack chips -->
                <div *ngIf="product.tech_stack" class="flex flex-wrap gap-1.5 mt-3">
                  <span *ngFor="let tech of product.tech_stack.slice(0, 3)" 
                        class="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                    {{ tech }}
                  </span>
                </div>
              </div>

              <!-- Pricing & Action Row -->
              <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div class="flex items-baseline gap-2">
                    <span class="text-xl font-extrabold text-white">
                      ₹{{ (product.discount_price || product.price) | number:'1.0-0' }}
                    </span>
                    <span *ngIf="product.discount_price" class="text-xs text-slate-500 line-through">
                      ₹{{ product.price | number:'1.0-0' }}
                    </span>
                  </div>
                  <span class="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                    <i class="fa-solid fa-shield-check"></i> Commercial License
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <button (click)="addToCart(product)"
                          class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 hover:text-blue-400 text-slate-300 transition-all shadow-sm"
                          title="Add to Cart">
                    <i class="fa-solid fa-cart-plus text-sm"></i>
                  </button>
                  <a [routerLink]="['/products', product.slug]"
                     class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5">
                    Details <i class="fa-solid fa-arrow-right text-[10px]"></i>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="!loading && products.length === 0" class="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto">
          <div class="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4 text-2xl">
            <i class="fa-solid fa-box-open"></i>
          </div>
          <h3 class="text-lg font-bold text-white">No software products found</h3>
          <p class="text-xs text-slate-400 mt-1">Try clearing your search query or selecting a different category.</p>
          <button (click)="resetSearch()" class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors">
            Clear Filters
          </button>
        </div>
        </div>
      </section>

      <!-- SOCIAL SHARE MODAL -->
      <app-social-share-modal *ngIf="activeShareData" 
                              [shareData]="activeShareData" 
                              (close)="activeShareData = null">
      </app-social-share-modal>

    </div>
  `
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private socialService = inject(SocialService);
  private route = inject(ActivatedRoute);

  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  searchQuery = '';
  selectedCategory = '';
  sortOrder = 'latest';
  activeShareData: SocialShareData | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      this.loadCategories();
      this.loadProducts();
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (res) => {
        if (res.success) {
          this.categories = res.data;
        }
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts({
      search: this.searchQuery,
      category: this.selectedCategory,
      sort: this.sortOrder
    }).subscribe({
      next: (res) => {
        this.products = res.data?.data || res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.loadProducts();
  }

  selectCategory(slug: string): void {
    this.selectedCategory = slug;
    this.loadProducts();
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.loadProducts();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  openShareModal(product: Product, event: Event): void {
    event.stopPropagation();
    this.socialService.getShareLinks(product.slug).subscribe({
      next: (res) => {
        if (res.success) {
          this.activeShareData = res.data;
        }
      }
    });
  }
}

