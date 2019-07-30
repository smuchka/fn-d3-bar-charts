import { Injectable } from '@angular/core';
import { StatisticDelimiter } from '../../core'
import { DelimiterStrategy } from '../bar-chart/core';

@Injectable()
export class DelimiterChartStrategyService {

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
}