import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BarChartAbstract } from './bar-chart-abstract/bar-chart-abstract.component';
import { getBarChartEmptyDateStrategyError, getEmptyCountBarInViewportError } from './bar-chart-errors';
import {
  BarChartActiveSelectedEvent,
  DateChart,
  ItemData,
  UpdateChartEvent,
} from './core';
import { BaseChartInstance } from './bar-chart-tooltip/base-chart-tooltip';

@Component({
  selector: 'fn-bar-chart',
  template: `<!--d3 create template itself-->`,
  styles: [
    `
      :host {
          width: 100%;
          height: 100%;
          display: flex;
      }
    `,
  ],
})
export class BarChartComponent extends BarChartAbstract implements OnInit, OnChanges, AfterContentInit {

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
  public set dateRangeStrategy(strategy: DateChart) {
    this.dateRangeStrategyValue = strategy;
  }

  public get dateRangeStrategy(): DateChart {
    return this.dateRangeStrategyValue;
  }

  private dateRangeStrategyValue: DateChart;

  @ContentChild(BaseChartInstance, { static: false, })
  protected tooltip: BaseChartInstance;

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

    super.ngOnInit();
  }

  public ngAfterContentInit(): void {
    this.initTooltip();
    super.ngAfterContentInit();
  }

  public ngOnChanges(changes: SimpleChanges): void {

    // skip any changes until onInit unavailable
    if (changes.data && changes.data.firstChange) {
      return;
    }

    if (changes.data) {
      if (changes.dateRangeStrategy) {
        this.updateChart$.next({ full: true });
      } else {
        this.updateChart$.next({ full: false, isDataUpdate: true });
      }
    }
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

  protected domainDateRange(): [Date, Date] {
    const rangeEnd: Date = this.dateRangeStrategy.calcNowBarDate();
    const rangeStart: Date = this.dateRangeStrategy.calcSomeDateOnDistance(
      rangeEnd,
      -1 * (this.countBarsInViewport - 1),
    );
    return [rangeStart, rangeEnd];
  }

  /**
   * Calc and apply correction.
   */
  private initTooltip(): void {

    if (!this.tooltip) {
      return;
    }

    this.padding = {
      ...this.margin,
      ...{
        top: this.margin.top + this.tooltip.correctionHeight,
        left: this.margin.left + this.tooltip.correctionWidth
      },
    };
    this.heightCorrection = this.heightCorrection + this.tooltip.correctionHeight;
    this.widthCorrection = this.widthCorrection + this.tooltip.correctionWidth;

    this.tooltip.setChart(this);

    this.subs.add(
      this.activeItemDataChange.asObservable()
        .pipe(tap(event => this.tooltip.draw(event)))
        .subscribe()
    );
  }
}
