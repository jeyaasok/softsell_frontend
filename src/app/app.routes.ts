import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public Storefront Routes
  {
    path: '',
    loadComponent: () => import('./features/storefront/catalog.component').then(m => m.CatalogComponent)
  },
  {
    path: 'products/:slug',
    loadComponent: () => import('./features/storefront/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./features/legal/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
  },
  {
    path: 'terms-of-service',
    loadComponent: () => import('./features/legal/terms-of-service.component').then(m => m.TermsOfServiceComponent)
  },
  {
    path: 'refund-policy',
    loadComponent: () => import('./features/legal/refund-policy.component').then(m => m.RefundPolicyComponent)
  },

  // Customer Portal (Authenticated)
  {
    path: 'my-purchases',
    canActivate: [authGuard],
    loadComponent: () => import('./features/customer/my-purchases.component').then(m => m.MyPurchasesComponent)
  },

  // Admin Portal (Authenticated + Admin Role)
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/admin/products-manager.component').then(m => m.AdminProductsManagerComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/admin/orders-manager.component').then(m => m.AdminOrdersManagerComponent)
      },
      {
        path: 'download-logs',
        loadComponent: () => import('./features/admin/download-logs.component').then(m => m.AdminDownloadLogsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/settings-manager.component').then(m => m.AdminSettingsManagerComponent)
      }
    ]
  },

  // Catch-all redirect
  {
    path: '**',
    redirectTo: ''
  }
];
