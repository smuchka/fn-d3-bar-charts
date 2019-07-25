import { DateChart } from './date-chart-strategy'
import { startOfWeek, addWeeks, getMonth, format } from 'date-fns'

export class WeekChartNavigation implements DateChart {

  public formatLabel(date: Date | string): string {
    return idDate(date) ? format(date, 'ddd') : date.toString();
  }

  public formatRangeLabel(from: Date, to: Date): string {

    const differentMonth: boolean = getMonth(from) !== getMonth(to);

    if (differentMonth) {
      return `${format(from, 'MMM DD')} - ${format(to, 'MMM DD, YYYY')}`;
    }

    return `${format(from, 'MMM DD')} - ${format(to, 'DD, YYYY')}`;
  }

  public calcNowBarDate(): Date {
    return startOfWeek(new Date(), { weekStartsOn: 1 });
  }

  public calcNextBarDate(from: Date): Date {
    return this.calcSomeDateOnDistance(from, 1);
  }

  public calcPrevBarDate(from: Date): Date {
    return this.calcSomeDateOnDistance(from, -1);
  }

  public calcSomeDateOnDistance(date: Date, calcDateDelimiter: number): Date {
    return addWeeks(date, calcDateDelimiter);
  }
}

function idDate(value: any): boolean {
  return value instanceof Date;
}