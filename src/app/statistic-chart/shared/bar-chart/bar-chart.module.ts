import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartAbstract } from './bar-chart-abstract/bar-chart-abstract.component';
import { BarChartComponent } from './bar-chart.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    BarChartComponent,
  ],
  exports: [
    BarChartComponent,
  ],
  providers: []
})
export class BarChartModule {
}
