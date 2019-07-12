import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { daysMock } from './mockData_hours';
import { HourDelimiterData } from './core/delimiter-data';
import { ItemData } from '../bar-chart/core/interfaces/item-data';
import { format } from 'date-fns'

@Component({
  selector: 'fn-impression-price-chart',
  templateUrl: './impression-price-chart.component.html',
  styleUrls: ['./impression-price-chart.component.scss'],
})
export class ImpressionPriceChartComponent implements OnInit {
  private listData_DayDelimiter$: Observable<ItemData[]>;

  constructor() {

    const getTimestamInSecond = (date: Date) => {
      console.log(date, date.getTime() / 1000)
      return date.getTime() / 1000;
    };

    this.listData_DayDelimiter$ = of([
      ...(<HourDelimiterData[]>daysMock).map<ItemData>((item: HourDelimiterData) => {
        const date = new Date(+item.year, +item.day, +item.month)
        return {
          identity: getTimestamInSecond(date),
          label: format(date, 'ddd'),
          value: item.views,
          data: {},
        };
      }),
    ]);
  }

  ngOnInit() {
  }

}
