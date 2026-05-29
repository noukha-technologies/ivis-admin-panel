import { MONTH_NAMES } from '@/constants/appointments';

export interface CalendarGridCell {
  isCurrentMonth: boolean;
  dayNum: number | null;
}

export function buildCalendarGridCells(year: string, month: string): CalendarGridCell[] {
  const yearNum = parseInt(year, 10);
  const monthIndex = MONTH_NAMES.indexOf(month as (typeof MONTH_NAMES)[number]);
  const firstDay = new Date(yearNum, monthIndex, 1);
  const rawDay = firstDay.getDay();
  const leadingEmptyDays = rawDay === 0 ? 6 : rawDay - 1;
  const daysInMonth = new Date(yearNum, monthIndex + 1, 0).getDate();
  const totalGridCells = 42;

  const gridCells: CalendarGridCell[] = [];

  for (let i = 0; i < leadingEmptyDays; i++) {
    gridCells.push({ isCurrentMonth: false, dayNum: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    gridCells.push({ isCurrentMonth: true, dayNum: d });
  }
  const remainingCells = totalGridCells - gridCells.length;
  for (let i = 0; i < remainingCells; i++) {
    gridCells.push({ isCurrentMonth: false, dayNum: null });
  }

  return gridCells;
}

export function getDaysInMonth(year: string, month: string): number {
  const yearNum = parseInt(year, 10);
  const monthIndex = MONTH_NAMES.indexOf(month as (typeof MONTH_NAMES)[number]);
  return new Date(yearNum, monthIndex + 1, 0).getDate();
}
