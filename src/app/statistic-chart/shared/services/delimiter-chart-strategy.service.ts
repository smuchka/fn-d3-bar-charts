import { Injectable } from '@angular/core';
import { StatisticDelimiter } from '../../core'
import { DelimiterStrategy } from '../bar-chart/core';

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

  public resolveDateDelimiterStrategy(delimiter: StatisticDelimiter): DelimiterStrategy.DateChart {
    switch (delimiter) {
      case StatisticDelimiter.Hour:
        return new DelimiterStrategy.HourChartNavigation();
      case StatisticDelimiter.Day:
        return new DelimiterStrategy.DayChartNavigation();
      case StatisticDelimiter.Week:
        return new DelimiterStrategy.WeekChartNavigation();
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
        break;

      case StatisticDelimiter.Day:
        count = [5, 14];
        break;

      case StatisticDelimiter.Week:
        count = [5, 11];
        break;
    }
    return this.isMobile ? count[0] : count[1]
  }

}