import { DateChart } from '../../bar-chart/core';
import { startOfWeek, endOfWeek, addWeeks, getMonth, format, differenceInWeeks } from 'date-fns'

export class WeekChartNavigation implements DateChart {
  public formatLabel(date: Date | string): string {
    return idDate(date) ? `W${format(date, 'W')}` : date.toString();
  }

  public formatRangeLabel(from: Date, to: Date): string {

    const differentMonth: boolean = getMonth(from) !== getMonth(to);

    if (differentMonth) {
      return `${format(from, 'MMM DD')} - ${format(to, 'MMM DD, YYYY')}`;
    }

    return `${format(from, 'MMM DD')} - ${format(to, 'DD, YYYY')}`;
  }

  public calcNowBarDate(): Date {
    return this.calcStartBarOfDate(new Date());
  }

  public calcStartBarOfDate(date: Date): Date {
    return startOfWeek(date, { weekStartsOn: 1 });
  }

  public calcEndBarOfDate(date: Date): Date {
    return endOfWeek(date, { weekStartsOn: 1 });
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

  public calcOffsetIndexByRange(from: Date, to: Date, chunkSize: number): number {
    return Math.ceil(
      Math.abs(differenceInWeeks(from, to)) / chunkSize
    );
  }
}

function idDate(value: any): boolean {
  return value instanceof Date;
}
