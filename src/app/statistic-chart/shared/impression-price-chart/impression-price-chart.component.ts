import { Component, OnInit } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators'
import { daysMock, hoursMock } from './mockData_hours';
import { HourDelimiterData, DayDelimiterData } from './core/delimiter-data';
import { ItemData } from '../bar-chart/core/interfaces/item-data';
import {
  format, parse,
  startOfToday, endOfToday,
  differenceInHours,
  addHours, subHours,
  subDays, addDays,
  endOfDay, startOfDay
} from 'date-fns'
import * as D3 from 'd3';

@Component({
  selector: 'fn-impression-price-chart',
  templateUrl: './impression-price-chart.component.html',
  styleUrls: ['./impression-price-chart.component.scss'],
})
export class ImpressionPriceChartComponent implements OnInit {
  public startDateHour: Date;
  public endDateHour: Date;
  public barWidthHour: number;
  public countViewBarsHours: number;
  public maxValueForHour: number;
  private pagginableDataForHourChart$: BehaviorSubject<ItemData[]>;
  private mockStaticDataHour: Map<number, ItemData>;


  constructor() {

    // Hours
    this.startDateHour = startOfToday();
    this.endDateHour = endOfToday();
    this.barWidthHour = 20;
    this.countViewBarsHours = 14;
    this.maxValueForHour = 500;

    this.mockStaticDataHour = new Map(); 
    (<HourDelimiterData[]>hoursMock).forEach((item: HourDelimiterData) => {
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
    });

    this.pagginableDataForHourChart$ = new BehaviorSubject<ItemData[]>([]);
  }

  ngOnInit() {
    // send first chunk - today
    this.pagginableDataForHourChart$.next(
      this.extendDateRangeByEmptyData(this.mockStaticDataHour, startOfToday(), endOfToday())
    );
  }

  public onClickHour_AddBeforeChunk(count = 5): void {

    const date: Date = this.pagginableDataForHourChart$.value[0].identity;
    const dynamicChunk = this.generateRandomHourChunk(
      subHours(date, 24),
      subHours(date, 1),
      count
    );

    this.pagginableDataForHourChart$.next([
      ...this.extendDateRangeByEmptyData(dynamicChunk, subHours(date, 24), subHours(date, 1)),
      ...this.pagginableDataForHourChart$.value,
    ])
  }
  public onClickHour_AddAfterChunk(count = 5): void {

    const date: Date = this.pagginableDataForHourChart$.value[this.pagginableDataForHourChart$.value.length - 1].identity;
    const dynamicChunk = this.generateRandomHourChunk(
      addHours(date, 1),
      addHours(date, 24),
      count
    );

    this.pagginableDataForHourChart$.next([
      ...this.pagginableDataForHourChart$.value,
      ...this.extendDateRangeByEmptyData(dynamicChunk, addHours(date, 1), addHours(date, 24)),
    ]);
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
          label: date.toDateString(),
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
}

function random(min, max) {
  return Math.floor(Math.random() * (+max - +min)) + +min;
}

function getTimestamInSecond(date: Date) {
  return date.getTime() / 1000;
};