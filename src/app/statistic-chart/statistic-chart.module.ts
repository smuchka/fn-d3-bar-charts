import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpressionPriceChartModule } from './shared/impression-price-chart/impression-price-chart.module';
import { ChartActiveDateNavComponent } from './shared/chart-active-date-nav/chart-active-date-nav.component';

@NgModule({
  imports: [
    CommonModule,
    ImpressionPriceChartModule,
  ],
  exports: [
    ImpressionPriceChartModule,
    ChartActiveDateNavComponent
  ],
  declarations: [
    ChartActiveDateNavComponent
  ],
})
export class StatisticChartModule {
}
