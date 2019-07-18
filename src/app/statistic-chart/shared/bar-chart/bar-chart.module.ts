import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseD3ChartComponent } from './base-d3-chart.component';
import { BarChartTimeScaleComponent } from './bar-chart-time-scale/bar-chart-time-scale.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    BarChartTimeScaleComponent,
  ],
  exports: [
    BarChartTimeScaleComponent
  ],
})
export class BarChartModule {
}
