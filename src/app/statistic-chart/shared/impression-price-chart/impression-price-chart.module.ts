import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpressionPriceChartComponent } from './impression-price-chart.component';
import { BarChartModule } from '../bar-chart/bar-chart.module';
import { DayDelimiterChartComponent } from './day-delimiter-chart/day-delimiter-chart.component';

@NgModule({
  imports: [
    CommonModule,
    BarChartModule,
  ],
  declarations: [
    ImpressionPriceChartComponent,
    DayDelimiterChartComponent
  ],
  exports: [
    ImpressionPriceChartComponent,
  ],
})
export class ImpressionPriceChartModule {
}
