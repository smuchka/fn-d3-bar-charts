import { Injectable } from '@angular/core';
import { ItemData } from '../statistic-chart/shared/bar-chart/core';
import { DelimiterChartConfigService } from './delimiter-chart-config.service';
import { StatisticDelimiter, DayDelimiterData, DateRange, ChartSizeConfig } from '../statistic-chart/core';
import { ImpressionStatistic } from './impression-statistic';
import { startOfDay, endOfDay, subDays } from 'date-fns'
// mocks
import { daysMock } from '../data/daysMock';
import { random, getTimestamInSecond } from './helpers';
// todo: for generate mock paggination
import * as D3 from 'd3';

@Injectable()
export class StatisticDayDelimiterService implements ImpressionStatistic {

  private countRandom = 5;
  private countPointsInChunk: number;

  public constructor(
    private delimiterConfig: DelimiterChartConfigService,
  ) {
    const config: ChartSizeConfig = this.delimiterConfig.getChartConfig(
      StatisticDelimiter.Day
    );
    this.countPointsInChunk = config.countChunk;
  }

  public getPrevDateByDiffOneBar(date: Date): Date {
    return subDays(date, 1);
  }

  public getRangeRelatedDate(relateDate: Date): DateRange {
    return {
      from: subDays(startOfDay(relateDate), this.countPointsInChunk),
      to: startOfDay(relateDate),
    }
  }

  public getRangeRelatedDateWithBorder(relateDate: Date): DateRange {
    return {
      from: subDays(startOfDay(relateDate), this.countPointsInChunk),
      to: endOfDay(relateDate),
    }
  }

  //
  // todo: only for debug
  // Emulate loading data from server by range dates
  //

  public loadStaticticByDates(range: DateRange): ItemData[] {
    return this.generateRandomChunk(range.from, range.to, this.countRandom);
  }

  private generateRandomChunk(d1: Date, d2: Date, count: number): ItemData[] {
    const map = new Map<number, ItemData>();
    const countRand: number = random(1, Math.floor(28 / count));

    const x = D3.scaleTime().domain([d1, d2]);
    const randValues: Date[] = x.ticks(D3.timeDay.every(countRand));

    return randValues.slice(
      randValues.length - count - 1,
      randValues.length - 1,
    ).map((date: Date) => ({
      identity: date,
      value: random(0, 999),
    }));
  }

  public loadMockData(): ItemData[] {
    return daysMock.map((item: DayDelimiterData) => {
      const date = new Date();
      date.setUTCFullYear(+item.year);
      date.setUTCMonth(+item.month - 1);
      date.setUTCDate(+item.day);
      // date.setUTCHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      return {
        identity: date,
        value: item.views,
      };
    })
  }
}
