import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { daysMock, hoursMock } from './mockData_hours';
import { HourDelimiterData, DayDelimiterData } from './core/delimiter-data';
import { ItemData } from '../bar-chart/core/interfaces/item-data';
import { format, startOfToday, endOfToday, differenceInHours, addHours } from 'date-fns'

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

  constructor() {

    const getTimestamInSecond = (date: Date) => {
      return date.getTime() / 1000;
    };

    this.listData_DayDelimiter$ = of([
      ...(<DayDelimiterData[]>daysMock).map<ItemData>((item: DayDelimiterData) => {
        const date = new Date(+item.year, +item.day, +item.month)
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

    this.listData_HourDelimiter$ = of([
      ...(<HourDelimiterData[]>hoursMock).map<ItemData>((item: HourDelimiterData) => {
        const date = new Date(+item.year, +item.day, +item.month)
        return {
          identity: getTimestamInSecond(date),
          label: format(date, 'ddd'),
          value: item.views,
          data: {
            date
          },
        };
      }),
    ]);
  }

  ngOnInit() {
  }

  public onClickAdd() {

  }
}
