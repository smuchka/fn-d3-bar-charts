import { BarChartComponent } from '../bar-chart.component';
import { ChartTooltip, BarChartActiveSelectedEvent } from '../core';

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

  public draw(event: BarChartActiveSelectedEvent): void {
    throw Error(`'draw' method must be reloaded in inherited class`);
  }
}