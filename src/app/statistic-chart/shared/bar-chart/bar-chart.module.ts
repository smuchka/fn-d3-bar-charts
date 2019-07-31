import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
