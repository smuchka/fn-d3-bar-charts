import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseD3ChartComponent } from './base-d3-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    BarChartComponent,
    BaseD3ChartComponent,
  ],
  exports: [
    BarChartComponent,
  ],
})
export class BarChartModule {
}
