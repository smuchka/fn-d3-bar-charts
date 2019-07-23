import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpressionPriceChartComponent } from './impression-price-chart.component';
import { BarChartModule } from '../bar-chart/bar-chart.module';
import { DayBarChartComponent } from '../bar-chart/day-bar-chart.component';
import { HourBarChartComponent } from '../bar-chart/hour-bar-chart.component';
import { WeekBarChartComponent } from '../bar-chart/week-bar-chart.component';

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
    HourBarChartComponent,
    DayBarChartComponent,
    WeekBarChartComponent,
  ]
})
export class ImpressionPriceChartModule {
}
