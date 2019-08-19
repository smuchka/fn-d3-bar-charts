import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart.component';
import { ChartStaticTooltipComponent } from './bar-chart-tooltip/chart-static-tooltip.component';
import { ChartRelativeTooltipComponent } from './bar-chart-tooltip/chart-relative-tooltip.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    BarChartComponent,
    ChartStaticTooltipComponent,
    ChartRelativeTooltipComponent,
  ],
  exports: [
    BarChartComponent,
    ChartStaticTooltipComponent,
    ChartRelativeTooltipComponent,
  ],
})
export class BarChartModule {
}
