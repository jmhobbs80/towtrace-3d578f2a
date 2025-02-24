
export { decodeVIN, type VehicleDecodedData } from './vin-decoder';
export { validateVIN } from './vin-validator';
export type { VINScannerHardware } from './scanner-types';
export { WebcamVINScanner } from './scanners/webcam-scanner';
export { BluetoothVINScanner } from './scanners/bluetooth-scanner';

import { WebcamVINScanner } from './scanners/webcam-scanner';
import { BluetoothVINScanner } from './scanners/bluetooth-scanner';

export const createVINScanner = async () => {
  const bluetoothScanner = new BluetoothVINScanner();
  const webcamScanner = new WebcamVINScanner();

  if (await bluetoothScanner.isAvailable()) {
    return bluetoothScanner;
  } else if (await webcamScanner.isAvailable()) {
    return webcamScanner;
  }
  
  throw new Error('No VIN scanner hardware available');
};
