
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';
import type { VINScannerHardware } from '../scanner-types';

export class WebcamVINScanner implements VINScannerHardware {
  private reader: BrowserMultiFormatReader;
  private videoElement: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;

  constructor() {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_39, BarcodeFormat.CODE_128]);
    hints.set(DecodeHintType.TRY_HARDER, true);
    this.reader = new BrowserMultiFormatReader(hints);
  }

  async isAvailable(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch {
      return false;
    }
  }

  async startScanning(): Promise<string> {
    try {
      this.videoElement = document.createElement('video');
      this.videoElement.style.position = 'fixed';
      this.videoElement.style.top = '50%';
      this.videoElement.style.left = '50%';
      this.videoElement.style.transform = 'translate(-50%, -50%)';
      this.videoElement.style.zIndex = '1000';
      document.body.appendChild(this.videoElement);

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      this.videoElement.srcObject = this.stream;
      await this.videoElement.play();

      const result = await this.reader.decodeFromVideoElement(this.videoElement);
      
      this.cleanup();
      
      if (!result?.getText()) {
        throw new Error('No barcode detected');
      }

      return result.getText();
    } catch (error) {
      this.cleanup();
      throw new Error('Failed to scan barcode');
    }
  }

  async stopScanning(): Promise<void> {
    this.cleanup();
  }

  private cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.remove();
      this.videoElement = null;
    }
  }
}
