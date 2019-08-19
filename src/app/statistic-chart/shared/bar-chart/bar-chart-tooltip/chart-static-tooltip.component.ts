import { Component, forwardRef } from '@angular/core';
import { BarChartComponent } from '../bar-chart.component';
import { BarChartActiveSelectedEvent, numberWithCommas } from '../core';
import { BaseChartInstance } from './base-chart-tooltip';

@Component({
  selector: 'fn-static-tooltip',
  template: `<!--d3 create template itself-->`,
  styles: [],
  providers: [
    {
      provide: BaseChartInstance,
      useExisting: forwardRef(() => ChartStaticTooltipComponent),
    },
  ]
})
export class ChartStaticTooltipComponent extends BaseChartInstance {

  private padding: Record<'top' | 'right' | 'bottom' | 'left', number>;
  private offsetToDivideLine: number;
  private tooltipHeight: number;
  private centerXAxis: number;

  private widthValue: number;
  public get fullWidth() {
    return this.widthValue;
  }
  public set fullWidth(value: number) {
    this.widthValue = value;
    this.centerXAxis = this.widthValue / 2;
  }

  public constructor() {
    super();

    this.padding = {
      top: 24,
      right: 10,
      bottom: 12,
      left: 10,
    };

    this.offsetToDivideLine = 24;
    this.tooltipHeight = 52;
  }

  public get correctionHeight(): number {
    return 90;
  }

  public draw(event: BarChartActiveSelectedEvent): void {

    if (!this.chart) {
      return;
    }

    const layout = this.getLayout();

    layout
      .selectAll('.tooltipGroup')
      .remove();

    this.fullWidth = this.chart.getWidth();

    // tooltip group container
    const tooltipGroup = layout.append('g')
      .attr('class', 'tooltipGroup')
      .attr('fill', '#eee');

    // divide line
    tooltipGroup.append('line')
      .attr('stroke', '#DFE3EC')
      .attr('x1', this.centerXAxis)
      .attr('y1', this.padding.top)
      .attr('x2', this.centerXAxis)
      .attr('y2', this.tooltipHeight + this.padding.top);

    // Left side
    const impressionValue = numberWithCommas(event.item.value.toString());
    this.drawTooltipContentLeft(tooltipGroup, impressionValue);

    // Roght side
    const amountValue = numberWithCommas(Math.floor((event.item.external.amount || 0) * 100) / 100);
    this.drawTooltipContentRight(tooltipGroup, amountValue.toString());
  }

  private drawTooltipContentLeft(layout: any, value: string): void {

    const leftGroup = layout.append('g')
      .attr('x', this.centerXAxis)
      .attr('y', 0)
      .attr('text-anchor', 'end');

    leftGroup.append('text')
      .attr('x', this.centerXAxis - this.offsetToDivideLine)
      .attr('y', this.padding.top + 5)
      .attr('alignment-baseline', 'hanging')
      .text(value)
      .attr('class', 'value');

    leftGroup.append('text')
      .attr('x', this.centerXAxis - this.offsetToDivideLine)
      .attr('y', this.tooltipHeight + this.padding.top - 5)
      .attr('alignment-baseline', 'baseline')
      .text('Impression')
      .attr('class', 'description');
  }

  private drawTooltipContentRight(layout: any, value: string): void {

    const rightGroup = layout
      .append('g')
      .attr('text-anchor', 'start');

    rightGroup.append('text')
      .attr('x', this.centerXAxis + this.offsetToDivideLine)
      .attr('y', this.padding.top + 5)
      .attr('alignment-baseline', 'hanging')
      .text(value)
      .attr('class', 'value');

    rightGroup.append('text')
      .attr('x', this.centerXAxis + this.offsetToDivideLine)
      .attr('y', this.tooltipHeight + this.padding.top - 5)
      .attr('alignment-baseline', 'baseline')
      .text('Amount spent')
      .attr('class', 'description');
  }
}
