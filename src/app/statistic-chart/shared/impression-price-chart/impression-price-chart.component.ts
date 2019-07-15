import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators'
import { daysMock, hoursMock } from './mockData_hours';
import { HourDelimiterData, DayDelimiterData } from './core/delimiter-data';
import { ItemData } from '../bar-chart/core/interfaces/item-data';
import { format, parse, startOfToday, endOfToday, differenceInHours, addHours } from 'date-fns'

@Component({
  selector: 'fn-impression-price-chart',
  templateUrl: './impression-price-chart.component.html',
  styleUrls: ['./impression-price-chart.component.scss'],
})
export class ImpressionPriceChartComponent implements OnInit {
  private listData_DayDelimiter$: Observable<ItemData[]>;


  public listData_HourDelimiter$: Observable<ItemData[]>;
  public startDateHour: Date;
  public endDateHour: Date;
  public barWidthHour: number;
  public countViewBarsHours: number;


  constructor() {

    const getTimestamInSecond = (date: Date) => {
      return date.getTime() / 1000;
    };

    this.listData_DayDelimiter$ = of([
      ...(<DayDelimiterData[]>daysMock).map<ItemData>((item: DayDelimiterData) => {
        const date = new Date(+item.year, +item.month - 1, +item.day)
        return {
          identity: date,
          label: format(date, 'ddd'),
          value: item.views,
        };
      }),
    ]);

    // Hours
    this.startDateHour = startOfToday();
    this.endDateHour = endOfToday();
    this.barWidthHour = 20;
    this.countViewBarsHours = 14;

    this.listData_HourDelimiter$ = of([
      ...(<HourDelimiterData[]>hoursMock).map<ItemData>((item: HourDelimiterData) => {
        const date = new Date();
        date.setUTCFullYear(+item.year);
        date.setUTCMonth(+item.month-1);
        date.setUTCDate(+item.day);
        date.setUTCHours(+item.hour, 0, 0, 0);
        return {
          identity: date,
          label: format(date, 'HH:mm'),
          value: item.views,
        };
      }),
    ])
      .pipe(
        tap(data => console.log(data))
      );
  }

  ngOnInit() {
  }

  public onClickAdd() {

  }
}
