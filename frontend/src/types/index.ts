export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
}

export interface Bill {
  id: number;
  user_id: number;
  period_month: number;
  period_year: number;
  previous_reading: number;
  current_reading: number;
  usage_m3: number;
  cost: number;
  status: 'paid' | 'unpaid' | 'overdue';
  due_date?: string;
  paid_date?: string;
  meter_photo_path?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ChartData {
  period: string;
  usage: number;
  cost: number;
}

export interface OCRResult {
  message: string;
  filePath: string;
  extractedText: string;
  extractedReading: number | null;
  suggestions: number[];
}