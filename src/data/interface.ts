export interface SatuanType {
  title: string;
  header: string[];
  data: {
    id: number;
    name: string;
    isActive: string;
  }[];
}

export interface KategoriType {
  title: string;
  header: string[];
  data: {
    id: number;
    name: string;
    isActive: string;
  }[];
}

export interface BarangType {
  title: string;
  header: string[];
  data: {
    id: number;
    name: string;
    purchasePrice: number;
    retailPrice: number;
    wholesalePrice: number;
    stock: number;
    minStock: number;
    barcode: string;
    image: string;
    category: string;
    size: number;
    unit: string;
    isActive: string;
  }[];
}
