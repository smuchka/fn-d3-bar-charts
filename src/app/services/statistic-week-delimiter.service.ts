import { Injectable } from '@angular/core';
import { ItemData } from '../statistic-chart/shared/bar-chart/core';
import { WeekDelimiterData, DateRange } from '../statistic-chart/core';
import { ImpressionStatistic } from './impression-statistic';
import { startOfWeek, startOfDay, startOfToday, endOfWeek, endOfToday, subWeeks, addWeeks } from 'date-fns'
// mocks
import { weeksMock } from '../data/weeksMock';
import { random, getTimestamInSecond } from './helpers';
// for generate mock paggination
import * as D3 from 'd3';

@Injectable()
export class StatisticWeekDelimiterService implements ImpressionStatistic {

  private countRandom = 35;

  public getFirstChunkDateRange(): DateRange {
    const startCurrentWeek = startOfWeek(startOfToday(), { weekStartsOn: 1 })
    const countItemsInViewport = 11;
    return [
      subWeeks(startCurrentWeek, countItemsInViewport),
      // startOfDay(endOfWeek(startCurrentWeek, { weekStartsOn: 1 })),
      startCurrentWeek
    ];
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
      };
    })
  }

  public loadStaticticByDates(d1: Date, d2: Date): ItemData[] {
    return this.generateRandomChunk(d1, d2, this.countRandom);
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
      value: random(0, 999),
    }));
  }
}