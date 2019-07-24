import { Injectable } from '@angular/core';
import { StatisticDelimiter } from '../../core'
import {
  DateChartStrategy,
  HourChartNavigation,
  DayChartNavigation,
  WeekChartNavigation
} from '../bar-chart/core/date-delimiter-strategies';

// hour
// barWidth = 16;
// countBarsInViewport = 16;

// day
// barWidth = 24;
// countBarsInViewport = 14;

// week
// barWidth = 40;
// countBarsInViewport = 11;

@Injectable()
export class DelimiterChartStrategyService {

  // TODO: Can create dependence of WEB/MOB env
  constructor() { }

  public resolveDateDelimiterStrategy(delimiter: StatisticDelimiter): DateChartStrategy {
    switch (delimiter) {
      case StatisticDelimiter.Hour:
        return new HourChartNavigation();
      case StatisticDelimiter.Day:
        return new DayChartNavigation();
      case StatisticDelimiter.Week:
        return new WeekChartNavigation();
    }
  }

  public resolveChartDimetions(delimiter: StatisticDelimiter):
    Record<'barWidth' | 'countBarsInViewport', number> {

    let config = {};

    switch (delimiter) {
      case StatisticDelimiter.Hour:
        return {
          barWidth: 16,
          countBarsInViewport: 16,
        }

      case StatisticDelimiter.Day:
        return {
          barWidth: 24,
          countBarsInViewport: 14,
        }

      case StatisticDelimiter.Week:
        return {
          barWidth: 40,
          countBarsInViewport: 11,
        }

      default:
        return {
          barWidth: 10,
          countBarsInViewport: 10,
        };
    }
  }

}