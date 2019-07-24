import { Component, Input, OnInit, AfterViewInit, OnChanges, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Type, SimpleChanges } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { StatisticDelimiter, HourDelimiterData, DayDelimiterData } from './core/delimiter-data';
import { ItemData } from '../bar-chart/core/interfaces/item-data';
import { BarChartAbstract } from '../bar-chart/bar-chart-abstract/bar-chart-abstract.component';
import { DayBarChartComponent } from '../bar-chart/day-bar-chart.component';
import { HourBarChartComponent } from '../bar-chart/hour-bar-chart.component';
import { WeekBarChartComponent } from '../bar-chart/week-bar-chart.component';
import { ChartActiveDateNavComponent } from '../chart-active-date-nav/chart-active-date-nav.component';
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

  private renderData: BehaviorSubject<ItemData[]>;

  @Input()
  public set delimiter(delimiter: StatisticDelimiter) {
    this.delimiterValue = delimiter;
    this.switchChartComponent();
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

  @ViewChild('chartContainer', { read: ViewContainerRef, static: true })
  protected vc: ViewContainerRef;
  protected chartRef: ComponentRef<BarChartAbstract>;
  private mapDelimiterComponents: Map<StatisticDelimiter, Type<BarChartAbstract>>;
  private componentDataSubsciption: Subscription;
  private activeItemChangeSubscription: Subscription;

  public constructor(
    private r: ComponentFactoryResolver
  ) {
    this.mapDelimiterComponents = new Map([]);
    this.mapDelimiterComponents.set(StatisticDelimiter.Hour, HourBarChartComponent)
    this.mapDelimiterComponents.set(StatisticDelimiter.Day, DayBarChartComponent)
    this.mapDelimiterComponents.set(StatisticDelimiter.Week, WeekBarChartComponent)

    this.renderData = new BehaviorSubject<ItemData[]>([]);
  }

  public ngOnInit(): void {
    if (!this.delimiter) {
      throw Error('Not specified statistic view delimiter')
    }

    if (!this.data) {
      throw Error('Not specified statistic data')
    }

    // Subscribe on input data change
    this.componentDataSubsciption = this.data
      .subscribe((data: ItemData[]) => this.renderData.next(data))

    // Since the first initialization of a chart component 
    // can occur before data initialization, we call refresh component data
    this.refreshDataComponent();

    //
    // TODO !!!!!!!!!!
    //
    console.log(this.navigation)
  }

  public ngOnDestroy(): void {
    if (this.chartRef) {
      this.chartRef.destroy()
    }

    if (this.componentDataSubsciption) {
      this.componentDataSubsciption.unsubscribe()
      this.componentDataSubsciption = null;
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
  private switchChartComponent(): void {

    /** Destroy eaarly created components */
    if (this.chartRef) {
      // unsubscribe from component change active item events
      if (this.activeItemChangeSubscription) {
        this.activeItemChangeSubscription.unsubscribe()
      }
      this.chartRef.destroy()
    }

    /** Detect component type & create it */
    const typeComponent: Type<BarChartAbstract> = this.mapDelimiterComponents.get(this.delimiter);
    this.chartRef = this.createDymanicChart(typeComponent);

    /** Subscribe on change active from new chart component */
    this.activeItemChangeSubscription = this.chartRef.instance
      .activeItemDataChange.asObservable()
      .subscribe(this.onActiveItemChange.bind(this))

    this.refreshDataComponent();
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
  private refreshDataComponent(): void {
    if (this.chartRef) {
      this.chartRef.instance.data = this.renderData.value;
    }
  }

  /**
   * Create dynamic component
   */
  private createDymanicChart(component: Type<BarChartAbstract>): ComponentRef<BarChartAbstract> {
    const factory = this.r.resolveComponentFactory(component);
    return this.vc.createComponent(factory);
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