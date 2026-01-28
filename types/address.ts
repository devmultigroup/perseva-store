// Address Types

export interface Address {
  id: string;
  user_id: string;
  label: string | null; // "Home", "Work"
  full_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at: string;
}

// Address as JSONB in orders
export interface AddressData {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  phone: string;
}
