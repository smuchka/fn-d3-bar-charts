import {
  Component, ElementRef, OnInit, Renderer2, Input
} from '@angular/core';
import { BarChartAbstract } from './bar-chart-abstract/bar-chart-abstract.component';
import { DateChartStrategy } from './core/date-delimiter-strategies';
import {
  getBarChartEmptyDateStrategyError,
  getEmptyCountBarInViewportError
} from './bar-chart-errors';
import { addDays, addHours, startOfToday } from 'date-fns'

const DEFAULT_COUNT_BARS_IN_VIEWPORT: number = 10;

@Component({
  selector: 'fn-bar-chart',
  template: `<!--d3 create template itself-->`,
  styles: [`
    :host {
      width: 100%;
      height: 100%;
      display: flex;
    }
  `]
})
export class BarChartComponent extends BarChartAbstract implements OnInit {

  @Input()
  public countBarsInViewport: number;

  @Input()
  public barWidth: number;

  @Input()
  public set dateRangeStrategy(strtategy: DateChartStrategy) {
    this.dateRangeStrategyValue = strtategy;
  }
  public get dateRangeStrategy(): DateChartStrategy {
    return this.dateRangeStrategyValue;
  }
  private dateRangeStrategyValue: DateChartStrategy;

  public constructor(
    protected element: ElementRef,
    protected renderer: Renderer2,
  ) {
    super(element, renderer);
    // this.countBarsInViewport = DEFAULT_COUNT_BARS_IN_VIEWPORT;
  }

  public ngOnInit(): void {
    if (!this.dateRangeStrategy) {
      throw getBarChartEmptyDateStrategyError();
    }

    if (!this.countBarsInViewport) {
      throw getEmptyCountBarInViewportError();
    }

    super.ngOnInit()
  }

  protected calcNowBarDate(): Date {
    return this.dateRangeStrategy.calcNowBarDate();
  }

  protected calcNextBarDate(from: Date): Date {
    return this.dateRangeStrategy.calcNextBarDate(from);
  }

  protected calcPrevBarDate(from: Date): Date {
    return this.dateRangeStrategy.calcPrevBarDate(from);
  }

  protected viewportDateRange(): [Date, Date] {
    const from: Date = this.data[0].identity;
    console.warn(':', this.countBarsInViewport)
    return [from, addDays(from, this.countBarsInViewport - 1)];

    // const from: Date = startOfToday();
    // return [from, addDays(from, this.countBarsInViewport - 1)];
  }
}