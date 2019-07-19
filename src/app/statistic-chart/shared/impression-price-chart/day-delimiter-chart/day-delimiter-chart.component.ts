import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { ItemData } from '../../bar-chart/core/interfaces/item-data';
import { BarChartTimeScaleComponent } from '../../bar-chart/bar-chart-time-scale/bar-chart-time-scale.component';
import { DelimiterRangeData } from '../core/delimiter-data';

@Component({
  selector: 'fn-day-delimiter-chart',
  templateUrl: './day-delimiter-chart.component.html',
  styleUrls: ['./day-delimiter-chart.component.scss']
})
export class DayDelimiterChartComponent implements OnInit {
  public barWidth: number;
  public countBarsInViewport: number;
  public heightCorrection: number;

  @Input('data')
  public data$: Observable<DelimiterRangeData<ItemData>>;

  @ViewChild('chart', { static: false })
  protected chart: BarChartTimeScaleComponent;

  public get maxImpressionValue(): number {
    return 1;
  }

  private mappedData$: Observable<ItemData[]>;

  public constructor() {
    this.barWidth = 16;
    this.countBarsInViewport = 16;
    this.heightCorrection = -60;
  }

  public ngOnInit(): void {
    this.mappedData$ = this.data$
      .pipe(
        tap(console.warn),
        map((data: DelimiterRangeData) => {
          return data.list;
        }),
        filter(list => list.length),
        tap(console.warn),
      );

    // create fillEmptyDays method instead of Observable property
  }

  public onClickPrevActivate(): void {
    
  }

  public onClickNextActivate(): void {
    
  }

  public get canPrevActivate(): boolean {
    return false;
  }

  public get canNextActivate(): boolean {
    return false;
  }
}