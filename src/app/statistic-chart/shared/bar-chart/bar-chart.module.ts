import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart.component';
import {
  ChartStaticTooltipComponent
} from './chart-static-tooltip/chart-static-tooltip.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    BarChartComponent,
    ChartStaticTooltipComponent
  ],
  exports: [
    BarChartComponent,
    ChartStaticTooltipComponent
  ],
  providers: []
})
export class BarChartModule {
}
