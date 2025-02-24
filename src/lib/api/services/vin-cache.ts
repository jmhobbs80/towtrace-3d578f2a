
export interface CachedVINData {
  vin: string;
  timestamp: number;
  data: any;
}

export class VINCacheService {
  private static instance: VINCacheService;
  private cache: Map<string, CachedVINData>;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    this.cache = new Map();
    this.loadFromLocalStorage();
    window.addEventListener('online', () => this.syncOfflineData());
  }

  static getInstance(): VINCacheService {
    if (!VINCacheService.instance) {
      VINCacheService.instance = new VINCacheService();
    }
    return VINCacheService.instance;
  }

  private loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('vin_cache');
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load VIN cache:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      const data = Object.fromEntries(this.cache);
      localStorage.setItem('vin_cache', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save VIN cache:', error);
    }
  }

  async get(vin: string): Promise<any | null> {
    const cached = this.cache.get(vin);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  set(vin: string, data: any): void {
    this.cache.set(vin, {
      vin,
      timestamp: Date.now(),
      data
    });
    this.saveToLocalStorage();
  }

  private async syncOfflineData() {
    if (!navigator.onLine) return;

    for (const [vin, cached] of this.cache.entries()) {
      if (cached.timestamp < Date.now() - this.CACHE_DURATION) {
        try {
          // Implement your sync logic here
          console.log('Syncing cached VIN data:', vin);
        } catch (error) {
          console.error('Failed to sync VIN data:', error);
        }
      }
    }
  }

  clearExpired(): void {
    const now = Date.now();
    for (const [vin, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.CACHE_DURATION) {
        this.cache.delete(vin);
      }
    }
    this.saveToLocalStorage();
  }
}
