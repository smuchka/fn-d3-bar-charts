import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpressionPriceChartModule } from './shared/impression-price-chart/impression-price-chart.module';

@NgModule({
  imports: [
    CommonModule,
    ImpressionPriceChartModule,
  ],
  exports: [
    ImpressionPriceChartModule,
  ],
  declarations: [],
})
export class StatisticChartModule {
}
