
import { validateVIN } from '../vin-validator';

describe('VIN Validator', () => {
  test('validates correct VIN format', () => {
    const validVIN = '1HGCM82633A123456';
    expect(validateVIN(validVIN)).toBe(true);
  });

  test('rejects VIN with invalid length', () => {
    const shortVIN = '1HGCM8263A123456';
    const longVIN = '1HGCM82633A1234567';
    expect(validateVIN(shortVIN)).toBe(false);
    expect(validateVIN(longVIN)).toBe(false);
  });

  test('rejects VIN with invalid characters', () => {
    const invalidVIN = '1HGCM82633O123456'; // Contains 'O'
    expect(validateVIN(invalidVIN)).toBe(false);
  });

  test('validates VIN checksum', () => {
    const validVINs = [
      '1HGCM82633A123456',
      '2FTPF17Z3XCA12345',
      'WBAWL73589P371282'
    ];
    
    validVINs.forEach(vin => {
      expect(validateVIN(vin)).toBe(true);
    });
  });
});
