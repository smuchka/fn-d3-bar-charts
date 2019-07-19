import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartTimeScaleComponent } from './bar-chart-time-scale/bar-chart-time-scale.component';
import { DailyBarChartComponent } from './daily-bar-chart/daily-bar-chart.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DailyBarChartComponent,
  ],
  exports: [
    DailyBarChartComponent
  ],
})
export class BarChartModule {
}
