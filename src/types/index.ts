export interface Reading {
  month: string;
  meteran: number;
  penggunaan: number;
  tagihan: number;
  foto?: string | null;
}

export interface UserData {
  name: string;
  readings: Reading[];
}

export interface AdminDataItem {
  nama: string;
  bulan: string;
  meteran: number;
  penggunaan: number;
  tagihan: number;
  foto?: string | null;
}

export interface AdminResponse {
  status: string;
  data: AdminDataItem[];
}

export interface SaveDataPayload {
  name: string;
  month: string;
  meteran: number;
  penggunaan: number;
  tagihan: number;
  imageData?: string;
  mimeType?: string;
  foto?: string;
}
