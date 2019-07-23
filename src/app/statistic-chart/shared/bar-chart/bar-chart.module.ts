import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartAbstract } from './bar-chart-abstract/bar-chart-abstract.component';
import { DayBarChartComponent } from './day-bar-chart.component';
import { HourBarChartComponent } from './hour-bar-chart.component';
import { WeekBarChartComponent } from './week-bar-chart.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DayBarChartComponent,
    HourBarChartComponent,
    WeekBarChartComponent,
  ],
  exports: [
    DayBarChartComponent,
    HourBarChartComponent,
    WeekBarChartComponent,
  ],
})
export class BarChartModule {
}
