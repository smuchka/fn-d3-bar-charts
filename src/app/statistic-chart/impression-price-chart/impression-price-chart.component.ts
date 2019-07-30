import {
  Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Type,
  Input, OnInit, AfterViewInit, OnChanges, OnDestroy, SimpleChanges
} from '@angular/core';
import { Observable, Subscription, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { map, filter, tap, delay } from 'rxjs/operators';
import { StatisticDelimiter, ChartSizeConfig } from '../core';
import { getEmptyChartDateRangeError, getEmptyChartDelimiterError, getEmptyDataError } from './impression-price-chart-errors';
import { ItemData, DirectionActiveChange, DirectionLeft, DirectionRight } from '../shared/bar-chart/core';
import { BarChartAbstract } from '../shared/bar-chart/bar-chart-abstract/bar-chart-abstract.component';
import { BarChartComponent } from '../shared/bar-chart/bar-chart.component';
import { ChartActiveDateNavComponent } from '../chart-active-date-nav/chart-active-date-nav.component';
import { DelimiterChartStrategyService } from '../shared/services/delimiter-chart-strategy.service';
import { DelimiterChartConfigService } from '../shared/services/delimiter-chart-config.service';
import { DateChart } from '../shared/bar-chart/core';
import { differenceInSeconds } from 'date-fns';
import * as D3 from 'd3';

@Component({
  selector: 'fn-impression-price-chart',
  templateUrl: './impression-price-chart.component.html',
  styleUrls: ['./impression-price-chart.component.scss'],
})
export class ImpressionPriceChartComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  public data: Observable<ItemData[]>;

  @Input()
  public dateRange: [Date, Date];

  @Input()
  public delimiter: StatisticDelimiter;

  @Input()
  public navigation: ChartActiveDateNavComponent;

  @ViewChild('chart', { static: true })
  protected chart: BarChartAbstract;

  private dateStrategy: DateChart;
  private barWidth: number;
  private barCountInViewport: number;
  private renderData$: Observable<ItemData[]>;
  private lastActive: ItemData;
  private inputDataSubsciption: Subscription;
  private chartActiveChangeSubscription: Subscription;
  private navActiveDateDirectionChangeSubscription: Subscription;

  public constructor(
    private r: ComponentFactoryResolver,
    private dateDelimiter: DelimiterChartStrategyService,
    private delimiterConfig: DelimiterChartConfigService,
  ) {
    this.lastActive = null;
  }

  public ngOnInit(): void {

    if (!this.delimiter) {
      throw getEmptyChartDelimiterError();
    }

    if (!this.dateRange) {
      throw getEmptyChartDateRangeError();
    }

    if (!this.data) {
      throw getEmptyDataError();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges', changes)

    if (changes.delimiter) {
      this.switchDateDelimiterConfig();
    }

    if (changes.navigation) {
      this.switchNavigationComponent();
    }

    if (this.dateRange && this.data) {

      const [from, to] = this.getDateRange();
      // console.table([
      //   [from, to]
      // ])
      // console.warn(
      //   'change',
      //   this.delimiter,
      //   this.data,
      //   this.dateRange,
      // )

      this.renderData$ = this.data.pipe(
        map((data: ItemData[]) => {
          const localMap: Map<number, ItemData> = new Map();
          data.forEach((el: ItemData) => localMap.set(el.identity.getTime(), el));
          return localMap;
        }),
        map((map: Map<number, ItemData>) => this.fillRangeOfEmptyData(map, from, to)),
        tap((data) => console.log('>>>', data)),
      );
    }
  }

  public ngOnDestroy(): void {

    if (this.inputDataSubsciption) {
      this.inputDataSubsciption.unsubscribe()
      this.inputDataSubsciption = null;
    }

    if (this.chartActiveChangeSubscription) {
      this.chartActiveChangeSubscription.unsubscribe()
      this.chartActiveChangeSubscription = null;
    }

    if (this.navActiveDateDirectionChangeSubscription) {
      this.navActiveDateDirectionChangeSubscription.unsubscribe()
      this.navActiveDateDirectionChangeSubscription = null;
    }
  }

  /**
   * Set to chart component new data
   */
  private switchDateDelimiterConfig(): void {
    /** Set to chart copmponent strategy */
    this.dateStrategy = this.dateDelimiter.resolveDateDelimiterStrategy(this.delimiter);

    const config: ChartSizeConfig = this.delimiterConfig
      .getChartConfig(this.delimiter);
    this.barWidth = config.barWidth;
    this.barCountInViewport = config.countViewport;
  }

  /**
   * Switch navigation component.
   * Unsubscribe from active navigation component subscriptions
   */
  private switchNavigationComponent(): void {

    /**
     * Subscribe on change active from chart component,
     * if not yet subscribed
     */
    if (!this.chartActiveChangeSubscription) {
      this.chartActiveChangeSubscription =
        this.chart.activeItemDataChange.asObservable()
          .subscribe(this.onActiveItemChangeFromChart.bind(this));
    }

    /**
     * Unsubscribe for old mounted navigation (if exists)
     */
    if (this.navActiveDateDirectionChangeSubscription) {
      this.navActiveDateDirectionChangeSubscription.unsubscribe();
      this.navActiveDateDirectionChangeSubscription = null;
    }

    /** Subscribe on request change active from navigation component */
    this.navActiveDateDirectionChangeSubscription =
      this.navigation.activeDateDirectionChange.asObservable()
        .subscribe(this.onActiveDateDirectionChange.bind(this));
  }

  /**
   * Handler for updating active item in navigation component
   */
  private onActiveItemChangeFromChart(data: ItemData): void {
    this.lastActive = data;
    this.navigation.setActive(this.lastActive.identity)
    this.navigation.canActivateNextDate = this.chart.canActivateNextBar;
    this.navigation.canActivatePrevDate = this.chart.canActivatePrevBar;
  }

  /**
   * Handler for updating active item in chart component
   */
  private onActiveDateDirectionChange(dir): void {
    const date: Date = this.dateStrategy
      .calcSomeDateOnDistance(this.lastActive.identity, dir)
    this.chart.setActiveDate(date);
  }

  private getDateRange(): [Date, Date] {
    const [from, to] = this.dateRange;

    if (to.getTime() < from.getTime()) {
      return [to, from];
    }

    return this.dateRange;
  }

  /**
   * Map pipe function for fill empty bar
   */
  private fillRangeOfEmptyData(data: Map<number, ItemData>, d1: Date, d2: Date): ItemData[] {
    const countBarItems: number = this.delimiterConfig
      .getChartConfig(this.delimiter).countChunk;
      console.warn(
        Array.from(data.values())
      );

    const createDataItem = (el, index): ItemData => {
      const nextDate: Date = this.dateStrategy.calcSomeDateOnDistance(d2, -1 * index);
      // console.log(nextDate.getTime())
      if (data.has(nextDate.getTime())) {
        return data.get(nextDate.getTime());
      }

      return <ItemData>{ identity: nextDate, value: 0 };
    };

    return Array.from(Array(countBarItems), createDataItem);
  }
}