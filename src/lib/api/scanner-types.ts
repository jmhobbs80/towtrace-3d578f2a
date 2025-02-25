
export type ScanMethod = 'barcode' | 'ocr' | 'manual';

export type ScanResult = {
  vin: string;
  method: ScanMethod;
  timestamp: number;
  confidence?: number;
  rawData?: string;
};

export interface VINScannerHardware {
  isAvailable(): Promise<boolean>;
  startScanning(): Promise<string>;
  stopScanning(): Promise<void>;
  getScanMethod(): ScanMethod;
}

export type ScanError = {
  code: 'TIMEOUT' | 'CAMERA_ERROR' | 'INVALID_VIN' | 'USER_CANCELLED';
  message: string;
  details?: any;
};
