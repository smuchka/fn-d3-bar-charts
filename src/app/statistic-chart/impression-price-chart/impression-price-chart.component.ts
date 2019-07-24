import {
  Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Type,
  Input, OnInit, AfterViewInit, OnChanges, OnDestroy, SimpleChange
} from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { StatisticDelimiter } from '../core';
import { ItemData } from '../shared/bar-chart/core/interfaces/item-data';
import { BarChartAbstract } from '../shared/bar-chart/bar-chart-abstract/bar-chart-abstract.component';
import { BarChartComponent } from '../shared/bar-chart/bar-chart.component';
import { ChartActiveDateNavComponent } from '../chart-active-date-nav/chart-active-date-nav.component';
import {
  DateChartStrategy,
  HourChartNavigation,
  DayChartNavigation,
  WeekChartNavigation
} from '../shared/bar-chart/core/date-delimiter-strategies';
import { DelimiterChartStrategyService } from '../shared/services/delimiter-chart-strategy.service';
import { differenceInSeconds } from 'date-fns';
import * as D3 from 'd3';

@Component({
  selector: 'fn-impression-price-chart',
  templateUrl: './impression-price-chart.component.html',
  styleUrls: ['./impression-price-chart.component.scss'],
})
export class ImpressionPriceChartComponent implements OnInit, OnDestroy {

  @Input()
  public data: Observable<ItemData[]>;

  private dateStrategy: DateChartStrategy;
  private barWidth: number;
  private barCountInViewport: number;

  @Input()
  public set delimiter(delimiter: StatisticDelimiter) {
    this.delimiterValue = delimiter;
    this.resolveDelimiterConfig();
  }
  public get delimiter(): StatisticDelimiter {
    return this.delimiterValue;
  }
  private delimiterValue: StatisticDelimiter;

  @Input('navigation')
  public set navigation(navigation: ChartActiveDateNavComponent) {
    this.navigationValue = navigation;
    this.switchNavigationComponent();
  }
  public get navigation(): ChartActiveDateNavComponent {
    return this.navigationValue;
  }
  private navigationValue: ChartActiveDateNavComponent;

  @ViewChild('chart', { static: true })
  protected chart: BarChartAbstract;

  private inputDataSubsciption: Subscription;
  private chartActiveItemChangeSubscription: Subscription;
  private renderData$: BehaviorSubject<ItemData[]>;

  public constructor(
    private r: ComponentFactoryResolver,
    private dateDelimiter: DelimiterChartStrategyService,
  ) {
    this.renderData$ = new BehaviorSubject<ItemData[]>([]);
  }

  public ngOnInit(): void {
    if (!this.delimiter) {
      throw Error('Not specified statistic view delimiter')
    }

    if (!this.data) {
      throw Error('Not specified statistic data')
    }

    /** Subscribe on change active from chart component */
    this.chartActiveItemChangeSubscription = this.chart
      .activeItemDataChange.asObservable()
      .subscribe(this.onActiveItemChange.bind(this))

    // Subscribe on input data change
    this.inputDataSubsciption = this.data
      //
      // todo !!!!!!!!! - fill empty DelimiterChartStrategyService//
      .pipe(map((data: ItemData[]) => data))
      .subscribe((data: ItemData[]) => this.renderData$.next(data))

    // Since the first initialization of a chart component 
    // can occur before data initialization, we call refresh component data
    this.resolveDelimiterConfig();

    //
    // TODO: Navigation Toolbar
    //
    // console.log(this.navigation)
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
   * Switch navigation component.
   * ???? Clear all subscribe on old component, and subscribe on newest.
   */
  private switchNavigationComponent(): void {
    if (this.navigation) {
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
   * todo: make it in chart - emit event correct
   */
  public onChartEmitPetBorderEvent(e): void {
    console.log('Chart near of border!');
  }

  public onActiveItemChange(data: ItemData): void {
    console.log('Chart change active item: ', data);
  }
}