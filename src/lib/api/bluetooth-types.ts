
export interface BluetoothDevice {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
  watchAdvertisements?: () => Promise<void>;
  unwatchAdvertisements?: () => void;
  addEventListener?: (type: string, listener: EventListener) => void;
  removeEventListener?: (type: string, listener: EventListener) => void;
}

export interface BluetoothRemoteGATTServer {
  getPrimaryService: (service: string) => Promise<BluetoothRemoteGATTService>;
  connect: () => Promise<BluetoothRemoteGATTServer>;
  connected: boolean;
  disconnect: () => void;
}

export interface BluetoothRemoteGATTService {
  getCharacteristic: (characteristic: string) => Promise<BluetoothRemoteGATTCharacteristic>;
}

export interface BluetoothRemoteGATTCharacteristic {
  readValue: () => Promise<DataView>;
}

export interface BluetoothDeviceWithGATT extends BluetoothDevice {
  gatt?: BluetoothRemoteGATTServer;
}
