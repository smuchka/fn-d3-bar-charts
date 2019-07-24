import {
  Component, ElementRef, OnInit, Renderer2, Input
} from '@angular/core';
import { BarChartAbstract } from './bar-chart-abstract/bar-chart-abstract.component';
import { DateChartStrategy } from '../strategy';
import { getBarChartEmptyDateStrategyError } from './bar-chart-errors';
import { addDays, addHours, startOfToday } from 'date-fns'

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
  public set elimiateRangeStrategy(strtategy: DateChartStrategy) {
    this.dateRangeStrategyValue = strtategy;
  }
  public get dateRangeStrategy(): DateChartStrategy {
    return this.dateRangeStrategyValue;
  }
  private dateRangeStrategyValue: DateChartStrategy;

  public ngOnInit(): void {
    if (!this.dateRangeStrategy) {
      throw getBarChartEmptyDateStrategyError();
    }

    super.ngOnInit()
  }

  protected calcNowBarDate(): Date {
    return this.dateRangeStrategy.calcNowBarDate();
  }

  protected calcNextBarDate(from: Date): Date {
    return this.dateRangeStrategy.calcNowBarDate();
  }

  protected calcPrevBarDate(from: Date): Date {
    return this.dateRangeStrategy.calcPrevBarDate();
  }

  protected viewportDateRange(): [Date, Date] {
    const from: Date = this.data[0].identity;
    return [from, addDays(from, this.countBarsInViewport - 1)];
  }
}