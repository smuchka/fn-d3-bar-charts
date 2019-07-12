import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseD3ChartComponent } from './base-d3-chart.component';
import { BarChartSimpleComponent } from './bar-chart-simple/bar-chart-simple.component';
import { BarChartTimeScaleComponent } from './bar-chart-time-scale/bar-chart-time-scale.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    BaseD3ChartComponent,
    BarChartSimpleComponent,
    BarChartTimeScaleComponent,
  ],
  exports: [
    BarChartSimpleComponent,
    BarChartTimeScaleComponent
  ],
})
export class BarChartModule {
}
