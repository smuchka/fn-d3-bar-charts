import {
  Component, ElementRef, OnInit, Renderer2, Input, EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs';
import { BarChartAbstract } from './bar-chart-abstract/bar-chart-abstract.component';
import { DateChartStrategy } from './core/date-delimiter-strategies';
import {
  getBarChartEmptyDateStrategyError,
  getEmptyCountBarInViewportError
} from './bar-chart-errors';
import { addDays, subDays, addHours, startOfToday } from 'date-fns'

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
  public get countBarsInViewport(): number {
    return this.countBarsInViewportValue;
  }
  public set countBarsInViewport(count: number) {
    this.countBarsInViewportValue = count;
    this.countBarsInViewportChange.emit();
  }
  private countBarsInViewportValue: number;
  private countBarsInViewportChange: EventEmitter<undefined>;

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
    this.countBarsInViewportChange = new EventEmitter();
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

  protected getObserveSource(): Observable<any>[] {
    return [
      ...super.getObserveSource(),
      this.countBarsInViewportChange,
    ];
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

  /**
   * How much dates need show on x axis - [from;to]
   */
  protected viewportDateRange(): [Date, Date] {
    const to: Date = subDays(this.data[this.data.length - 1].identity, 100);
    const from: Date = subDays(to, this.countBarsInViewport - 1);


    console.error(':', this.countBarsInViewport)
    return [from, to];
  }
}