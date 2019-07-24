import { DateChartStrategy } from './date-chart-strategy'
import { startOfWeek, addWeeks } from 'date-fns'

export class WeekChartNavigation implements DateChartStrategy {
  public calcNowBarDate(): Date {
    return startOfWeek(new Date(), { weekStartsOn: 1 });
  }

  public calcNextBarDate(from: Date): Date {
    return addWeeks(from, 1);
  }

  public calcPrevBarDate(from: Date): Date {
    return addWeeks(from, -1);
  }
}