import { DateChartStrategy } from './date-chart-strategy'
import { addHours } from 'date-fns'

export class DayChartNavigation implements DateChartStrategy {
  public calcNowBarDate(): Date {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  }

  public calcNextBarDate(from: Date): Date {
    return addHours(from, 1);
  }

  public calcPrevBarDate(from: Date): Date {
    return addHours(from, -1);
  }
}