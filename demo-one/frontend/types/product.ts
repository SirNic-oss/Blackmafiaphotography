
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  images: string[];
  sizes?: string[];
  colors?: string[];
}
