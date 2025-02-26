
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('calculate-tow-cost', () => {
  beforeAll(async () => {
    // Setup test data if needed
  });

  afterAll(async () => {
    // Cleanup test data if needed
  });

  it('should calculate basic tow cost', async () => {
    const { data, error } = await supabase.functions.invoke('calculate-tow-cost', {
      body: {
        distance: 10,
        serviceType: 'standard',
        isPeakHours: false
      }
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.cost).toBeGreaterThan(0);
    expect(typeof data.cost).toBe('number');
  });

  it('should apply peak hour surcharge', async () => {
    const [regularResponse, peakResponse] = await Promise.all([
      supabase.functions.invoke('calculate-tow-cost', {
        body: {
          distance: 10,
          serviceType: 'standard',
          isPeakHours: false
        }
      }),
      supabase.functions.invoke('calculate-tow-cost', {
        body: {
          distance: 10,
          serviceType: 'standard',
          isPeakHours: true
        }
      })
    ]);

    expect(peakResponse.data.cost).toBeGreaterThan(regularResponse.data.cost);
  });

  it('should handle invalid input', async () => {
    const { data, error } = await supabase.functions.invoke('calculate-tow-cost', {
      body: {
        distance: -1,
        serviceType: 'invalid_type',
        isPeakHours: false
      }
    });

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });
});
