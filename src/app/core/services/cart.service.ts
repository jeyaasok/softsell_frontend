import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _items = signal<CartItem[]>([]);

  public items = this._items.asReadonly();
  public count = computed(() => this._items().length);
  public subtotal = computed(() => {
    return this._items().reduce((total, item) => {
      const price = item.product.discount_price ? Number(item.product.discount_price) : Number(item.product.price);
      return total + price;
    }, 0);
  });

  constructor() {
    const savedCart = localStorage.getItem('bracezin_cart');
    if (savedCart) {
      try {
        this._items.set(JSON.parse(savedCart));
      } catch (e) {
        this._items.set([]);
      }
    }
  }

  addToCart(product: Product): boolean {
    const current = this._items();
    const exists = current.some(i => i.product.id === product.id);

    if (exists) {
      return false; // Already in cart (single license per purchase)
    }

    const updated = [...current, { product, quantity: 1 }];
    this._items.set(updated);
    this.saveCart(updated);
    return true;
  }

  removeFromCart(productId: number): void {
    const updated = this._items().filter(i => i.product.id !== productId);
    this._items.set(updated);
    this.saveCart(updated);
  }

  clearCart(): void {
    this._items.set([]);
    localStorage.removeItem('bracezin_cart');
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('bracezin_cart', JSON.stringify(items));
  }
}

