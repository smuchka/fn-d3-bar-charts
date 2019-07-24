import { DateChartStrategy } from './date-chart-strategy'
import { addDays, addHours, startOfToday } from 'date-fns'

export class DayChartNavigation implements DateChartStrategy {
  public calcNowBarDate(): Date {
    return startOfToday();
  }

  public calcNextBarDate(from: Date): Date {
    return addDays(from, 1);
  }

  public calcPrevBarDate(from: Date): Date {
    return addDays(from, -1);
  }
}