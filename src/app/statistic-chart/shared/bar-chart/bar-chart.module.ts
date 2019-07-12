import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseD3ChartComponent } from './base-d3-chart.component';
import { BarChartSimpleComponent } from './bar-chart-simple/bar-chart-simple.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    BarChartSimpleComponent,
    BaseD3ChartComponent,
  ],
  exports: [
    BarChartSimpleComponent,
  ],
})
export class BarChartModule {
}
