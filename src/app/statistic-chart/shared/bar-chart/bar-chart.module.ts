import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart.component';
import {
  ChartStaticTooltipComponent
} from './chart-static-tooltip/chart-static-tooltip.component';
import { ChartRelativeTooltipComponent } from './chart-relative-tooltip/chart-relative-tooltip.component';
import { ChartTooltip } from './core';

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
  providers: [
    { provide: ChartTooltip, useClass: ChartStaticTooltipComponent },
    { provide: ChartTooltip, useClass: ChartRelativeTooltipComponent },
  ]
})
export class BarChartModule {
}
