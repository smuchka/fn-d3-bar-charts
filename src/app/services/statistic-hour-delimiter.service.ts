import { Injectable } from '@angular/core';
import { ItemData } from '../statistic-chart/shared/bar-chart/core';
import { HourDelimiterData } from '../statistic-chart/core';
import { ImpressionStatistic } from './impression-statistic';
import {
  format,
  startOfToday, endOfToday,
  differenceInHours,
  addHours,
  subHours,
} from 'date-fns'
// mocks
import { hoursMock } from '../data/hoursMock';
import { random, getTimestamInSecond } from './helpers';
// for generate mock paggination
import * as D3 from 'd3';

@Injectable()
export class StatisticHourDelimiterService implements ImpressionStatistic {
  private countRandom = 5;

  constructor() {
  }

  public getFirstChunkDateRange(): [Date, Date] {
    return [
      subHours(startOfToday(), 0),
      subHours(endOfToday(), 0)
    ];
  }

  public loadStaticticByDates(d1: Date, d2: Date): ItemData[] {
    const [firstChunkStart, firstChunkEnd] = this.getFirstChunkDateRange();

    if (differenceInHours(d1, firstChunkStart) <= 0
      && differenceInHours(d2, firstChunkEnd) <= 0) {
      return this.extendDateRangeByEmptyData(this.loadMockStaticData(), d1, d2);
    }

    const map = this.generateRandomHourChunk(d1, d2, this.countRandom);
    return this.extendDateRangeByEmptyData(map, d1, d2);
  }

  private extendDateRangeByEmptyData(data: Map<number, ItemData>, d1: Date, d2: Date): ItemData[] {
    // geberate ranage placeholders
    const countHours = Math.abs(differenceInHours(d1, d2)) + 1;

    const createDataItem = (el, index): ItemData => {
      const date: Date = addHours(d1, index);
      return data.has(getTimestamInSecond(date))
        ? data.get(getTimestamInSecond(date))
        : <ItemData>{
          identity: date,
          label: format(date, 'HH:mm'),
          value: 0,
        };
    };


    return Array.from(Array(countHours), createDataItem);
  }

  private loadMockStaticData(): Map<number, ItemData> {
    const mockStaticDataHour: Map<number, ItemData> = new Map();

    hoursMock.forEach((item: HourDelimiterData) => {
      const date = new Date();
      date.setUTCFullYear(+item.year);
      date.setUTCMonth(+item.month - 1);
      date.setUTCDate(+item.day);
      date.setUTCHours(+item.hour, 0, 0, 0);

      mockStaticDataHour.set(
        getTimestamInSecond(date),
        {
          identity: date,
          label: format(date, 'HH:mm'),
          value: item.views,
        }
      );
    })

    return mockStaticDataHour;
  }

  private generateRandomHourChunk(d1: Date, d2: Date, count: number): Map<number, ItemData> {
    const map = new Map<number, ItemData>();
    var x = D3.scaleTime().domain([d1, d2]);
    let randValues: Date[] = x.ticks(D3.timeHour.every(random(1, Math.floor(24 / count))));

    randValues.slice(
      randValues.length - count - 1,
      randValues.length - 1,
    ).forEach((date: Date) => {
      map.set(
        getTimestamInSecond(date),
        {
          identity: date,
          value: random(0, 999),
          label: format(date, 'HH:mm'),
        }
      )
    });

    return map;
  }
}
