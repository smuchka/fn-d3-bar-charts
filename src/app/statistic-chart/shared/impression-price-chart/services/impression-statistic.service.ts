import { Injectable } from '@angular/core';
import { ItemData } from '../../bar-chart/core/interfaces/item-data';
import { HourDelimiterData, DayDelimiterData } from '../core/delimiter-data';
import {
  format,
  parse,
  // startOfToday, endOfToday,
  differenceInHours,
  addHours,
  subHours,
  // subDays, addDays,
  // endOfDay, startOfDay
} from 'date-fns'
// mocks
import { daysMock } from '../data/daysMock';
import { hoursMock } from '../data/hoursMock';
import { weeksMock } from '../data/weeksMock';
// for generate mock paggination
import * as D3 from 'd3';

@Injectable()
export class ImpressionStatisticService {

  private mockStaticDataHour: Map<number, ItemData> = new Map();
  private countRandom = 5;

  constructor() {
  }

  public loadStaticticByDates(d1: Date, d2: Date): ItemData[] {
    const now = this.currentDateFromStartHour();
    if (differenceInHours(d1, now) <= 0
      && differenceInHours(now, d2) <= 0) {

      const list = Array.from(this.mockStaticDataHour.values());
      console.log(
        this.extendDateRangeByEmptyData(list, d1, d2)
      )
      return Array.from(this.mockStaticDataHour.values());
    }

    const dynamicChunk = this.generateRandomHourChunk(d1, d2, this.countRandom);
        dynamicChunk.forEach((date: Date) => {
      map.set(
        getTimestamInSecond(date),
        {
          identity: date,
          value: random(0, 999),
          label: format(date, 'HH:mm'),
        }
      )
    });
    return this.extendDateRangeByEmptyData(dynamicChunk, d1, d2);
  }

  private loadMockStaticData(): void {
    hoursMock.forEach((item: HourDelimiterData) => {
      const date = new Date();
      date.setUTCFullYear(+item.year);
      date.setUTCMonth(+item.month - 1);
      date.setUTCDate(+item.day);
      date.setUTCHours(+item.hour, 0, 0, 0);

      this.mockStaticDataHour.set(
        getTimestamInSecond(date),
        {
          identity: date,
          label: format(date, 'HH:mm'),
          value: item.views,
        }
      );
    })
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

  private currentDateFromStartHour(): Date {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (+max - +min)) + +min;
}

function getTimestamInSecond(date: Date) {
  return date.getTime() / 1000;
};