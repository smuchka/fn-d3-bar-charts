import { BarChartComponent } from '../bar-chart.component';
import { ChartTooltip } from '../core/bar-chart-tooltip';

export class BaseChartInstance implements ChartTooltip {
  protected chart: BarChartComponent;

  public get correctionWidth(): number {
    return 0;
  }

  public get correctionHeight(): number {
    return 0;
  }

  public setChart(chart: BarChartComponent): void {
    this.chart = chart;
  }

  public getLayout(): any {

    if (!this.chart) {
      return null;
    }

    return this.chart.getLayout()
  }
}