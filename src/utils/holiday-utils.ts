import { addDays, subDays } from 'date-fns';

/**
 * Calculates Easter Sunday for a given year using the Meeus/Jones/Butcher algorithm.
 * @param year The year to calculate Easter for.
 * @returns A Date object representing Easter Sunday.
 */
export function getEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const L = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * L) / 451);
  const month = Math.floor((h + L - 7 * m + 114) / 31);
  const day = ((h + L - 7 * m + 114) % 31) + 1;

  // month is 1-indexed in algorithm, but 0-indexed in JS Date
  return new Date(year, month - 1, day);
}

/**
 * Ascension (Quinta-feira da Ascensão) - Easter + 39 days.
 */
export function getAscension(year: number): Date {
  return addDays(getEaster(year), 39);
}

/**
 * Pentecost Monday (Segunda-feira de Pentecostes) - Easter + 50 days.
 */
export function getPentecostMonday(year: number): Date {
  return addDays(getEaster(year), 50);
}

/**
 * Corpus Christi (Corpo de Deus) - Easter + 60 days.
 */
export function getCorpusChristi(year: number): Date {
  return addDays(getEaster(year), 60);
}

/**
 * Good Friday (Sexta-feira Santa) - Easter - 2 days.
 */
export function getGoodFriday(year: number): Date {
  return subDays(getEaster(year), 2);
}

/**
 * Easter Monday (Segunda-feira de Páscoa) - Easter + 1 day.
 */
export function getEasterMonday(year: number): Date {
  return addDays(getEaster(year), 1);
}

/**
 * Carnaval (Terça-feira de Carnaval) - Easter - 47 days.
 */
export function getCarnaval(year: number): Date {
  return subDays(getEaster(year), 47);
}

/**
 * Formats a list of ISO date strings into a summary grouped by month.
 * Example: "FEV: 16, 18, 19, 20; MAR: 20, 31"
 */
export function formatVacationSummary(markedDays: string[]): string {
  if (markedDays.length === 0) return 'Nenhum dia selecionado';

  const monthsPT = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  const grouped: Record<number, number[]> = {};

  markedDays.forEach(dateStr => {
    const date = new Date(dateStr);
    const month = date.getMonth();
    const day = date.getDate();
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(day);
  });

  const sortedMonths = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  return sortedMonths
    .map(m => {
      const days = grouped[m]
        .sort((a, b) => a - b)
        .map(d => d.toString().padStart(2, '0'))
        .join(', ');
      return `${monthsPT[m]}: ${days}`;
    })
    .join('; ');
}
