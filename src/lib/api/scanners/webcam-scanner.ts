
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat, PreviewTracker } from '@zxing/library';
import type { VINScannerHardware } from '../scanner-types';

interface ScannerOptions {
  preferredCamera?: 'environment' | 'user';
  enableHighQuality?: boolean;
  autoFocus?: boolean;
}

export class WebcamVINScanner implements VINScannerHardware {
  private reader: BrowserMultiFormatReader;
  private videoElement: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private scanning: boolean = false;
  private offlineCache: Set<string> = new Set();
  private readonly defaultOptions: ScannerOptions = {
    preferredCamera: 'environment',
    enableHighQuality: true,
    autoFocus: true
  };

  constructor() {
    const hints = new Map();
    // Optimize for VIN barcode formats
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.CODE_39,
      BarcodeFormat.CODE_128,
      BarcodeFormat.DATA_MATRIX
    ]);
    // Enable aggressive scanning
    hints.set(DecodeHintType.TRY_HARDER, true);
    // Improve accuracy
    hints.set(DecodeHintType.ASSUME_GS1, false);
    hints.set(DecodeHintType.RETURN_CODABAR_START_END, true);
    
    this.reader = new BrowserMultiFormatReader(hints, {
      delayBetweenScanAttempts: 100, // Faster scanning attempts
      delayBetweenScanSuccess: 300   // Prevent duplicate scans
    });
  }

  async isAvailable(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch {
      return false;
    }
  }

  private async getOptimalCameraSettings(): Promise<MediaTrackConstraints> {
    const constraints: MediaTrackConstraints = {
      facingMode: { ideal: 'environment' },
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      aspectRatio: { ideal: 1.7777777778 },
      frameRate: { max: 30 },
      focusMode: { ideal: 'continuous' },
      whiteBalanceMode: { ideal: 'continuous' },
      exposureMode: { ideal: 'continuous' }
    };

    // Check if advanced features are supported
    const isAdvancedSupported = await this.checkAdvancedCameraSupport();
    if (isAdvancedSupported) {
      constraints.advanced = [
        {
          autoFocus: true,
          zoom: 2,
          torch: true
        }
      ];
    }

    return constraints;
  }

  private async checkAdvancedCameraSupport(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          advanced: [{ torch: true }]
        }
      });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  }

  private createVideoOverlay(): HTMLDivElement {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    overlay.style.zIndex = '999';

    const scanArea = document.createElement('div');
    scanArea.style.position = 'absolute';
    scanArea.style.top = '50%';
    scanArea.style.left = '50%';
    scanArea.style.transform = 'translate(-50%, -50%)';
    scanArea.style.width = '80%';
    scanArea.style.height = '150px';
    scanArea.style.border = '2px solid #fff';
    scanArea.style.borderRadius = '10px';
    scanArea.style.boxShadow = '0 0 0 9999px rgba(0,0,0,0.7)';

    overlay.appendChild(scanArea);
    return overlay;
  }

  async startScanning(): Promise<string> {
    if (this.scanning) {
      throw new Error('Scanner is already active');
    }

    try {
      this.scanning = true;
      
      // Create and style video element
      this.videoElement = document.createElement('video');
      this.videoElement.style.position = 'fixed';
      this.videoElement.style.top = '50%';
      this.videoElement.style.left = '50%';
      this.videoElement.style.transform = 'translate(-50%, -50%)';
      this.videoElement.style.maxWidth = '100%';
      this.videoElement.style.maxHeight = '100%';
      this.videoElement.style.objectFit = 'cover';
      this.videoElement.style.zIndex = '998';

      // Add scanning overlay
      const overlay = this.createVideoOverlay();
      document.body.appendChild(overlay);
      document.body.appendChild(this.videoElement);

      // Get optimal camera settings
      const constraints = await this.getOptimalCameraSettings();
      
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: constraints,
        audio: false
      });

      // Apply stream to video element
      this.videoElement.srcObject = this.stream;
      await this.videoElement.play();

      // Start continuous scanning
      const result = await this.reader.decodeFromVideoElement(this.videoElement);
      
      if (!result?.getText()) {
        throw new Error('No barcode detected');
      }

      const vin = result.getText();

      // Cache VIN if offline
      if (!navigator.onLine) {
        this.offlineCache.add(vin);
        // Attempt to sync when back online
        window.addEventListener('online', this.syncOfflineCache.bind(this));
      }

      this.cleanup();
      return vin;

    } catch (error) {
      this.cleanup();
      throw new Error('Failed to scan barcode: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  private async syncOfflineCache(): Promise<void> {
    if (navigator.onLine && this.offlineCache.size > 0) {
      const vins = Array.from(this.offlineCache);
      try {
        // Sync cached VINs
        for (const vin of vins) {
          await this.syncVIN(vin);
          this.offlineCache.delete(vin);
        }
      } catch (error) {
        console.error('Failed to sync offline VINs:', error);
      }
    }
  }

  private async syncVIN(vin: string): Promise<void> {
    // Implement your sync logic here
    // This could be an API call to your backend
    console.log('Syncing VIN:', vin);
  }

  async stopScanning(): Promise<void> {
    this.cleanup();
  }

  private cleanup() {
    this.scanning = false;

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.remove();
      this.videoElement = null;
    }

    // Remove overlay if it exists
    const overlay = document.querySelector('div[style*="rgba(0,0,0,0.7)"]');
    if (overlay) {
      overlay.remove();
    }
  }
}
