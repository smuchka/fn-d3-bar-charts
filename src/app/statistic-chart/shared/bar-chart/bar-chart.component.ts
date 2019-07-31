import {
  Component, ElementRef, OnInit, Renderer2, Input, EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs';
import { BarChartAbstract } from './bar-chart-abstract/bar-chart-abstract.component';
import {
  getBarChartEmptyDateStrategyError,
  getEmptyCountBarInViewportError
} from './bar-chart-errors';
import { DateChart, ItemData } from './core';

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
  public set dateRangeStrategy(strtategy: DateChart) {
    this.dateRangeStrategyValue = strtategy;
  }
  public get dateRangeStrategy(): DateChart {
    return this.dateRangeStrategyValue;
  }
  private dateRangeStrategyValue: DateChart;

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

  protected formatLabel(data: ItemData): string {
    return this.dateRangeStrategy.formatLabel(data.identity);
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
    const startingDatePoint: Date = this.data[this.data.length - 1].identity;
    const from: Date = this.dateRangeStrategy.calcSomeDateOnDistance(
      startingDatePoint,
      -1 * (this.countBarsInViewport)
    );
    return [from, startingDatePoint];
  }
}
