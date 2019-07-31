import {
  Component, ViewChild, ComponentFactoryResolver,
  Input, OnInit, OnChanges, OnDestroy, SimpleChanges
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ChartSizeConfig, StatisticDelimiter } from '../core';
import { ItemData } from '../shared/bar-chart/core';
import { BarChartAbstract } from '../shared/bar-chart/bar-chart-abstract/bar-chart-abstract.component';
import { ChartActiveDateNavComponent } from '../chart-active-date-nav/chart-active-date-nav.component';
import { DelimiterChartStrategyService } from '../shared/services/delimiter-chart-strategy.service';
import { DelimiterChartConfigService } from '../shared/services/delimiter-chart-config.service';
import { DateChart } from '../shared/bar-chart/core';

@Component({
  selector: 'fn-impression-price-chart',
  templateUrl: './impression-price-chart.component.html',
  styleUrls: ['./impression-price-chart.component.scss'],
})
export class ImpressionPriceChartComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  public data: Observable<ItemData[]>;

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
      throw Error('Not specified statistic view delimiter')
    }

    if (!this.data) {
      throw Error('Not specified statistic data')
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {

    if (changes.delimiter) {
      this.switchDateDelimiterConfig();
    }

    if (changes.navigation) {
      this.switchNavigationComponent();
    }

    if (changes.data) {
      // Subscribe on input data change
      this.renderData$ = this.data.pipe(
        map((data: ItemData[]) => data),
        tap((data) => console.log('>>>', data)),
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

    const config: ChartSizeConfig = this.delimiterConfig.getChartConfig(this.delimiter);
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

  /**
   * Map pipe function for fill empty bar
   */
  private generateRangeOfEmptyData(data: ItemData[], d1: Date, d2: Date): ItemData[] {
    const countBarItems: number = this.delimiterConfig.getChartConfig(this.delimiter).countChunk;

    const createDataItem = (el, index): ItemData => {
      const date: Date = this.dateStrategy.calcSomeDateOnDistance(d1, index);
      return <ItemData>{ identity: date, value: 0 };
    };


    return Array.from(Array(countBarItems), createDataItem);
  }
}
