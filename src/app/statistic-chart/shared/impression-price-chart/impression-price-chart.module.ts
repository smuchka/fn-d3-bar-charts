import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpressionPriceChartComponent } from './impression-price-chart.component';
import { BarChartModule } from '../bar-chart/bar-chart.module';

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
  entryComponents: [
    DailyBarChartComponent,
    HourBarChartComponent
  ]
})
export class ImpressionPriceChartModule {
}
