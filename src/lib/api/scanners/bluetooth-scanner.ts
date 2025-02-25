import type { BluetoothDeviceWithGATT, BluetoothRemoteGATTCharacteristic } from '../bluetooth-types';
import type { VINScannerHardware } from '../scanner-types';
import type { ScanMethod } from '../scanner-types';

export class BluetoothVINScanner implements VINScannerHardware {
  private device: BluetoothDeviceWithGATT | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;

  async isAvailable(): Promise<boolean> {
    return !!(navigator as Navigator & { bluetooth?: { requestDevice: Function } }).bluetooth;
  }

  async startScanning(): Promise<string> {
    try {
      const bluetooth = (navigator as Navigator & { bluetooth?: { requestDevice: Function } }).bluetooth;
      if (!bluetooth) {
        throw new Error('Bluetooth not supported');
      }

      this.device = await bluetooth.requestDevice({
        filters: [
          { services: ['battery_service'] }
        ]
      }) as BluetoothDeviceWithGATT;

      if (!this.device.gatt) {
        throw new Error('Bluetooth device not found');
      }

      const server = await this.device.gatt.connect();
      const service = await server.getPrimaryService('battery_service');
      this.characteristic = await service.getCharacteristic('battery_level');

      const value = await this.characteristic.readValue();
      const decoder = new TextDecoder();
      const vin = decoder.decode(value);

      if (!vin) {
        throw new Error('No VIN detected');
      }

      return vin;
    } catch (error) {
      await this.stopScanning();
      throw new Error('Failed to connect to Bluetooth scanner');
    }
  }

  async stopScanning(): Promise<void> {
    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.device = null;
    this.characteristic = null;
  }

  getScanMethod(): ScanMethod {
    return 'barcode';
  }
}
