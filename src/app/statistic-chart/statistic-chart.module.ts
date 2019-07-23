import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpressionPriceChartModule } from './shared/impression-price-chart/impression-price-chart.module';
import { ChartActiveDateNavModule } from './shared/chart-active-date-nav/chart-active-date-nav.module';

@NgModule({
  imports: [
    CommonModule,
    ImpressionPriceChartModule,
    ChartActiveDateNavModule,
  ],
  exports: [
    ImpressionPriceChartModule,
    ChartActiveDateNavModule,
  ],
})
export class StatisticChartModule {
}
