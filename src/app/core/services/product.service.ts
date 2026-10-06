import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Product } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private api = inject(ApiService);

  getProducts(params: {
    search?: string;
    category?: string;
    featured?: boolean;
    sort?: string;
    page?: number;
    per_page?: number;
  } = {}): Observable<any> {
    return this.api.get<any>('/products', params);
  }

  getFeaturedProducts(): Observable<any> {
    return this.api.get<any>('/products/featured');
  }

  getProductBySlug(slug: string): Observable<any> {
    return this.api.get<any>(`/products/${slug}`);
  }

  getCategories(): Observable<any> {
    return this.api.get<any>('/categories');
  }

  getCategoryBySlug(slug: string): Observable<any> {
    return this.api.get<any>(`/categories/${slug}`);
  }
}

