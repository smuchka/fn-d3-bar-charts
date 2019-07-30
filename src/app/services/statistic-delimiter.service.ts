import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ItemData } from '../statistic-chart/shared/bar-chart/core';
import { StatisticDayDelimiterService } from './statistic-day-delimiter.service';
import { StatisticHourDelimiterService } from './statistic-hour-delimiter.service';

@Injectable()
export class StatisticDelimiterService {

  constructor(
    private hourStatistic: StatisticHourDelimiterService,
    private dayStatistic: StatisticDayDelimiterService,
  ) { }

  public loadStaticticByDates(delimiter, d1: Date, d2: Date): ItemData[] {
    console.warn('loading from here <StatisticDelimiterService> ...')
    return this.source(delimiter).loadStaticticByDates(d1, d2);
  }

  private source(delimiter): any {
    return this.hourStatistic;
  }

}