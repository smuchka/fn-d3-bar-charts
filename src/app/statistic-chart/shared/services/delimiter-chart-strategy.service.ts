import { Injectable } from '@angular/core';
import { StatisticDelimiter } from '../../core'
import {
  DateChartStrategy,
  HourChartNavigation,
  DayChartNavigation,
  WeekChartNavigation
} from '../bar-chart/core/date-delimiter-strategies';

@Injectable()
export class DelimiterChartStrategyService {

  constructor() { }

  private resolveDateDelimiterStrategy(delimiter: StatisticDelimiter): DateChartStrategy {
    switch (delimiter) {
      case StatisticDelimiter.Hour:
        return new HourChartNavigation();
      case StatisticDelimiter.Day:
        return new DayChartNavigation();
      case StatisticDelimiter.Week:
        return new WeekChartNavigation();
    }
  }

}