import {
  Component, ViewChild, ComponentFactoryResolver,
  Input, OnInit, OnChanges, OnDestroy, SimpleChanges, Output, EventEmitter
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChartSizeConfig, DateRange, StatisticDelimiter } from '../core';
import { ItemData, PaginationEvent } from '../shared/bar-chart/core';
import { BarChartAbstract } from '../shared/bar-chart/bar-chart-abstract/bar-chart-abstract.component';
import { ChartActiveDateNavComponent } from '../chart-active-date-nav/chart-active-date-nav.component';
import { DelimiterChartStrategyService } from '../shared/services/delimiter-chart-strategy.service';
import { DelimiterChartConfigService } from '../../services/delimiter-chart-config.service';
import { DateChart } from '../shared/bar-chart/core';
import {
  getEmptyChartDelimiterError,
  getEmptyChartDateRangeError,
  getEmptyDataError
} from './impression-price-chart-errors';

@Component({
  selector: 'fn-impression-price-chart',
  templateUrl: './impression-price-chart.component.html',
  styleUrls: ['./impression-price-chart.component.scss'],
})
export class ImpressionPriceChartComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  public data: Observable<ItemData[]>;

  @Input()
  public paginationOffset: number;

  @Input()
  public chunkDateRange: DateRange;

  @Input()
  public delimiter: StatisticDelimiter;

  @Input()
  public navigation: ChartActiveDateNavComponent;

  @Output()
  public paginationEvent: EventEmitter<Date>;

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
    this.paginationEvent = new EventEmitter<Date>();
  }

  public ngOnInit(): void {

    if (!this.delimiter) {
      throw getEmptyChartDelimiterError();
    }

    if (!this.chunkDateRange) {
      throw getEmptyChartDateRangeError();
    }

    if (!this.data) {
      throw getEmptyDataError();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.delimiter) {
      this.switchDateDelimiterConfig();
    }

    if (changes.navigation) {
      this.switchNavigationComponent();
    }

    if (this.chunkDateRange && this.data) {
      let rangeLoadedChunks = this.getDateRange();
      this.renderData$ = this.data.pipe(
        map((data: ItemData[]) => {
          const localMap: Map<number, ItemData> = new Map();
          data.forEach((el: ItemData) => localMap.set(el.identity.getTime(), el));
          return localMap;
        }),
        map((map: Map<number, ItemData>) => {
          return this.fillRangeOfEmptyData(map, rangeLoadedChunks, this.paginationOffset);
        }),
      );
    }
  }

  public ngOnDestroy(): void {

    if (this.inputDataSubsciption) {
      this.inputDataSubsciption.unsubscribe();
      this.inputDataSubsciption = null;
    }

    if (this.chartActiveChangeSubscription) {
      this.chartActiveChangeSubscription.unsubscribe();
      this.chartActiveChangeSubscription = null;
    }

    if (this.navActiveDateDirectionChangeSubscription) {
      this.navActiveDateDirectionChangeSubscription.unsubscribe();
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
    this.navigation.setActive(this.lastActive.identity);
    this.navigation.canActivateNextDate = this.chart.canActivateNextBar;
    this.navigation.canActivatePrevDate = this.chart.canActivatePrevBar;
  }

  /**
   * Handler for updating active item in chart component
   */
  private onActiveDateDirectionChange(dir): void {
    const date: Date = this.dateStrategy
      .calcSomeDateOnDistance(this.lastActive.identity, dir);
    this.chart.setActiveDate(date);
  }

  private getDateRange(): DateRange {
    const { from, to } = this.chunkDateRange;

    if (to.getTime() < from.getTime()) {
      return { to, from };
    }

    return this.chunkDateRange;
  }

  /**
   * Map pipe function for fill empty bar
   */
  private fillRangeOfEmptyData(data: Map<number, ItemData>, range: DateRange, offsetIndex: number = 1): ItemData[] {
    const countBarItems: number = this.delimiterConfig
      .getChartConfig(this.delimiter).countChunk * offsetIndex;
    const createDataItem = (el, index): ItemData => {
      const nextDate: Date = this.dateStrategy.calcSomeDateOnDistance(range.to, -1 * index);

      if (data.has(nextDate.getTime())) {
        return data.get(nextDate.getTime());
      }

      return <ItemData>{ identity: nextDate, value: 0 };
    };

    return Array.from(Array(countBarItems), createDataItem).reverse();
  }
}
