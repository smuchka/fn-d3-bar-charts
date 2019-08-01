import { DateChart } from '../../bar-chart/core';
import { addDays, startOfToday, startOfDay, endOfDay, format } from 'date-fns';

export class DayChartNavigation implements DateChart {

  public formatLabel(date: Date): string {
    return format(date, 'ddd');
  }

  public formatRangeLabel(from: Date, to: Date): string {
    return format(from, 'MMM DD, YYYY');
  }

  public calcNowBarDate(): Date {
    return this.calcStartBarOfDate(new Date());
  }

  public calcStartBarOfDate(date: Date): Date {
    return startOfDay(date);
  }

  public calcEndBarOfDate(date: Date): Date {
    return endOfDay(date);
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
