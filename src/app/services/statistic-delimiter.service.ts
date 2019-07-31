import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ItemData } from '../statistic-chart/shared/bar-chart/core';
import { StatisticWeekDelimiterService } from './statistic-week-delimiter.service';
import { StatisticDayDelimiterService } from './statistic-day-delimiter.service';
import { StatisticHourDelimiterService } from './statistic-hour-delimiter.service';
import { ImpressionStatistic } from './impression-statistic';
import { StatisticDelimiter, ChartSizeConfig, DateRange } from '../statistic-chart/core';
import { DelimiterChartConfigService } from './delimiter-chart-config.service';

@Injectable()
export class StatisticDelimiterService {

  constructor(
    private hourStatistic: StatisticHourDelimiterService,
    private dayStatistic: StatisticDayDelimiterService,
    private weekStatistic: StatisticWeekDelimiterService,
    private delimiterConfig: DelimiterChartConfigService,
  ) { }

  public getFirstChunkDateRange(delimiter: StatisticDelimiter, campaignStart: Date, campaignEnd: Date): DateRange {

    // const config: ChartSizeConfig = this.delimiterConfig.getChartConfig(delimiter);

    // // chunk size => delimiter * countInViewPort

    // if (now >= campaignStart && now <= campaignEnd) {
    //   // inside range => (current date -> start) - chunk size
    // } else if (now < campaignStart) {    // before start => current date - chunk size
    // } else if (now > campaignEnd) {    // after end    => campaignEnd - chunk size
    // }

    const [from, to] = this.source(delimiter).getFirstChunkDateRange();
    return [from, to];
  }

  // public calcPreviousDateRange(delimiter: StatisticDelimiter, before: Date): DateRange {

  // }

  public loadStaticticByDates(delimiter: StatisticDelimiter, d1: Date, d2: Date): ItemData[] {
    return this.source(delimiter).loadStaticticByDates(d1, d2);
  }

  private source(delimiter): ImpressionStatistic {
    switch (delimiter) {
      case StatisticDelimiter.Hour:
        return this.hourStatistic;

      case StatisticDelimiter.Day:
        return this.dayStatistic;

      case StatisticDelimiter.Week:
        return this.weekStatistic;
    }

    return null;
  }
}