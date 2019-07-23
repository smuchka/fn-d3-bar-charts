import { Component, Input, OnInit, AfterViewInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { HourDelimiterData, DayDelimiterData } from './core/delimiter-data';
import { ItemData } from '../bar-chart/core/interfaces/item-data';
import { BarChartTimeScaleComponent } from '../bar-chart/bar-chart-time-scale/bar-chart-time-scale.component';
import { DailyBarChartComponent } from '../bar-chart/daily-bar-chart/daily-bar-chart.component'; '../bar-chart/bar-chart-time-scale/bar-chart-time-scale.component';
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

  @ViewChild('chartContainer', { read: ViewContainerRef, static: true })
  protected vc: ViewContainerRef;

  @Input()
  public data: Observable<ItemData[]>;

  protected chart: BarChartTimeScaleComponent;


  constructor(
    private r: ComponentFactoryResolver
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const comp = this.createDymanicChart(DailyBarChartComponent);
    console.log(comp);
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

  // public onClickPrevActivate(): void {
  //   this.chart.goToPrevBar();
  // }

  // public canPrevActivate(): boolean {
  //   return this.chart && this.chart.canActivatePrevBar;
  // }

  // public onClickNextActivate(): void {
  //   this.chart.goToNextBar();
  // }

  // public canNextActivate(): boolean {
  //   return this.chart && this.chart.canActivateNextBar;
  // }

  private createDymanicChart(component: Type<BarChartTimeScaleComponent>): ComponentRef<BarChartTimeScaleComponent> {
    const factory = this.r.resolveComponentFactory(component);
    return this.vc.createComponent(factory);
  }
}