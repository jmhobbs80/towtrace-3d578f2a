
import { BrowserMultiFormatReader } from '@zxing/browser';
import type { VINScannerHardware } from '../scanner-types';
import type { ScanMethod } from '../scanner-types';

export class OCRVINScanner implements VINScannerHardware {
  private reader: BrowserMultiFormatReader;
  private videoElement: HTMLVideoElement | null = null;
  private scanning: boolean = false;

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
    if (this.scanning) {
      throw new Error('Scanner is already running');
    }

    try {
      this.scanning = true;
      this.videoElement = document.createElement('video');
      this.videoElement.className = 'fixed top-0 left-0 w-full h-full object-cover z-50';
      document.body.appendChild(this.videoElement);

      // Add scanning overlay
      const overlay = document.createElement('div');
      overlay.className = 'fixed top-0 left-0 w-full h-full z-51 flex items-center justify-center';
      overlay.innerHTML = `
        <div class="absolute w-64 h-32 border-2 border-white rounded-lg">
          <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
          <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
          <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
          <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
        </div>
      `;
      document.body.appendChild(overlay);

      return new Promise<string>((resolve, reject) => {
        let timeoutId: number;

        const cleanup = () => {
          if (timeoutId) window.clearTimeout(timeoutId);
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
          this.stopScanning();
        };

        // Set a timeout to prevent indefinite scanning
        timeoutId = window.setTimeout(() => {
          cleanup();
          reject(new Error('VIN scanning timed out'));
        }, 30000);

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
              // Validate VIN format
              if (/^[A-HJ-NP-Z0-9]{17}$/.test(text)) {
                cleanup();
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
      this.scanning = false;
      console.error('Error starting OCR scanner:', error);
      throw error;
    }
  }

  async stopScanning(): Promise<void> {
    try {
      // Stop all video streams
      if (this.videoElement && this.videoElement.srcObject) {
        const stream = this.videoElement.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        this.videoElement.srcObject = null;
      }
      
      // Remove video element from DOM
      if (this.videoElement && this.videoElement.parentNode) {
        this.videoElement.parentNode.removeChild(this.videoElement);
      }
      
      // Clean up reader
      if (this.reader) {
        // Just release the reader without calling non-existent methods
        this.reader = new BrowserMultiFormatReader();
      }
      
      this.videoElement = null;
      this.scanning = false;
    } catch (error) {
      console.error('Error stopping OCR scanner:', error);
      throw error;
    }
  }

  getScanMethod(): ScanMethod {
    return 'ocr';
  }
}
