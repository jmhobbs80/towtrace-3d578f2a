
export const validateVIN = (vin: string): boolean => {
  // VIN must be 17 characters
  if (vin.length !== 17) return false;

  // VIN can only contain alphanumeric characters (excluding I, O, Q)
  const validVINRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!validVINRegex.test(vin)) return false;

  // Add checksum validation
  const weights = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
  const values: { [key: string]: number } = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
    'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9
  };

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin[i];
    const value = values[char] || Number(char);
    sum += value * weights[i];
  }

  const check = sum % 11;
  const checkDigit = check === 10 ? 'X' : check.toString();
  return checkDigit === vin[8];
};
