import { Injectable } from '@angular/core';
import { ItemData } from '../statistic-chart/shared/bar-chart/core';
import { DayDelimiterData } from '../statistic-chart/core';
import { ImpressionStatistic } from './impression-statistic';
import { StatisticHourDelimiterService } from './statistic-hour-delimiter.service';
import {
  format,
  parse,
  startOfToday, endOfToday,
  differenceInHours,
  addHours, subHours,
  differenceInDays,
  addDays, subDays,
} from 'date-fns'
// mocks
import { daysMock } from '../data/daysMock';
// import { weeksMock } from '../data/weeksMock';
import { random, getTimestamInSecond } from './helpers';
// for generate mock paggination
import * as D3 from 'd3';

@Injectable()
export class StatisticDayDelimiterService implements ImpressionStatistic {
  private countRandom = 5;

  constructor() {
  }

  public getFirstChunkDateRange(): [Date, Date] {
    return [
      subDays(startOfToday(), 14),
      endOfToday()
    ];
  }

  public loadStaticticByDates(d1: Date, d2: Date): ItemData[] {
    const [firstChunkStart, firstChunkEnd] = this.getFirstChunkDateRange();
    if (differenceInDays(d1, firstChunkStart) <= 0
      && differenceInDays(d2, firstChunkEnd) <= 0) {

      return this.extendDateRangeByEmptyData(this.loadMockStaticData(), d1, d2);
    }
    const map = this.generateRandomChunk(d1, d2, this.countRandom);
    return this.extendDateRangeByEmptyData(map, d1, d2);
  }

  private extendDateRangeByEmptyData(data: Map<number, ItemData>, d1: Date, d2: Date): ItemData[] {
    // geberate ranage placeholders
    const countItems = Math.abs(differenceInDays(d1, d2)) + 1;

    const createDataItem = (el, index): ItemData => {
      const date: Date = addDays(d1, index);
      return data.has(getTimestamInSecond(date))
        ? data.get(getTimestamInSecond(date))
        : <ItemData>{
          identity: date,
          label: `[${format(date, 'ddd')}]`,
          value: 0,
        };
    };

    return Array.from(Array(countItems), createDataItem);
  }

  private loadMockStaticData(): Map<number, ItemData> {
    const mockStaticData: Map<number, ItemData> = new Map();

    daysMock.forEach((item: DayDelimiterData) => {
      const date = new Date();
      date.setUTCFullYear(+item.year);
      date.setUTCMonth(+item.month - 1);
      date.setUTCDate(+item.day);
      // date.setUTCHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      mockStaticData.set(
        getTimestamInSecond(date),
        {
          identity: date,
          label: `[[${format(date, 'ddd')}]]`,
          value: item.views,
        }
      );
    })

    return mockStaticData;
  }

  private generateRandomChunk(d1: Date, d2: Date, count: number): Map<number, ItemData> {
    const map = new Map<number, ItemData>();
    var x = D3.scaleTime().domain([d1, d2]);
    let randValues: Date[] = x.ticks(D3.timeDay.every(random(1, Math.floor(28 / count))));

    randValues.slice(
      randValues.length - count - 1,
      randValues.length - 1,
    ).forEach((date: Date) => {
      map.set(
        getTimestamInSecond(date),
        {
          identity: date,
          value: random(0, 999),
          label: `<${format(date, 'ddd')}>`,
        }
      )
    });

    return map;
  }
}