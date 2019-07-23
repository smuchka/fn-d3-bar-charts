import { Component, Input, OnInit, AfterViewInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { StatisticDelimiter, HourDelimiterData, DayDelimiterData } from './core/delimiter-data';
import { ItemData } from '../bar-chart/core/interfaces/item-data';
import { BarChartAbstract } from '../bar-chart/bar-chart-abstract/bar-chart-abstract.component';
import { DailyBarChartComponent } from '../bar-chart/daily-bar-chart/daily-bar-chart.component';
import { HourBarChartComponent } from '../bar-chart/hour-bar-chart/hour-bar-chart.component';
import * as D3 from 'd3';

@Component({
  selector: 'fn-impression-price-chart',
  templateUrl: './impression-price-chart.component.html',
  styleUrls: ['./impression-price-chart.component.scss'],
  providers: [
    // { provide: ImpressionStatistic, useClass: StatisticHourDelimiterService }
    // { provide: ImpressionStatistic, useClass: StatisticDayDelimiterService }
  ]
})
export class ImpressionPriceChartComponent implements OnInit, AfterViewInit {

  @Input()
  public data: Observable<ItemData[]>;

  @Input()
  public delimiter: StatisticDelimiter;

  @ViewChild('chartContainer', { read: ViewContainerRef, static: true })
  protected vc: ViewContainerRef;

  protected chartRef: ComponentRef<BarChartAbstract>;
  private mapDelimiterComponents: Map<StatisticDelimiter, Type<BarChartAbstract>>;

  constructor(private r: ComponentFactoryResolver) {
    this.mapDelimiterComponents = new Map([
      // [StatisticDelimiter.Hour, HourBarChartComponent],
      // [StatisticDelimiter.Day, DailyBarChartComponent],
      // [StatisticDelimiter.Week, WeekBarChartComponent],
    ])
  }

  ngOnInit() {
    this.chartRef = this.createDymanicChart(DailyBarChartComponent);

    if (this.data) {
      this.data.subscribe((data: ItemData[]) => {
        this.chartRef.instance.data = data;
      })
    }
  }

  ngAfterViewInit() {
  }

  private resolveChartComponent(): void {

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

  private createDymanicChart(component: Type<BarChartAbstract>): ComponentRef<BarChartAbstract> {
    const factory = this.r.resolveComponentFactory(component);
    return this.vc.createComponent(factory);
  }
}