import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpressionPriceChartModule } from './impression-price-chart/impression-price-chart.module';
import { ChartActiveDateNavModule } from './chart-active-date-nav/chart-active-date-nav.module';
import { DelimiterChartConfigService } from './shared/services/delimiter-chart-config.service';
import { DelimiterChartStrategyService } from './shared/services/delimiter-chart-strategy.service';

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
  providers: [
    DelimiterChartStrategyService,
    DelimiterChartConfigService
  ],
})
export class StatisticChartModule {
}
