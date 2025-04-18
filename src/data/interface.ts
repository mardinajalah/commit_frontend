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

export interface AnggotaType {
  title: string;
  header: string[];
  data: {
    nip: string;
    name: string;
    accountNumber: string;
    bank: string;
    phoneNumber: string;
    address: string;
    creditLimit: number;
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

export interface SupplierType {
  title: string;
  header: string[];
  data: {
    id: number;
    name: string;
    address: string;
    phoneNumber: number;
    company: string;
    isActive: string;
  };
}

export interface BarangTitipanType {
  title: string;
  header: string[];
  data: {
    id: number;
    vendor: string;
    name: string;
    category: string;
    sellPrice: DoubleRange;
    profitPercent: DoubleRange;
  };
}

export interface PenitipType {
  title: string;
  header: string;
  data: {
    id: number;
    name: string;
    phoneNumber: number;
    address: string;
    isActive: string;
    listProduct: string;
  };
}

export interface Supplier {
  id: number;
  name: string;
  phoneNumber: string;
}

export interface Product {
  id: number;
  name: string;
}

interface FormProduct {
  productId: number;
  purchasePrice: number;
  retailPrice: number;
  wholesalePrice: number;
  quantity: number;
  subtotal: number;
}

export interface FormValues {
  saleDate: string;
  supplierId: number;
  isPaid: boolean;
  products: FormProduct[];
}
