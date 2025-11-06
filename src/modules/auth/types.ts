export interface AuthUser {
  id: string;
  email: string;
  role?: string;
  merchantIds?: string[]; // Merchant IDs from MerchantMembership
  user_metadata?: any;
}
