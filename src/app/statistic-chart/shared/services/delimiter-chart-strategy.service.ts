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

  private isMobile: boolean;

  // TODO: Can create dependence of WEB/MOB env
  constructor() {
    this.isMobile = false;
  }

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

  public getBarWidth(delimiter: StatisticDelimiter): number {

    switch (delimiter) {
      case StatisticDelimiter.Hour:
        return 16;

      case StatisticDelimiter.Day:
        return 24

      case StatisticDelimiter.Week:
        return 40;

      default:
        return 10;
    }
  }

  public getCountBars(delimiter: StatisticDelimiter): number {

    let count: [number, number] = 10;

    switch (delimiter) {
      case StatisticDelimiter.Hour:
        count = [7, 16];

      case StatisticDelimiter.Day:
        count = [5, 14]

      case StatisticDelimiter.Week:
        count = [5, 11];
    }
    return this.isMobile ? count[0] : count[1]
  }

}