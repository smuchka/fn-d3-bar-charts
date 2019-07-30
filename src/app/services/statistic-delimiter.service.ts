import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ItemData } from '../statistic-chart/shared/bar-chart/core';
import { StatisticWeekDelimiterService } from './statistic-week-delimiter.service';
import { StatisticDayDelimiterService } from './statistic-day-delimiter.service';
import { StatisticHourDelimiterService } from './statistic-hour-delimiter.service';
import { ImpressionStatistic } from './impression-statistic';
import { StatisticDelimiter } from '../statistic-chart/core';

@Injectable()
export class StatisticDelimiterService {

  constructor(
    private hourStatistic: StatisticHourDelimiterService,
    private dayStatistic: StatisticDayDelimiterService,
    private weekStatistic: StatisticWeekDelimiterService,
  ) { }

  public getFirstChunkDateRange(delimiter): [Date, Date] {
    return this.source(delimiter).getFirstChunkDateRange();
  }

  public loadStaticticByDates(delimiter, d1: Date, d2: Date): ItemData[] {
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