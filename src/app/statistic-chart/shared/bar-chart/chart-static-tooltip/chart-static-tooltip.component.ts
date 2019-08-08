import { Component, Input, OnInit, OnChanges, SimpleChanges, AfterContentInit } from '@angular/core';
import { BarChartComponent } from '../bar-chart.component';
import { BarChartActiveSelectedEvent } from '../core';

@Component({
  selector: 'fn-static-tooltip',
  templateUrl: './chart-static-tooltip.component.html',
  styleUrls: ['./chart-static-tooltip.component.css']
})
export class ChartStaticTooltipComponent implements OnInit, OnChanges, AfterContentInit {

  private chart: BarChartComponent;

  public constructor() {
  }

  public ngOnInit(): void {
    // console.log('Tooltip onInit', this.layoutElement);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // console.log('tooltip:', changes);
  }

  public ngAfterContentInit() {
    // console.log(';')
  }

  public setChart(chart: BarChartComponent): void {
    this.chart = chart;
  }

  public get correctionWidth(): number {
    return 0;
  }

  public get correctionHeight(): number {
    return 100;
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

    const layout = false ? this.chart.getLayoutPanning() : this.chart.getLayout();

    console.log(layout);

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
      .attr('fill', '#fff')
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
      // .style('opacity', 0.2)

    // divide line
    tooltipGroup.append('line')
      .attr('stroke', '#DFE3EC')
      .attr('x1', centerXAxis)
      .attr('y1', padding.top)
      .attr('x2', centerXAxis)
      .attr('y2', tooltipHeight + padding.top)

    //
    // Left side
    const leftGroup = tooltipGroup.append('g')
      .attr('x', centerXAxis)
      .attr('y', 0)
      .attr('text-anchor', 'end')

    leftGroup.append('text')
      .attr('x', centerXAxis - offsetToDivideLine)
      .attr('y', padding.top + 5)
      .attr('alignment-baseline', 'hanging')
      .text(`${event.item.value}`)
      .attr('class', 'value')

    leftGroup.append('text')
      .attr('x', centerXAxis - offsetToDivideLine)
      .attr('y', tooltipHeight + padding.top - 5)
      .attr('alignment-baseline', 'baseline')
      .text('Impression')
      .attr('class', 'description')

    //
    // Roght side
    const rightGroup = tooltipGroup
      .append('g')
      .attr('text-anchor', 'start')

    rightGroup.append('text')
      .attr('x', centerXAxis + offsetToDivideLine)
      .attr('y', padding.top + 5)
      .attr('alignment-baseline', 'hanging')
      .text(`${event.item.external.amount || 0}`)
      .attr('class', 'value')

    rightGroup.append('text')
      .attr('x', centerXAxis + offsetToDivideLine)
      .attr('y', tooltipHeight + padding.top - 5)
      .attr('alignment-baseline', 'baseline')
      .text('Amount spent')
      .attr('class', 'description')
  }
}
