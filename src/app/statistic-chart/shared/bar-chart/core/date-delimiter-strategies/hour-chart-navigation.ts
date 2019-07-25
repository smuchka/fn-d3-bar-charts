import { DateChartStrategy } from './date-chart-strategy'
import { addHours, format } from 'date-fns'

export class HourChartNavigation implements DateChartStrategy {

  public formatLabel(date: Date): string {
    return format(date, 'HH:mm');
  }

  public calcNowBarDate(): Date {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
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