import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private api = inject(ApiService);

  getStats(): Observable<any> {
    return this.api.get<any>('/admin/stats');
  }

  getProducts(params: any = {}): Observable<any> {
    return this.api.get<any>('/admin/products', params);
  }

  getCategories(): Observable<any> {
    return this.api.get<any>('/admin/categories');
  }

  createCategory(data: any): Observable<any> {
    return this.api.post<any>('/admin/categories', data);
  }

  updateCategory(id: number, data: any): Observable<any> {
    return this.api.put<any>(`/admin/categories/${id}`, data);
  }

  mergeCategory(sourceCategoryId: number, targetCategoryId: number): Observable<any> {
    return this.api.post<any>(`/admin/categories/${sourceCategoryId}/merge`, {
      target_category_id: targetCategoryId,
    });
  }

  deleteCategory(id: number): Observable<any> {
    return this.api.delete<any>(`/admin/categories/${id}`);
  }

  getProduct(id: number): Observable<any> {
    return this.api.get<any>(`/admin/products/${id}`);
  }

  createProduct(data: any): Observable<any> {
    return this.api.post<any>('/admin/products', data);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.api.put<any>(`/admin/products/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.api.delete<any>(`/admin/products/${id}`);
  }

  addVersion(productId: number, data: any): Observable<any> {
    return this.api.post<any>(`/admin/products/${productId}/versions`, data);
  }

  getOrders(params: any = {}): Observable<any> {
    return this.api.get<any>('/admin/orders', params);
  }

  getOrder(id: number): Observable<any> {
    return this.api.get<any>(`/admin/orders/${id}`);
  }

  issueRefund(orderId: number, reason: string, amount?: number): Observable<any> {
    return this.api.post<any>(`/admin/orders/${orderId}/refund`, {
      reason,
      amount
    });
  }

  getUsers(params: any = {}): Observable<any> {
    return this.api.get<any>('/admin/users', params);
  }

  updateUserStatus(userId: number, data: { role?: string; status?: string }): Observable<any> {
    return this.api.post<any>(`/admin/users/${userId}/status`, data);
  }

  getDownloadLogs(params: any = {}): Observable<any> {
    return this.api.get<any>('/admin/logs/downloads', params);
  }

  getAuditLogs(params: any = {}): Observable<any> {
    return this.api.get<any>('/admin/logs/audits', params);
  }

  getSettings(): Observable<any> {
    return this.api.get<any>('/admin/settings');
  }

  updateSettings(settings: any[]): Observable<any> {
    return this.api.post<any>('/admin/settings', { settings });
  }
}

