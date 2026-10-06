import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

declare global {
  interface Window {
    Razorpay: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private api = inject(ApiService);

  createOrder(data: {
    items: Array<{ product_id: number; quantity?: number }>;
    billing?: any;
  }): Observable<any> {
    return this.api.post<any>('/checkout/create-order', data);
  }

  verifyPayment(data: {
    order_id: number;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Observable<any> {
    return this.api.post<any>('/checkout/verify-payment', data);
  }

  openRazorpayModal(
    orderPayload: any,
    onSuccess: (response: any) => void,
    onDismiss?: () => void
  ): void {
    const options = {
      key: orderPayload.key_id,
      amount: orderPayload.amount,
      currency: orderPayload.currency || 'INR',
      name: orderPayload.name || 'Bracezin Soft Store',
      description: orderPayload.description || 'Software License Purchase',
      order_id: orderPayload.order_id,
      prefill: orderPayload.prefill || {},
      theme: {
        color: '#0e8ce9',
      },
      handler: (response: any) => {
        onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          if (onDismiss) onDismiss();
        }
      }
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      console.warn('Razorpay SDK not loaded, executing simulation handler.');
      // Fallback test simulation
      setTimeout(() => {
        onSuccess({
          razorpay_order_id: orderPayload.order_id,
          razorpay_payment_id: 'pay_sim_' + Math.random().toString(36).substring(7),
          razorpay_signature: 'mock_signature_valid'
        });
      }, 800);
    }
  }
}

