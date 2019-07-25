import {
  Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Type,
  Input, OnInit, AfterViewInit, OnChanges, OnDestroy, SimpleChanges
} from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { StatisticDelimiter } from '../core';
import { ItemData, DelimiterStrategy } from '../shared/bar-chart/core';
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
  private activeItemData$: BehaviorSubject<ItemData | null>;
  private inputDataSubsciption: Subscription;
  private chartActiveItemChangeSubscription: Subscription;

  public constructor(
    private r: ComponentFactoryResolver,
    private dateDelimiter: DelimiterChartStrategyService,
  ) {
    this.renderData$ = new BehaviorSubject<ItemData[]>([]);
    this.activeItemData$ = new BehaviorSubject<ItemData | null>(null);
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

    /** Subscribe on change active from chart component */
    this.chartActiveItemChangeSubscription = this.chart
      .activeItemDataChange.asObservable()
      .subscribe(this.onActiveItemChange.bind(this));
  }

  public ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    if (changes.delimiter) {
      this.resolveDelimiterConfig();
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

    if (this.chartActiveItemChangeSubscription) {
      this.chartActiveItemChangeSubscription.unsubscribe()
      this.chartActiveItemChangeSubscription = null;
    }
  }

  /**
   * Set to chart component new data
   */
  private resolveDelimiterConfig(): void {
    /** Set to chart copmponent strategy */
    const strategy = this.dateDelimiter.resolveDateDelimiterStrategy(this.delimiter);
    this.dateStrategy = strategy;

    this.barWidth = this.dateDelimiter.getBarWidth(this.delimiter);
    this.barCountInViewport = this.dateDelimiter.getCountBars(this.delimiter);
  }

  /**
   * Switch navigation component.
   * Unsubscribe from active date change for navigation & navigation subscriptions
   */
  private switchNavigationComponent(): void {

    // unsubscribe for old mounted navigation
    if (this.chartActiveItemChangeSubscription) {
      this.chartActiveItemChangeSubscription.unsubscribe();
      this.chartActiveItemChangeSubscription = null;
    }

    // subscribe on local active date change => and update in toolbar
    // this.chart.activeItemDataChange.asObservable()
    this.chartActiveItemChangeSubscription = this.activeItemData$.asObservable()
      .pipe(filter(Boolean), tap(d => console.log(d)))
      .subscribe((activeDate: ItemData) => this.navigation.setActive(activeDate.identity))

    // subscribe on action chnageActiveDate => and update in chart internal
    // todo!
  }

  /**
   * todo:
   */
  public onChartEmitPetBorderEvent(e): void {
    console.log('Chart near of border!');
  }

  public onActiveItemChange(data: ItemData): void {
    console.log('Chart change active item: ', data);
    this.activeItemData$.next(data);
  }
}