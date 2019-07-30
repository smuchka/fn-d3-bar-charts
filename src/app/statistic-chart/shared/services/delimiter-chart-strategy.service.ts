import { Injectable } from '@angular/core';
import { StatisticDelimiter } from '../../core'
import { DateChart } from '../bar-chart/core';
import {
  HourChartNavigation,
  DayChartNavigation,
  WeekChartNavigation
} from './date-delimiter-strategies';

@Injectable()
export class DelimiterChartStrategyService {

  public resolveDateDelimiterStrategy(delimiter: StatisticDelimiter): DateChart {
    
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