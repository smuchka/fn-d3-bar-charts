import { Injectable } from '@angular/core';
import { ItemData } from '../statistic-chart/shared/bar-chart/core';
import { DelimiterChartConfigService } from './delimiter-chart-config.service';
import { StatisticDelimiter, WeekDelimiterData, DateRange, ChartSizeConfig } from '../statistic-chart/core';
import { ImpressionStatistic } from './impression-statistic';
import { startOfWeek, startOfDay, startOfToday, endOfWeek, endOfToday, subWeeks, addWeeks } from 'date-fns'
// mocks
import { weeksMock } from '../data/weeksMock';
import { random, getTimestamInSecond } from './helpers';
// todo: for generate mock paggination
import * as D3 from 'd3';

@Injectable()
export class StatisticWeekDelimiterService implements ImpressionStatistic {

  private countRandom = 35;
  private countPointsInChunk: number;

  public constructor(
    private delimiterConfig: DelimiterChartConfigService,
  ) {
    const config: ChartSizeConfig = this.delimiterConfig.getChartConfig(
      StatisticDelimiter.Week
    );
    this.countPointsInChunk = config.countChunk;
  }

  public getPrevDateByDiffOneBar(date: Date): Date {
    return subWeeks(date, 1);
  }

  public getRangeRelatedDate(relateDate: Date): DateRange {
    return {
      from: subWeeks(startOfWeek(relateDate, { weekStartsOn: 1 }), this.countPointsInChunk),
      to: startOfWeek(relateDate),
    }
  }

  public getRangeRelatedDateWithBorder(relateDate: Date): DateRange {
    return {
      from: subWeeks(startOfWeek(relateDate, { weekStartsOn: 1 }), this.countPointsInChunk),
      to: endOfWeek(relateDate),
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
    const countRand: number = random(1, Math.floor(24 / count));

    const endGenerateRange: Date = addWeeks(endOfWeek(d2, { weekStartsOn: 1 }), 1);
    const x = D3.scaleTime().domain([d1, endGenerateRange]);
    const randValues: Date[] = x.ticks(D3.timeWeek.every(countRand));

    return randValues.slice(
      randValues.length - count - 1,
      randValues.length - 1,
    ).map((date: Date) => ({
      identity: startOfWeek(date, { weekStartsOn: 1 }),
      value: random(0, 9999999),
      external: {
        amount: random(0, 9999999) / 100
      },
    }));
  }

  public loadMockData(): ItemData[] {
    return weeksMock.map((item: WeekDelimiterData) => {
      const date = new Date();
      date.setUTCFullYear(+item.year);
      date.setUTCMonth(+item.month - 1);
      date.setUTCDate(+item.day);
      date.setHours(0, 0, 0, 0);

      return {
        identity: date,
        value: item.views,
        external: {},
      };
    })
  }
}