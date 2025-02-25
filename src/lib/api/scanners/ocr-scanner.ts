
import { BrowserMultiFormatReader } from '@zxing/browser';
import type { VINScannerHardware } from '../scanner-types';
import type { ScanMethod } from '../scanner-types';
import { useIsMobile } from '@/hooks/use-mobile';

export class OCRVINScanner implements VINScannerHardware {
  private reader: BrowserMultiFormatReader;
  private videoElement: HTMLVideoElement | null = null;
  private scanning: boolean = false;
  private retryAttempts: number = 0;
  private readonly MAX_RETRIES = 3;
  private readonly SCAN_TIMEOUT = 30000; // 30 seconds

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

      // Add scanning overlay with improved visual feedback
      const overlay = document.createElement('div');
      overlay.className = 'fixed top-0 left-0 w-full h-full z-51 flex flex-col items-center justify-center bg-black bg-opacity-50';
      overlay.innerHTML = `
        <div class="relative w-64 h-32">
          <div class="absolute w-full h-full border-2 border-white rounded-lg">
            <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
            <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
            <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
            <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
          </div>
        </div>
        <div class="mt-4 text-white text-center">
          <p class="text-lg">Position VIN within frame</p>
          <p class="text-sm mt-2" id="scan-status">Scanning...</p>
        </div>
      `;
      document.body.appendChild(overlay);

      // Setup constraints based on device type
      const isMobile = window.innerWidth < 768;
      const constraints = {
        video: {
          facingMode: isMobile ? 'environment' : 'user',
          width: { min: 1280, ideal: 1920, max: 2560 },
          height: { min: 720, ideal: 1080, max: 1440 },
          ...(isMobile && { focusMode: 'continuous' })
        }
      };

      return new Promise<string>((resolve, reject) => {
        let timeoutId: number;
        let statusElement: HTMLElement;

        const cleanup = () => {
          if (timeoutId) window.clearTimeout(timeoutId);
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
          this.stopScanning();
        };

        const updateStatus = (message: string) => {
          statusElement = document.getElementById('scan-status');
          if (statusElement) {
            statusElement.textContent = message;
          }
        };

        // Set a timeout to prevent indefinite scanning
        timeoutId = window.setTimeout(() => {
          cleanup();
          if (this.retryAttempts < this.MAX_RETRIES) {
            this.retryAttempts++;
            this.startScanning()
              .then(resolve)
              .catch(reject);
          } else {
            this.retryAttempts = 0;
            reject(new Error('VIN scanning timed out after maximum retries'));
          }
        }, this.SCAN_TIMEOUT);

        this.reader.decodeFromConstraints(
          constraints,
          this.videoElement,
          (result, error) => {
            if (result) {
              const text = result.getText();
              // Validate VIN format
              if (/^[A-HJ-NP-Z0-9]{17}$/.test(text)) {
                updateStatus('VIN detected! Processing...');
                cleanup();
                resolve(text);
              } else {
                updateStatus('Invalid VIN format. Please try again.');
              }
            }
            if (error && !error.message.includes('No MultiFormat Readers')) {
              updateStatus('Scanning error. Please try again.');
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
      this.reader = new BrowserMultiFormatReader();
      
      this.videoElement = null;
      this.scanning = false;
      this.retryAttempts = 0;
    } catch (error) {
      console.error('Error stopping OCR scanner:', error);
      throw error;
    }
  }

  getScanMethod(): ScanMethod {
    return 'ocr';
  }
}
