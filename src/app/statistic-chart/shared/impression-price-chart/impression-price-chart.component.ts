import { Component, Input, OnInit, AfterViewInit, OnChanges, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Type, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { StatisticDelimiter, HourDelimiterData, DayDelimiterData } from './core/delimiter-data';
import { ItemData } from '../bar-chart/core/interfaces/item-data';
import { BarChartAbstract } from '../bar-chart/bar-chart-abstract/bar-chart-abstract.component';
import { DayBarChartComponent } from '../bar-chart/day-bar-chart.component';
import { HourBarChartComponent } from '../bar-chart/hour-bar-chart.component';
import { WeekBarChartComponent } from '../bar-chart/week-bar-chart.component';
import * as D3 from 'd3';

@Component({
  selector: 'fn-impression-price-chart',
  templateUrl: './impression-price-chart.component.html',
  styleUrls: ['./impression-price-chart.component.scss'],
})
export class ImpressionPriceChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input()
  public data: Observable<ItemData[]>;

  @Input()
  public delimiter: StatisticDelimiter;

  @ViewChild('chartContainer', { read: ViewContainerRef, static: true })
  protected vc: ViewContainerRef;

  protected chartRef: ComponentRef<BarChartAbstract>;
  private mapDelimiterComponents: Map<StatisticDelimiter, Type<BarChartAbstract>>;
  private subsciptionComponentData: Subscription;

  public constructor(private r: ComponentFactoryResolver) {
    this.mapDelimiterComponents = new Map([]);
    this.mapDelimiterComponents.set(StatisticDelimiter.Hour, HourBarChartComponent)
    this.mapDelimiterComponents.set(StatisticDelimiter.Day, DayBarChartComponent)
    this.mapDelimiterComponents.set(StatisticDelimiter.Week, WeekBarChartComponent)
  }

  public ngOnInit(): void {

    if (!this.delimiter) {
      throw Error('Not inited statistic delimiter')
    }
  }

  public ngAfterViewInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.delimiter && changes.delimiter.currentValue) {
      this.switchChartComponent();
    }
  }
  public ngOnDestroy(): void {
    if (this.chartRef) {
      this.chartRef.destroy()
    }

    if (this.subsciptionComponentData) {
      this.subsciptionComponentData.unsubscribe()
      this.subsciptionComponentData = null;
    }
  }

  private switchChartComponent(): void {

    /**
     * Destroy easrly created component
     */
    if (this.chartRef) {
      this.chartRef.destroy()
      this.subsciptionComponentData.unsubscribe()
      this.subsciptionComponentData = null;
    }

    const typeComponent: Type<BarChartAbstract> = this.mapDelimiterComponents.get(this.delimiter);
    this.chartRef = this.createDymanicChart(typeComponent);

    if (this.data) {
      this.subsciptionComponentData = this.data.subscribe((data: ItemData[]) => {
        this.chartRef.instance.data = data;
      })
    }
  }

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