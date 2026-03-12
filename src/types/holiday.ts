export type HolidayType = 'fixed' | 'mobile';

export interface Holiday {
  id: string;
  name: string;
  day: number;
  month: number;
  type: HolidayType;
  description?: string;
  offset?: number;
  base?: string;
}

export interface Municipality {
  id: string;
  name: string;
  district: string;
  holiday: Holiday;
}

export interface CalendarDay {
  date: Date;
  isWeekend: boolean;
  isHoliday: boolean;
  isVacation: boolean;
  holidayName?: string;
}
