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

  constructor() {

    const getTimestamInSecond = (date: Date) => {
      return date.getTime() / 1000;
    };

    this.listData_DayDelimiter$ = of([
      ...(<DayDelimiterData[]>daysMock).map<ItemData>((item: DayDelimiterData) => {
        const date = new Date(+item.year, +item.month, +item.day)
        return {
          identity: getTimestamInSecond(date),
          label: format(date, 'ddd'),
          value: item.views,
          data: {
            date: date
          },
        };
      }),
    ]);

    // Hours
    this.startDateHour = startOfToday();
    this.endDateHour = endOfToday();
    this.barWidthHour = 20;

    this.listData_HourDelimiter$ = of([
      ...(<HourDelimiterData[]>hoursMock).map<ItemData>((item: HourDelimiterData) => {
        const date = new Date(+item.year, +item.month, +item.day);
        date.setUTCHours(+item.hour);
        // date = addHours(date, -24)
        return {
          identity: getTimestamInSecond(date),
          label: format(date, 'ddd'),
          value: item.views,
          data: {
            date
          },
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
