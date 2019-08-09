import { Component, forwardRef } from '@angular/core';
import { BarChartActiveSelectedEvent } from '../core';

import { ChartStaticTooltipComponent } from './chart-static-tooltip.component';
import { BaseChartInstance } from './base-chart-tooltip';

@Component({
  selector: 'fn-relative-tooltip',
  template: `<!--d3 create template itself-->`,
  styles: [],
  providers: [
    {
      provide: BaseChartInstance,
      useExisting: forwardRef(() => ChartRelativeTooltipComponent),
    },
  ],
})
export class ChartRelativeTooltipComponent extends BaseChartInstance {

  public get correctionHeight(): number {
    return 130;
  }

  public draw(event: BarChartActiveSelectedEvent): void {

    if (!this.chart) {
      return;
    }

    const left = 0;
    const top = 0;
    const padding = {
      top: 24,
      right: 10,
      bottom: 24,
      left: 10,
    };

    const layout = this.getLayout();

    layout
      .selectAll('.tooltipGroup')
      .remove();

    const fullWidth = this.chart.getWidth();
    const centerXAxis = fullWidth / 2;
    const tooltipHeight = 52;
    const offsetToDivideLine = 24;

    // tooltip group container
    const tooltipGroup = layout.append('g')
      .attr('class', 'tooltipGroup')
      .attr('fill', '#eee');
    // .attr('width', `calc(100% - ${padding.left} - ${padding.right})`)
    // .attr('x', left + padding.left)
    // .attr('y', top)


    // tooltip background
    tooltipGroup.append('rect')
      .attr('width', `calc(100% - ${padding.left} - ${padding.right})`)
      .attr('height', tooltipHeight + padding.top + padding.bottom)
      .attr('x', left + padding.left)
      .attr('y', top)
      .attr('class', 'tooltip-bg')
      .style('opacity', 0.2)

    // divide line
    tooltipGroup.append('line')
      .attr('stroke', '#DFE3EC')
      .attr('x1', centerXAxis)
      .attr('y1', padding.top)
      .attr('x2', centerXAxis)
      .attr('y2', tooltipHeight + padding.top);

    //
    // Top area
    const leftGroup = tooltipGroup.append('g')
      .attr('x', centerXAxis)
      .attr('y', 0)
      .attr('text-anchor', 'end');

    leftGroup.append('text')
      .attr('x', centerXAxis - offsetToDivideLine)
      .attr('y', padding.top + 5)
      .attr('alignment-baseline', 'hanging')
      .text(`${event.item.value}`)
      .attr('class', 'value');

    leftGroup.append('text')
      .attr('x', centerXAxis - offsetToDivideLine)
      .attr('y', tooltipHeight + padding.top - 5)
      .attr('alignment-baseline', 'baseline')
      .text('Impression')
      .attr('class', 'description');

    //
    // Bottom area
    const rightGroup = tooltipGroup
      .append('g')
      .attr('text-anchor', 'start');

    rightGroup.append('text')
      .attr('x', centerXAxis + offsetToDivideLine)
      .attr('y', padding.top + 5)
      .attr('alignment-baseline', 'hanging')
      .text(`${event.item.external.amount || 0}`)
      .attr('class', 'value');

    rightGroup.append('text')
      .attr('x', centerXAxis + offsetToDivideLine)
      .attr('y', tooltipHeight + padding.top - 5)
      .attr('alignment-baseline', 'baseline')
      .text('Amount spent')
      .attr('class', 'description');
  }
}
