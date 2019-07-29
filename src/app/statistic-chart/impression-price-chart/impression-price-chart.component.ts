import {
  Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Type,
  Input, OnInit, AfterViewInit, OnChanges, OnDestroy, SimpleChanges
} from '@angular/core';
import { Observable, Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { StatisticDelimiter } from '../core';
import { ItemData, DelimiterStrategy, DirectionActiveChange, DirectionLeft, DirectionRight } from '../shared/bar-chart/core';
import { BarChartAbstract } from '../shared/bar-chart/bar-chart-abstract/bar-chart-abstract.component';
import { BarChartComponent } from '../shared/bar-chart/bar-chart.component';
import { ChartActiveDateNavComponent } from '../chart-active-date-nav/chart-active-date-nav.component';
import { DelimiterChartStrategyService } from '../shared/services/delimiter-chart-strategy.service';
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
  public delimiter: StatisticDelimiter;

  @Input()
  public navigation: ChartActiveDateNavComponent;

  @ViewChild('chart', { static: true })
  protected chart: BarChartAbstract;

  private dateStrategy: DelimiterStrategy.DateChart;
  private barWidth: number;
  private barCountInViewport: number;
  private renderData$: BehaviorSubject<ItemData[]>;
  private lastActive: ItemData;
  private inputDataSubsciption: Subscription;
  private chartActiveChangeSubscription: Subscription;
  private navActiveDateDirectionChangeSubscription: Subscription;

  public constructor(
    private r: ComponentFactoryResolver,
    private dateDelimiter: DelimiterChartStrategyService,
  ) {
    this.renderData$ = new BehaviorSubject<ItemData[]>([]);
    this.lastActive = null;
  }

  public ngOnInit(): void {

    if (!this.delimiter) {
      throw Error('Not specified statistic view delimiter')
    }

    if (!this.data) {
      throw Error('Not specified statistic data')
    }

    // Subscribe on input data change
    this.inputDataSubsciption = this.data
      // todo !!!!!!!!! - fill empty DelimiterChartStrategyService//
      .pipe(map((data: ItemData[]) => data))
      .subscribe((data: ItemData[]) => this.renderData$.next(data));
  }

  public ngOnChanges(changes: SimpleChanges): void {

    if (changes.delimiter) {
      this.switchDateDelimiterConfig();
    }

    if (changes.navigation) {
      this.switchNavigationComponent();
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

    this.barWidth = this.dateDelimiter.getBarWidth(this.delimiter);
    this.barCountInViewport = this.dateDelimiter.getCountBars(this.delimiter);
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
}