import { BarChartComponent } from '../bar-chart.component';

export class BaseChartInstance {
  protected chart: BarChartComponent;

  public setChart(chart: BarChartComponent): void {
    this.chart = chart;
  }
}