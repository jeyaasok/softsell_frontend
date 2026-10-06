import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Category, Product } from '../../core/models';

@Component({
  selector: 'app-products-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-white">Software Packages & Releases</h1>
          <p class="text-xs text-slate-400 mt-1">Manage product categories, feature highlights, pricing, versions, and private GitHub delivery mapping.</p>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="openCreateCategoryModal()"
                  class="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-blue-500/40 text-slate-200 text-xs font-bold transition-all flex items-center gap-2">
            <i class="fa-solid fa-layer-group"></i> New Category
          </button>
          <button (click)="openCreateModal()"
                  class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2">
            <i class="fa-solid fa-plus"></i> New Software Package
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div class="w-full flex flex-col sm:flex-row gap-3">
          <div class="relative w-full sm:w-80">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="loadProducts()"
                   placeholder="Search products..."
                   class="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500">
          </div>
          <select [(ngModel)]="selectedCategoryFilter" (change)="loadProducts()"
                  class="w-full sm:w-64 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
            <option value="">All Categories</option>
            <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
          </select>
          <button (click)="loadProducts()"
                  class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-slate-200 text-xs font-semibold">
            Apply Filters
          </button>
        </div>
        <div class="text-xs text-slate-400">
          Showing {{ products.length }} total software products
        </div>
      </div>

      <!-- Categories Snapshot -->
      <div class="glass-panel rounded-2xl p-4 border border-slate-800">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-bold text-white">Product Categories</h3>
          <span class="text-[11px] text-slate-400">{{ categories.length }} categories configured</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div *ngFor="let cat of categories" class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs font-bold text-white truncate">{{ cat.name }}</p>
              <div class="flex items-center gap-2">
                <button (click)="openEditCategoryModal(cat)" class="text-[11px] text-blue-400 hover:text-blue-300">Edit</button>
                <button (click)="openMergeCategoryModal(cat)"
                        [disabled]="categories.length < 2"
                        [title]="categories.length < 2 ? 'Need at least two categories to merge' : 'Move all products and delete this category'"
                        class="text-[11px] text-amber-400 hover:text-amber-300 disabled:text-slate-600 disabled:cursor-not-allowed">
                  Merge
                </button>
                <button (click)="deleteCategory(cat)"
                        [disabled]="(cat.products_count || 0) > 0"
                        [title]="(cat.products_count || 0) > 0 ? 'Remove linked products before deleting this category' : 'Delete category'"
                        class="text-[11px] text-rose-400 hover:text-rose-300 disabled:text-slate-600 disabled:cursor-not-allowed">
                  Delete
                </button>
              </div>
            </div>
            <p class="text-[11px] text-slate-400 mt-1">/{{ cat.slug }}</p>
            <p class="text-[11px] text-slate-500 mt-2 line-clamp-2">{{ cat.description || 'No description set.' }}</p>
            <div class="mt-2 flex items-center justify-between">
              <span class="text-[11px] text-slate-400">Products: {{ cat.products_count || 0 }}</span>
              <span [ngClass]="cat.is_active ? 'text-emerald-400' : 'text-slate-500'" class="text-[11px] font-semibold">
                {{ cat.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th class="p-4">Software</th>
                <th class="p-4">Category</th>
                <th class="p-4">Version</th>
                <th class="p-4">Price</th>
                <th class="p-4">Features</th>
                <th class="p-4">GitHub Private Source</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr *ngFor="let prod of products" class="hover:bg-slate-900/40">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <img [src]="prod.thumbnail_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=100&q=80'" 
                         class="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-800">
                    <div>
                      <span class="font-bold text-white block">{{ prod.name }}</span>
                      <span class="text-[10px] text-slate-400 font-mono">/products/{{ prod.slug }}</span>
                    </div>
                  </div>
                </td>
                <td class="p-4 font-medium text-slate-300">{{ prod.category?.name }}</td>
                <td class="p-4">
                  <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {{ prod.current_version }}
                  </span>
                </td>
                <td class="p-4">
                  <span class="font-bold text-white">₹{{ (prod.discount_price || prod.price) | number:'1.0-0' }}</span>
                  <span *ngIf="prod.discount_price" class="block text-[10px] text-slate-500 line-through">₹{{ prod.price | number:'1.0-0' }}</span>
                </td>
                <td class="p-4">
                  <span class="text-slate-300 font-medium">{{ prod.features?.length || 0 }} highlights</span>
                  <span *ngIf="prod.tags?.length" class="block text-[10px] text-slate-500 mt-1">{{ prod.tags!.slice(0, 2).join(', ') }}{{ prod.tags!.length > 2 ? ' +' + (prod.tags!.length - 2) : '' }}</span>
                </td>
                <td class="p-4 font-mono text-[11px] text-slate-300">
                  <span *ngIf="prod.github_repo_name" class="flex items-center gap-1.5 text-slate-300">
                    <i class="fa-brands fa-github text-slate-400"></i>
                    {{ prod.github_repo_owner }}/{{ prod.github_repo_name }} ({{ prod.github_release_tag }})
                  </span>
                  <span *ngIf="!prod.github_repo_name" class="text-slate-500">Unlinked</span>
                </td>
                <td class="p-4">
                  <span [ngClass]="prod.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'"
                        class="px-2 py-0.5 rounded text-[10px] font-bold border">
                    {{ prod.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="p-4 text-right space-x-2">
                  <button (click)="openVersionModal(prod)" 
                          class="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-purple-400 hover:border-purple-500/50 text-slate-300" title="Release New Version">
                    <i class="fa-solid fa-code-branch text-xs"></i>
                  </button>
                  <button (click)="openEditModal(prod)" 
                          class="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-blue-400 hover:border-blue-500/50 text-slate-300" title="Edit">
                    <i class="fa-solid fa-pen-to-square text-xs"></i>
                  </button>
                  <button (click)="deleteProduct(prod)" 
                          class="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-rose-400 hover:border-rose-500/50 text-slate-300" title="Delete">
                    <i class="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CREATE / EDIT PRODUCT MODAL -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div class="glass-panel w-full max-w-2xl rounded-3xl border border-slate-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
          
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 class="text-lg font-bold text-white">{{ isEditing ? 'Edit Software Package' : 'Create New Software Package' }}</h3>
            <button (click)="showModal = false" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form (ngSubmit)="saveProduct()" class="space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Product Name</label>
                <input type="text" [(ngModel)]="formData.name" name="name" required class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Product Slug (Optional)</label>
                <input type="text" [(ngModel)]="formData.slug" name="slug" placeholder="auto-generated from name" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Category</label>
                <div class="flex items-center gap-2">
                  <select [(ngModel)]="formData.category_id" name="category_id" required class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
                    <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
                  </select>
                  <button type="button" (click)="openCreateCategoryModal()" title="Add category" class="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-blue-400 hover:text-blue-300">
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Documentation URL</label>
                <input type="url" [(ngModel)]="formData.documentation_url" name="documentation_url" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-300 mb-1">Summary (Short Pitch)</label>
              <input type="text" [(ngModel)]="formData.summary" name="summary" required class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
            </div>

            <div>
              <label class="block font-bold text-slate-300 mb-1">Detailed Description (Markdown Supported)</label>
              <textarea [(ngModel)]="formData.description" name="description" rows="4" required class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Version Number</label>
                <input type="text" [(ngModel)]="formData.current_version" name="current_version" required placeholder="v1.0.0" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Price (₹ INR)</label>
                <input type="number" [(ngModel)]="formData.price" name="price" required class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Discount Price (₹)</label>
                <input type="number" [(ngModel)]="formData.discount_price" name="discount_price" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
              </div>
            </div>

            <!-- GitHub Repo Mapping -->
            <div class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <h4 class="font-bold text-blue-400 flex items-center gap-1.5">
                <i class="fa-brands fa-github"></i> Private GitHub Release Asset Link
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-slate-400 mb-1">GitHub Repo Owner</label>
                  <input type="text" [(ngModel)]="formData.github_repo_owner" name="github_repo_owner" placeholder="e.g. bracezin-mdu" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
                </div>
                <div>
                  <label class="block text-slate-400 mb-1">GitHub Repo Name</label>
                  <input type="text" [(ngModel)]="formData.github_repo_name" name="github_repo_name" placeholder="e.g. bracezin-erp-core" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
                </div>
                <div>
                  <label class="block text-slate-400 mb-1">Release Tag</label>
                  <input type="text" [(ngModel)]="formData.github_release_tag" name="github_release_tag" placeholder="e.g. v2.4.0" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
                </div>
              </div>
              <div>
                <label class="block text-slate-400 mb-1">Asset Filename</label>
                <input type="text" [(ngModel)]="formData.github_asset_name" name="github_asset_name" placeholder="e.g. bracezin-erp-v2.4.0.zip" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Feature Highlights</label>
                <textarea [(ngModel)]="featuresInput" name="features_input" rows="4" placeholder="One per line or comma separated" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"></textarea>
                <p class="text-[11px] text-slate-500 mt-1">Displayed on product detail page under key features.</p>
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Tech Stack</label>
                <textarea [(ngModel)]="techStackInput" name="tech_stack_input" rows="4" placeholder="Laravel, Angular, Redis" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"></textarea>
                <p class="text-[11px] text-slate-500 mt-1">Shown as badges on the product detail page.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Product Tags</label>
                <textarea [(ngModel)]="tagsInput" name="tags_input" rows="3" placeholder="saas, crm, invoice" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"></textarea>
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Gallery Image URLs</label>
                <textarea [(ngModel)]="galleryImagesInput" name="gallery_images_input" rows="3" placeholder="One URL per line" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"></textarea>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Thumbnail Image URL</label>
                <input type="url" [(ngModel)]="formData.thumbnail_url" name="thumbnail_url" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Live Demo URL</label>
                <input type="url" [(ngModel)]="formData.demo_url" name="demo_url" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Max Download Limit</label>
                <input type="number" [(ngModel)]="formData.max_download_limit" name="max_download_limit" min="1" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Download Access Expiry (Days)</label>
                <input type="number" [(ngModel)]="formData.download_expiry_days" name="download_expiry_days" min="1" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
              </div>
            </div>

            <div class="flex items-center gap-6 pt-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="formData.is_active" name="is_active" class="rounded bg-slate-900 border-slate-800 text-blue-600">
                <span class="text-white font-semibold">Active in Store</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="formData.is_featured" name="is_featured" class="rounded bg-slate-900 border-slate-800 text-blue-600">
                <span class="text-white font-semibold">Featured on Homepage</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="formData.requires_license_key" name="requires_license_key" class="rounded bg-slate-900 border-slate-800 text-blue-600">
                <span class="text-white font-semibold">Issue License Key</span>
              </label>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" (click)="showModal = false" class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold">{{ isEditing ? 'Save Changes' : 'Create Package' }}</button>
            </div>
          </form>

        </div>
      </div>

      <!-- CREATE / EDIT CATEGORY MODAL -->
      <div *ngIf="showCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div class="glass-panel w-full max-w-xl rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl">
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 class="text-lg font-bold text-white">{{ isEditingCategory ? 'Edit Category' : 'Create New Category' }}</h3>
            <button (click)="showCategoryModal = false" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form (ngSubmit)="saveCategory()" class="space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Category Name</label>
                <input type="text" [(ngModel)]="categoryFormData.name" name="category_name" required class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Slug (Optional)</label>
                <input type="text" [(ngModel)]="categoryFormData.slug" name="category_slug" placeholder="auto-generated from name" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-300 mb-1">Description</label>
              <textarea [(ngModel)]="categoryFormData.description" name="category_description" rows="3" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Icon (Optional)</label>
                <input type="text" [(ngModel)]="categoryFormData.icon" name="category_icon" placeholder="fa-solid fa-code" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Sort Order</label>
                <input type="number" [(ngModel)]="categoryFormData.sort_order" name="category_sort_order" min="0" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
              </div>
            </div>

            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" [(ngModel)]="categoryFormData.is_active" name="category_is_active" class="rounded bg-slate-900 border-slate-800 text-blue-600">
              <span class="text-white font-semibold">Active Category</span>
            </label>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" (click)="showCategoryModal = false" class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold">{{ isEditingCategory ? 'Save Category' : 'Create Category' }}</button>
            </div>
          </form>
        </div>
      </div>

      <!-- MERGE CATEGORY MODAL -->
      <div *ngIf="showMergeCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div class="glass-panel w-full max-w-xl rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl">
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 class="text-lg font-bold text-white">Merge Category</h3>
            <button (click)="showMergeCategoryModal = false" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed">
            This will move all products from <span class="font-semibold">{{ mergeSourceCategory?.name }}</span> into another category,
            and then permanently delete the source category.
          </div>

          <form (ngSubmit)="confirmMergeCategory()" class="space-y-4 text-xs">
            <div>
              <label class="block font-bold text-slate-300 mb-1">Target Category</label>
              <select [(ngModel)]="mergeTargetCategoryId" name="merge_target_category" required class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
                <option [ngValue]="null">Select destination category</option>
                <option *ngFor="let c of categories" [ngValue]="c.id" [disabled]="c.id === mergeSourceCategory?.id">
                  {{ c.name }}
                </option>
              </select>
            </div>

            <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <p><span class="text-slate-400">Source category products:</span> {{ mergeSourceProductsCount }}</p>
              <p><span class="text-slate-400">Target category current products:</span> {{ mergeTargetProductsCount }}</p>
              <p class="text-emerald-400 font-semibold">After merge, target will have {{ mergeProjectedTargetProductsCount }} products.</p>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" (click)="showMergeCategoryModal = false" class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">Cancel</button>
              <button type="submit"
                      [disabled]="!canMergeCategories"
                      class="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                Merge & Delete Source
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- RELEASE NEW VERSION MODAL -->
      <div *ngIf="showVersionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div class="glass-panel w-full max-w-md rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
          <h3 class="text-base font-bold text-white">Release New Version for {{ selectedProduct?.name }}</h3>
          
          <form (ngSubmit)="submitVersion()" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-300 mb-1">New Version Tag</label>
              <input type="text" [(ngModel)]="versionData.version_number" name="version_number" required placeholder="e.g. v2.5.0" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white">
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">Changelog Notes</label>
              <textarea [(ngModel)]="versionData.changelog" name="changelog" rows="3" placeholder="What's new in this release..." class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"></textarea>
            </div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" [(ngModel)]="versionData.is_latest" name="is_latest" class="rounded bg-slate-900 border-slate-800 text-blue-600">
              <span class="text-white font-semibold">Mark as Latest Stable Release</span>
            </label>
            <div class="flex justify-end gap-3 pt-3">
              <button type="button" (click)="showVersionModal = false" class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold">Publish Release</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `
})
export class AdminProductsManagerComponent implements OnInit {
  private admin = inject(AdminService);

  products: Product[] = [];
  categories: Category[] = [];
  searchQuery = '';
  selectedCategoryFilter = '';

  showModal = false;
  isEditing = false;
  currentProductId: number | null = null;
  formData: any = {};
  featuresInput = '';
  techStackInput = '';
  tagsInput = '';
  galleryImagesInput = '';

  showCategoryModal = false;
  isEditingCategory = false;
  currentCategoryId: number | null = null;
  categoryFormData: any = {};

  showMergeCategoryModal = false;
  mergeSourceCategory: Category | null = null;
  mergeTargetCategoryId: number | null = null;

  showVersionModal = false;
  selectedProduct: Product | null = null;
  versionData: any = { is_latest: true };

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.admin.getCategories().subscribe({
      next: (res) => {
        if (res.success) this.categories = res.data;
      }
    });
  }

  loadProducts(): void {
    this.admin.getProducts({
      search: this.searchQuery,
      category_id: this.selectedCategoryFilter || undefined,
    }).subscribe({
      next: (res) => {
        if (res.success) this.products = res.data?.data || res.data || [];
      }
    });
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.currentProductId = null;
    this.formData = {
      is_active: true,
      is_featured: false,
      requires_license_key: true,
      current_version: '1.0.0',
      category_id: this.categories[0]?.id || 1,
      currency: 'INR',
      max_download_limit: 5,
      download_expiry_days: 30,
    };
    this.featuresInput = '';
    this.techStackInput = '';
    this.tagsInput = '';
    this.galleryImagesInput = '';
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.isEditing = true;
    this.currentProductId = product.id;
    this.formData = { ...product };
    this.featuresInput = (product.features || []).join('\n');
    this.techStackInput = (product.tech_stack || []).join('\n');
    this.tagsInput = (product.tags || []).join(', ');
    this.galleryImagesInput = (product.gallery_images || []).join('\n');
    this.showModal = true;
  }

  saveProduct(): void {
    const payload = {
      ...this.formData,
      category_id: Number(this.formData.category_id),
      discount_price: this.toNullableNumber(this.formData.discount_price),
      demo_url: this.toNullableUrl(this.formData.demo_url),
      documentation_url: this.toNullableUrl(this.formData.documentation_url),
      thumbnail_url: this.toNullableUrl(this.formData.thumbnail_url),
      gallery_images: this.toNullableArray(this.galleryImagesInput),
      tags: this.toNullableArray(this.tagsInput),
      features: this.toNullableArray(this.featuresInput),
      tech_stack: this.toNullableArray(this.techStackInput),
      max_download_limit: Number(this.formData.max_download_limit || 5),
      download_expiry_days: Number(this.formData.download_expiry_days || 30),
      slug: this.toNullableString(this.formData.slug),
      github_repo_owner: this.toNullableString(this.formData.github_repo_owner),
      github_repo_name: this.toNullableString(this.formData.github_repo_name),
      github_release_tag: this.toNullableString(this.formData.github_release_tag),
      github_asset_name: this.toNullableString(this.formData.github_asset_name),
    };

    if (this.isEditing && this.currentProductId) {
      this.admin.updateProduct(this.currentProductId, payload).subscribe({
        next: () => {
          this.showModal = false;
          this.loadProducts();
        }
      });
    } else {
      this.admin.createProduct(payload).subscribe({
        next: () => {
          this.showModal = false;
          this.loadProducts();
        }
      });
    }
  }

  openVersionModal(product: Product): void {
    this.selectedProduct = product;
    this.versionData = { version_number: '', changelog: '', is_latest: true };
    this.showVersionModal = true;
  }

  submitVersion(): void {
    if (!this.selectedProduct) return;
    this.admin.addVersion(this.selectedProduct.id, this.versionData).subscribe({
      next: () => {
        this.showVersionModal = false;
        this.loadProducts();
      }
    });
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.admin.deleteProduct(product.id).subscribe({
        next: () => this.loadProducts()
      });
    }
  }

  openCreateCategoryModal(): void {
    this.isEditingCategory = false;
    this.currentCategoryId = null;
    this.categoryFormData = {
      name: '',
      slug: '',
      description: '',
      icon: '',
      sort_order: this.categories.length,
      is_active: true,
    };
    this.showCategoryModal = true;
  }

  openEditCategoryModal(category: Category): void {
    this.isEditingCategory = true;
    this.currentCategoryId = category.id;
    this.categoryFormData = {
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
      sort_order: category.sort_order,
      is_active: category.is_active,
    };
    this.showCategoryModal = true;
  }

  saveCategory(): void {
    const payload = {
      ...this.categoryFormData,
      slug: this.toNullableString(this.categoryFormData.slug),
      description: this.toNullableString(this.categoryFormData.description),
      icon: this.toNullableString(this.categoryFormData.icon),
      sort_order: Number(this.categoryFormData.sort_order || 0),
    };

    if (this.isEditingCategory && this.currentCategoryId) {
      this.admin.updateCategory(this.currentCategoryId, payload).subscribe({
        next: () => {
          this.showCategoryModal = false;
          this.loadCategories();
        }
      });
      return;
    }

    this.admin.createCategory(payload).subscribe({
      next: (res) => {
        this.showCategoryModal = false;
        if (res?.data?.id) {
          this.formData.category_id = res.data.id;
        }
        this.loadCategories();
      }
    });
  }

  deleteCategory(category: Category): void {
    if ((category.products_count || 0) > 0) {
      alert('This category has linked products. Reassign or delete those products first.');
      return;
    }

    if (!confirm(`Are you sure you want to delete category ${category.name}?`)) {
      return;
    }

    this.admin.deleteCategory(category.id).subscribe({
      next: () => {
        if (String(category.id) === String(this.selectedCategoryFilter)) {
          this.selectedCategoryFilter = '';
        }
        this.loadCategories();
        this.loadProducts();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to delete category.');
      }
    });
  }

  openMergeCategoryModal(category: Category): void {
    if (this.categories.length < 2) {
      alert('At least two categories are required to perform a merge.');
      return;
    }

    this.mergeSourceCategory = category;
    const firstOtherCategory = this.categories.find((c) => c.id !== category.id);
    this.mergeTargetCategoryId = firstOtherCategory?.id || null;
    this.showMergeCategoryModal = true;
  }

  confirmMergeCategory(): void {
    if (!this.mergeSourceCategory || !this.mergeTargetCategoryId) {
      alert('Please select a destination category.');
      return;
    }

    if (this.mergeSourceCategory.id === this.mergeTargetCategoryId) {
      alert('Source and destination categories must be different.');
      return;
    }

    if (!confirm(`Merge ${this.mergeSourceCategory.name} into selected category and delete source category?`)) {
      return;
    }

    this.admin.mergeCategory(this.mergeSourceCategory.id, this.mergeTargetCategoryId).subscribe({
      next: (res) => {
        this.showMergeCategoryModal = false;

        if (String(this.mergeSourceCategory?.id) === String(this.selectedCategoryFilter)) {
          this.selectedCategoryFilter = String(this.mergeTargetCategoryId);
        }

        const movedCount = res?.data?.moved_products_count || 0;
        alert(`Category merged successfully. ${movedCount} products were moved.`);

        this.loadCategories();
        this.loadProducts();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to merge category.');
      }
    });
  }

  get mergeSourceProductsCount(): number {
    return this.mergeSourceCategory?.products_count || 0;
  }

  get mergeTargetCategory(): Category | null {
    if (!this.mergeTargetCategoryId) return null;
    return this.categories.find((category) => category.id === this.mergeTargetCategoryId) || null;
  }

  get mergeTargetProductsCount(): number {
    return this.mergeTargetCategory?.products_count || 0;
  }

  get mergeProjectedTargetProductsCount(): number {
    return this.mergeSourceProductsCount + this.mergeTargetProductsCount;
  }

  get canMergeCategories(): boolean {
    return !!this.mergeSourceCategory && !!this.mergeTargetCategoryId && this.mergeSourceCategory.id !== this.mergeTargetCategoryId;
  }

  private toNullableString(value: any): string | null {
    const text = (value ?? '').toString().trim();
    return text.length ? text : null;
  }

  private toNullableUrl(value: any): string | null {
    return this.toNullableString(value);
  }

  private toNullableNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
  }

  private toNullableArray(rawInput: string): string[] | null {
    const values = (rawInput || '')
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    return values.length ? values : null;
  }
}

