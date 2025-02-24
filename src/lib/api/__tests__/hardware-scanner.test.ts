
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebcamVINScanner } from '../scanners/webcam-scanner';
import { BluetoothVINScanner } from '../scanners/bluetooth-scanner';
import { createVINScanner } from '../vehicles';

describe('Hardware Scanner Tests', () => {
  let mockWebcam: WebcamVINScanner;
  let mockBluetooth: BluetoothVINScanner;

  beforeEach(() => {
    mockWebcam = new WebcamVINScanner();
    mockBluetooth = new BluetoothVINScanner();

    vi.spyOn(mockWebcam, 'isAvailable');
    vi.spyOn(mockBluetooth, 'isAvailable');
    vi.spyOn(mockWebcam, 'startScanning');
    vi.spyOn(mockBluetooth, 'startScanning');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('creates bluetooth scanner when available', async () => {
    (mockBluetooth.isAvailable as ReturnType<typeof vi.fn>).mockResolvedValue(true);
    (mockWebcam.isAvailable as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    const scanner = await createVINScanner();
    expect(scanner instanceof BluetoothVINScanner).toBe(true);
  });

  test('falls back to webcam when bluetooth unavailable', async () => {
    (mockBluetooth.isAvailable as ReturnType<typeof vi.fn>).mockResolvedValue(false);
    (mockWebcam.isAvailable as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    const scanner = await createVINScanner();
    expect(scanner instanceof WebcamVINScanner).toBe(true);
  });

  test('throws error when no scanner available', async () => {
    (mockBluetooth.isAvailable as ReturnType<typeof vi.fn>).mockResolvedValue(false);
    (mockWebcam.isAvailable as ReturnType<typeof vi.fn>).mockResolvedValue(false);

    await expect(createVINScanner()).rejects.toThrow('No VIN scanner hardware available');
  });

  test('scanner cleanup on stop', async () => {
    const scanner = new WebcamVINScanner();
    const stopSpy = vi.spyOn(scanner, 'stopScanning');

    await scanner.startScanning();
    await scanner.stopScanning();

    expect(stopSpy).toHaveBeenCalled();
  });
});
