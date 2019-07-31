import { addHours, startOfHour, endOfHour, format } from 'date-fns'
import { DateChart } from '../../bar-chart/core';

export class HourChartNavigation implements DateChart {

  public formatLabel(date: Date): string {
    return format(date, 'HH:mm');
  }

  public formatRangeLabel(from: Date, to: Date): string {
    return format(from, 'MMM DD HH:mm, YYYY');
  }

  public calcNowBarDate(): Date {
    // const now = new Date();
    // now.setMinutes(0);
    // now.setSeconds(0);
    // now.setMilliseconds(0);
    // return now;
    return this.calcStartBarOfDate(new Date());
  }

  public calcStartBarOfDate(date: Date): Date {
    return startOfHour(date);
  }

  public calcEndBarOfDate(date: Date): Date {
    return endOfHour(date);
  }

  public calcNextBarDate(from: Date): Date {
    return this.calcSomeDateOnDistance(from, 1);
  }

  public calcPrevBarDate(from: Date): Date {
    return this.calcSomeDateOnDistance(from, -1);
  }

  public calcSomeDateOnDistance(date: Date, calcDateDelimiter: number): Date {
    return addHours(date, calcDateDelimiter);
  }
}
