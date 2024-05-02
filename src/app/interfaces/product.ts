export interface Product extends ProductParts {
  modelNumber: string;
}

export interface ProductPrice {
  currency: string;
  price: number;
}

interface ProductParts {
  capacity: string;
  category: string;
  description: string;
  pictureUrl: string;
  picturePath?: string;
  prices: ProductPrice[];
}

export interface ProductExcel {
  modelNumber: string;
  items: ProductParts[];
}
export interface ProductsExcel {
  // category as key
  [key: string]: ProductExcel[];
}
