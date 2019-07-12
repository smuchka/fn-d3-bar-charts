import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { daysMock } from './mockData_hours';
import { HourDelimiterData } from './core/delimiter-data';
import { ItemData } from '../bar-chart/core/interfaces/item-data';

@Component({
  selector: 'fn-impression-price-chart',
  templateUrl: './impression-price-chart.component.html',
  styleUrls: ['./impression-price-chart.component.scss'],
})
export class ImpressionPriceChartComponent implements OnInit {
  private listData_DayDelimiter$: Observable<ItemData[]>;

  constructor() {
    this.listData_DayDelimiter$ = of([
      ...(<HourDelimiterData[]>daysMock).map<ItemData>((item: HourDelimiterData) => {
        return {
          label: `${ item.year }-${ item.month }-${ item.day }`,
          value: item.views,
          data: {},
        };
      }),
    ]);
  }

  ngOnInit() {
  }

}
