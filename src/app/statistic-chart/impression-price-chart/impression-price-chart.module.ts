import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpressionPriceChartComponent } from './impression-price-chart.component';
import { BarChartModule } from '../shared/bar-chart/bar-chart.module';

@NgModule({
  imports: [
    CommonModule,
    BarChartModule,
  ],
  declarations: [
    ImpressionPriceChartComponent,
  ],
  exports: [
    ImpressionPriceChartComponent,
  ],
})
export class ImpressionPriceChartModule {
}
