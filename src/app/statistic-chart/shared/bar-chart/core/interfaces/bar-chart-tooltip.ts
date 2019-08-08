import { BarChartActiveSelectedEvent } from './bar-chart-active-selected-event';
import { BarChartBase } from './bar-chart-base';

export interface ChartTooltip {
  correctionWidth: number;
  correctionHeight: number;
  setChart(chart: BarChartBase): void;
  draw(event: BarChartActiveSelectedEvent): void;
}