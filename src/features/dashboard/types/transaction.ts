// Unified Transaction type for dashboard feature
export interface Transaction {
  id: string | number;
  date: string | number;
  amount: string | number;
  title: string;
  description?: string;
  [key: string]: unknown;
}
