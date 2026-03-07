export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface User {
  id: number;
  role: 'admin' | 'customer';
  first_name?: string;
  last_name?: string;
  email: string;
}

export interface Car {
  id: number;
  plate_number: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  gearbox: 'manual' | 'automatic';
  fuel: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  seats: number;
  daily_price: number;
  status: string;
  main_image?: string;
}

export interface Rental {
  id: number;
  car_id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  status: string;
  daily_price: number;
  total_price: number;
  brand?: string;
  model?: string;
}
