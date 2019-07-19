import { Component, OnInit, AfterViewInit, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { ItemData } from '../../bar-chart/core/interfaces/item-data';
import { BarChartTimeScaleComponent } from '../../bar-chart/bar-chart-time-scale/bar-chart-time-scale.component';
import { DelimiterRangeData } from '../core/delimiter-data';
import { DirectionLeft, DirectionRight } from '../../bar-chart/core/types/direction-active-change';

@Component({
  selector: 'fn-day-delimiter-chart',
  templateUrl: './day-delimiter-chart.component.html',
  styleUrls: ['./day-delimiter-chart.component.scss']
})
export class DayDelimiterChartComponent implements OnInit, AfterViewInit {
  public barWidth: number;
  public countBarsInViewport: number;
  public heightCorrection: number;
  private availableChart: boolean;

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
    this.availableChart = false;
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

  public ngAfterViewInit(): void {
    if (!this.chart) {
      throw Error('Not found BarChartTimeScaleComponent in template!')
    }

    Promise.resolve().then(() => this.availableChart = true)
  }

  public canPrevActivate(): boolean {
    return this.availableChart && this.chart && this.chart.canChangeActiveOn(DirectionLeft);
  }

  public canNextActivate(): boolean {
    return this.availableChart && this.chart && this.chart.canChangeActiveOn(DirectionRight);
  }

  public onClickPrevActivate(): void {
    this.chart.goToPrevBar();
  }

  public onClickNextActivate(): void {
    this.chart.goToNextBar();
  }
}