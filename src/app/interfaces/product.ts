export interface Product extends ProductParts {
  modelNumber: string;
}

interface ProductParts {
  capacity: string;
  category: string;
  description: string;
  pictureUrl: string;
  prices: { currency: string; price: number }[];
}

export interface ProductExcel {
  modelNumber: string;
  items: ProductParts[];
}
export interface ProductsExcel {
  // category as key
  [key: string]: ProductExcel[];
}
