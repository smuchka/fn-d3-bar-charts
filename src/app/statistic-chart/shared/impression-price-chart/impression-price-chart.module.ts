import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpressionPriceChartComponent } from './impression-price-chart.component';
import { BarChartModule } from '../bar-chart/bar-chart.module';
import { DayDelimiterChartComponent } from './day-delimiter-chart/day-delimiter-chart.component';
import { ImpressionStatisticService } from './services/impression-statistic.service';

@NgModule({
  imports: [
    CommonModule,
    BarChartModule,
  ],
  declarations: [
    ImpressionPriceChartComponent,
  ],
  exports: [
    ImpressionPriceChartComponent,
  ],
  providers: [ImpressionStatisticService],
})
export class ImpressionPriceChartModule {
}
