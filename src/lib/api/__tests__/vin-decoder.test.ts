
import { decodeVIN } from '../vin-decoder';
import { beforeEach, afterEach, vi } from 'vitest';

describe('VIN Decoder', () => {
  const mockVIN = '1HGCM82633A123456';
  const mockResponse = {
    Results: [
      { Variable: "Make", Value: "HONDA" },
      { Variable: "Model", Value: "ACCORD" },
      { Variable: "Model Year", Value: "2003" },
      { Variable: "Manufacturer Name", Value: "HONDA" },
      { Variable: "Vehicle Type", Value: "PASSENGER CAR" },
      { Variable: "Body Class", Value: "Sedan/Saloon" },
      { Variable: "Fuel Type - Primary", Value: "Gasoline" },
      { Variable: "Engine Size", Value: "2.4L" },
      { Variable: "Series", Value: "LX" },
      { Variable: "Trim", Value: "Base" },
      { Variable: "Plant Country", Value: "JAPAN" },
      { Variable: "Engine Number of Cylinders", Value: "4" },
      { Variable: "Doors", Value: "4" },
      { Variable: "Safety Rating", Value: "5" }
    ]
  };

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('successfully decodes a VIN', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await decodeVIN(mockVIN);
    expect(result.make).toBe('HONDA');
    expect(result.model).toBe('ACCORD');
    expect(result.year).toBe(2003);
    expect(result.manufacturer).toBe('HONDA');
  });

  test('handles API errors with retry', async () => {
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

    const result = await decodeVIN(mockVIN);
    expect(result.make).toBe('HONDA');
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  test('handles offline mode', async () => {
    const originalNavigator = { ...navigator };
    Object.defineProperty(global, 'navigator', {
      value: { onLine: false },
      writable: true
    });

    const result = await decodeVIN(mockVIN);
    expect(result.make).toBe('Pending Sync');
    expect(result.model).toBe('Offline Entry');

    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true
    });
  });
});
