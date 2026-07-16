export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  createdAt?: string | Date;
}

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  colors: string;
  sizes: string;
  imageUrl: string;
}
