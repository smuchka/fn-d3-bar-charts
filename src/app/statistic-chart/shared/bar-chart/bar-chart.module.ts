import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart.component';
import { ChartActiveDateTooltipComponent } from './chart-active-date-tooltip/chart-active-date-tooltip.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    BarChartComponent,
    ChartActiveDateTooltipComponent
  ],
  exports: [
    BarChartComponent,
    ChartActiveDateTooltipComponent
  ],
  providers: []
})
export class BarChartModule {
}
