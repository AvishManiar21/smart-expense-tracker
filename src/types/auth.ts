// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  currency?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  currency: string;
}
