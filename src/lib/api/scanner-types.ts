
export interface VINScannerHardware {
  isAvailable: () => Promise<boolean>;
  startScanning: () => Promise<string>;
  stopScanning: () => Promise<void>;
}
