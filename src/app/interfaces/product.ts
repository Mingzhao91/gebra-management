export interface Product {
  modelNumber: string;
  capacity: string;
  description: string;
  pictureUrl: string;
  prices: { currency: string; price: number }[];
}
