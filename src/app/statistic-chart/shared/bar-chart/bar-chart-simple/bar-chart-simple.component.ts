import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { BaseD3ChartComponent } from '../base-d3-chart.component';
import { ItemData } from '../core/interfaces/item-data';
import * as D3 from 'd3';

@Component({
  selector: 'fn-bar-chart-simple',
  template: '<!--d3 create template itself-->',
})
export class BarChartSimpleComponent extends BaseD3ChartComponent implements OnInit {

  @Input()
  public items: ItemData[];

  public constructor(
    protected element: ElementRef,
    protected renderer: Renderer2,
  ) {
    super(element, renderer);
    this.items = [];
  }

  public ngOnInit(): void {
    this.initialiseSizeAndScale();
    this.buildSVG();
    this.render();
  }

  private render() {
    this.svg.selectAll().remove();

    // if data exist

    let barWidth = 20;

    const x = D3.scaleBand()
      .domain(this.items.map(d => d.label))
      .range([this.margin.left, this.width - this.margin.right]);
    // .padding(0.1);

    const maxY = D3.max(this.items, d => d.value);
    const y = D3.scaleLinear()
      .domain([0, maxY]).nice()
      .range([this.height - 100, this.margin.top]);
    // this.margin.bottom

    let bars = this.svg.append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(this.items);

    console.warn(y(0), y(643));
    // draw bar
    bars
      .join('rect')
      .attr('x', d => x(d.label))
      .attr('y', d => y(maxY))
      .attr('height', d => y(0) - y(maxY))
      .attr('width', barWidth)
      .style('fill', 'yellow');

    bars
      .join('rect')
      .attr('x', d => x(d.label))
      .attr('y', d => y(d.value))
      .attr('height', d => y(0) - y(d.value))
      .attr('width', barWidth);

    // draw label
    bars
      .join('text')
      .text((d, i) => i)
      // set label by center of bar
      .attr('x', d => x(d.label) + Math.round(barWidth / 2))
      .attr('y', d => y(0))
      .style('fill', 'black')
      .style('text-anchor', 'middle');
  }
}
