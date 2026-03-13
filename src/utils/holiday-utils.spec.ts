import { describe, it, expect } from 'vitest';
import { 
  getEaster, 
  getAscension, 
  getPentecostMonday, 
  getCorpusChristi, 
  getGoodFriday, 
  getEasterMonday,
  getCarnaval
} from './holiday-utils';
import { format } from 'date-fns';

describe('holiday-utils', () => {
  const targetYear = 2026;

  it('calculates Easter Sunday for 2026', () => {
    // 2026-04-05
    const easter = getEaster(targetYear);
    expect(format(easter, 'yyyy-MM-dd')).toBe('2026-04-05');
  });

  it('calculates Ascension for 2026 (Easter + 39 days)', () => {
    // 2026-05-14
    const ascension = getAscension(targetYear);
    expect(format(ascension, 'yyyy-MM-dd')).toBe('2026-05-14');
  });

  it('calculates Pentecost Monday for 2026 (Easter + 50 days)', () => {
    // 2026-05-25
    const pentecost = getPentecostMonday(targetYear);
    expect(format(pentecost, 'yyyy-MM-dd')).toBe('2026-05-25');
  });

  it('calculates Corpus Christi for 2026 (Easter + 60 days)', () => {
    // 2026-06-04
    const corpus = getCorpusChristi(targetYear);
    expect(format(corpus, 'yyyy-MM-dd')).toBe('2026-06-04');
  });

  it('calculates Good Friday for 2026 (Easter - 2 days)', () => {
    // 2026-04-03
    const goodFriday = getGoodFriday(targetYear);
    expect(format(goodFriday, 'yyyy-MM-dd')).toBe('2026-04-03');
  });

  it('calculates Easter Monday for 2026 (Easter + 1 day)', () => {
    // 2026-04-06
    const easterMonday = getEasterMonday(targetYear);
    expect(format(easterMonday, 'yyyy-MM-dd')).toBe('2026-04-06');
  });

  it('calculates Carnaval for 2026 (Easter - 47 days)', () => {
    // 2026-02-17
    const carnaval = getCarnaval(targetYear);
    expect(format(carnaval, 'yyyy-MM-dd')).toBe('2026-02-17');
  });
});
