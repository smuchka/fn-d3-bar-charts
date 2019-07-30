import { DateChart } from '../../core';
import { addDays, addHours, startOfToday, format } from 'date-fns';

export class DayChartNavigation implements DateChart {

  public formatLabel(date: Date): string {
    return format(date, 'ddd');
  }

  public formatRangeLabel(from: Date, to: Date): string {
    return format(from, 'MMM DD, YYYY');
  }

  public calcNowBarDate(): Date {
    return startOfToday();
  }

  public calcNextBarDate(from: Date): Date {
    return this.calcSomeDateOnDistance(from, 1);
  }

  public calcPrevBarDate(from: Date): Date {
    return this.calcSomeDateOnDistance(from, -1);
  }

  public calcSomeDateOnDistance(date: Date, calcDateDelimiter: number): Date {
    return addDays(date, calcDateDelimiter);
  }
}