
import { BrowserMultiFormatReader } from '@zxing/browser';
import type { VINScannerHardware } from '../scanner-types';
import type { ScanMethod } from '../scanner-types';

export class OCRVINScanner implements VINScannerHardware {
  private reader: BrowserMultiFormatReader;
  private videoElement: HTMLVideoElement | null = null;

  constructor() {
    this.reader = new BrowserMultiFormatReader();
  }

  async isAvailable(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Error checking camera availability:', error);
      return false;
    }
  }

  async startScanning(): Promise<string> {
    try {
      this.videoElement = document.createElement('video');
      document.body.appendChild(this.videoElement);

      return new Promise<string>((resolve, reject) => {
        this.reader.decodeFromConstraints(
          {
            video: {
              facingMode: 'environment',
              width: { min: 1280, ideal: 1920, max: 2560 },
              height: { min: 720, ideal: 1080, max: 1440 }
            }
          },
          this.videoElement,
          (result, error) => {
            if (result) {
              const text = result.getText();
              // Validate that the scanned text matches VIN format
              if (/^[A-HJ-NP-Z0-9]{17}$/.test(text)) {
                this.stopScanning();
                resolve(text);
              }
            }
            if (error && !error.message.includes('No MultiFormat Readers')) {
              console.error('Scanning error:', error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error starting OCR scanner:', error);
      throw error;
    }
  }

  async stopScanning(): Promise<void> {
    try {
      this.reader.reset();
      if (this.videoElement && this.videoElement.parentNode) {
        this.videoElement.parentNode.removeChild(this.videoElement);
      }
      this.videoElement = null;
    } catch (error) {
      console.error('Error stopping OCR scanner:', error);
      throw error;
    }
  }

  getScanMethod(): ScanMethod {
    return 'ocr';
  }
}
