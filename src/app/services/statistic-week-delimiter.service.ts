import { Injectable } from '@angular/core';
import { ItemData } from '../statistic-chart/shared/bar-chart/core';
import { WeekDelimiterData } from '../statistic-chart/core';
import { ImpressionStatistic } from './impression-statistic';
import { startOfToday, endOfToday, subWeeks } from 'date-fns'
// mocks
import { weeksMock } from '../data/weeksMock';
import { random, getTimestamInSecond } from './helpers';
// for generate mock paggination
import * as D3 from 'd3';

@Injectable()
export class StatisticWeekDelimiterService implements ImpressionStatistic {

  private countRandom = 5;

  public getFirstChunkDateRange(): [Date, Date] {
    return [
      subWeeks(startOfToday(), 11),
      endOfToday()
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

    const x = D3.scaleTime().domain([d1, d2]);
    const randValues: Date[] = x.ticks(D3.timeWeek.every(countRand));

    return randValues.slice(
      randValues.length - count - 1,
      randValues.length - 1,
    ).map((date: Date) => ({
      identity: date,
      value: random(0, 999),
    }));
  }
}