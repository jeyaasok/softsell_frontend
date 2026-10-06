export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super_admin' | 'admin' | 'support' | 'customer';
  status: 'active' | 'suspended' | 'banned';
  avatar_url?: string;
  github_username?: string;
  created_at: string;
}

export interface Category {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVersion {
  id: number;
  uuid: string;
  product_id: number;
  version_number: string;
  github_release_id?: number;
  github_asset_id?: number;
  github_asset_name?: string;
  file_size_bytes?: number;
  checksum_sha256?: string;
  changelog?: string;
  is_latest: boolean;
  release_date?: string;
}

export interface Product {
  id: number;
  uuid: string;
  category_id: number;
  category?: Category;
  name: string;
  slug: string;
  summary: string;
  description: string;
  current_version: string;
  price: number;
  discount_price?: number;
  effective_price?: number;
  currency: string;
  github_repo_owner?: string;
  github_repo_name?: string;
  github_release_tag?: string;
  github_asset_name?: string;
  demo_url?: string;
  documentation_url?: string;
  thumbnail_url?: string;
  gallery_images?: string[];
  tags?: string[];
  features?: string[];
  tech_stack?: string[];
  is_active: boolean;
  is_featured: boolean;
  requires_license_key: boolean;
  max_download_limit: number;
  download_expiry_days: number;
  versions?: ProductVersion[];
  latest_version?: ProductVersion;
}

export interface OrderItem {
  id: number;
  uuid: string;
  order_id: number;
  product_id: number;
  product?: Product;
  product_name: string;
  product_version: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface Payment {
  id: number;
  uuid: string;
  order_id: number;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
  method?: string;
  captured_at?: string;
}

export interface Refund {
  id: number;
  uuid: string;
  order_id: number;
  razorpay_refund_id?: string;
  amount: number;
  currency: string;
  reason?: string;
  status: 'pending' | 'processed' | 'failed';
  processed_at?: string;
  processed_by?: User;
}

export interface LicenseKey {
  id: number;
  uuid: string;
  product_id: number;
  product?: Product;
  license_key: string;
  max_activations: number;
  current_activations: number;
  activated_domains?: string[];
  status: 'active' | 'revoked' | 'expired' | 'suspended';
  valid_until?: string;
  last_verified_at?: string;
}

export interface Entitlement {
  id: number;
  uuid: string;
  user_id: number;
  product_id: number;
  product: Product;
  order_id: number;
  order?: Order;
  license_key_id?: number;
  license_key?: LicenseKey;
  status: 'active' | 'revoked' | 'expired' | 'suspended';
  access_granted_at: string;
  access_expires_at?: string;
  max_downloads: number;
  download_count: number;
  revocation_reason?: string;
}

export interface Order {
  id: number;
  uuid: string;
  order_number: string;
  user_id: number;
  user?: User;
  subtotal_amount: number;
  discount_amount: number;
  tax_amount: number;
  net_amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  payment_status: 'unpaid' | 'paid' | 'refunded' | 'failed';
  billing_details?: any;
  items: OrderItem[];
  payments?: Payment[];
  latestPayment?: Payment;
  latest_payment?: Payment;
  refunds?: Refund[];
  entitlements?: Entitlement[];
  created_at: string;
  completed_at?: string;
}

export interface DownloadLog {
  id: number;
  entitlement_id?: number;
  user_id?: number;
  user?: User;
  product_id?: number;
  product?: Product;
  product_version_id?: number;
  version?: ProductVersion;
  ip_address?: string;
  user_agent?: string;
  country?: string;
  city?: string;
  bytes_transferred: number;
  status: 'success' | 'unauthorized' | 'expired' | 'quota_exceeded' | 'revoked';
  downloaded_at: string;
}

export interface SocialSharePlatform {
  name: string;
  icon: string;
  url: string;
}

export interface SocialShareData {
  referral_code: string;
  product_slug: string;
  product_name: string;
  platforms: Record<string, SocialSharePlatform>;
}

export interface AdminStats {
  metrics: {
    total_revenue: number;
    total_orders: number;
    total_customers: number;
    total_products: number;
    total_downloads: number;
  };
  recent_orders: Order[];
  top_products: Product[];
  sales_trend: Array<{ month: string; orders_count: number; total_revenue: number }>;
}

