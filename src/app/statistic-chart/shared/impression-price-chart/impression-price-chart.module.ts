import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpressionPriceChartComponent } from './impression-price-chart.component';
import { BarChartModule } from '../bar-chart/bar-chart.module';
import { StatisticHourDelimiterService } from './services/statistic-hour-delimiter.service';
import { StatisticDayDelimiterService } from './services/statistic-day-delimiter.service';

import { DailyBarChartComponent } from '../bar-chart/daily-bar-chart/daily-bar-chart.component';
import { HourBarChartComponent } from '../bar-chart/hour-bar-chart/hour-bar-chart.component';

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
  providers: [
    StatisticHourDelimiterService,
    StatisticDayDelimiterService
  ],
  entryComponents: [
    DailyBarChartComponent,
    HourBarChartComponent
  ]
})
export class ImpressionPriceChartModule {
}
