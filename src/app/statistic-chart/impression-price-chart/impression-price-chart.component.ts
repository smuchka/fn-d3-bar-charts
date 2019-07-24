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
import { differenceInSeconds } from 'date-fns';
import * as D3 from 'd3';

@Component({
  selector: 'fn-impression-price-chart',
  templateUrl: './impression-price-chart.component.html',
  styleUrls: ['./impression-price-chart.component.scss'],
})
export class ImpressionPriceChartComponent implements OnInit, OnDestroy {

  // day
  // barWidth = 24;
  // countBarsInViewport = 14;

  // hour
  // barWidth = 16;
  // countBarsInViewport = 16;

  // week
  // barWidth = 40;
  // countBarsInViewport = 11;

  @Input()
  public data: Observable<ItemData[]>;

  @Input()
  private dateStrategyValue: DateChartStrategy;

  @Input()
  public set delimiter(delimiter: StatisticDelimiter) {
    this.delimiterValue = delimiter;
    this.switchChartDelimiter();
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
  private activeItemChangeSubscription: Subscription;
  private renderData$: BehaviorSubject<ItemData[]>;

  public constructor(
    private r: ComponentFactoryResolver
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
    this.activeItemChangeSubscription = this.chart
      .activeItemDataChange.asObservable()
      .subscribe(this.onActiveItemChange.bind(this))

    // Subscribe on input data change
    this.inputDataSubsciption = this.data
      .subscribe((data: ItemData[]) => this.renderData$.next(data))

    // Since the first initialization of a chart component 
    // can occur before data initialization, we call refresh component data
    // this.refreshDataComponent();

    //
    // TODO: Navigation Toolbar
    //
    console.log(this.navigation)
  }

  public ngOnDestroy(): void {

    if (this.inputDataSubsciption) {
      this.inputDataSubsciption.unsubscribe()
      this.inputDataSubsciption = null;
    }

    if (this.activeItemChangeSubscription) {
      this.activeItemChangeSubscription.unsubscribe()
      this.activeItemChangeSubscription = null;
    }
  }

  /**
   * Switch chart component.
   * Clear all subscribe on old component, and subscribe on newest.
   */
  private switchChartDelimiter(): void {

    /** Set to chart copmponent strategy */
    // const strategy = this.resolveDateDelimiterStrategy(this.delimiter);

    // this.chart.dateDelimiter = strategy;
    // this.chart.barWidth = strategy;
    // this.chart.countBarsInViewport = strategy;

    // this.refreshDataComponent();
  }

  /**
   * Switch navigation component
   */
  private switchNavigationComponent(): void {
    if (this.navigation) {
    }
  }

  /**
   * Set to chart component new data
   */
  // private refreshDataComponent(): void {
  //   if (this.chart) {
  //     this.chart.data = this.renderData$.value;
  //   }
  // }

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