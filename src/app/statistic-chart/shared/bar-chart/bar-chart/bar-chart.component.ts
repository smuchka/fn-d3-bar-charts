import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { BaseD3ChartComponent } from '../base-d3-chart.component';
import { ItemData } from '../core/interfaces/item-data';
import * as D3 from 'd3';

@Component({
  selector: 'fn-bar-chart',
  template: '<!--d3 create template itself-->',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent extends BaseD3ChartComponent implements OnInit {

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

    let x = D3.scaleBand()
      .domain(this.items.map(d => d.identity))
      .range([this.margin.left, this.width - this.margin.right])
      .align(0.5)
      .padding(0)
      .paddingInner(0.8)
      .paddingOuter(0.4);

const inputMax = 999;
    const maxY = D3.max([
      inputMax,
      D3.max(this.items, d => d.value),
    ]);
    
    const y = D3.scaleLinear()
      .domain([0, maxY])
      .range([this.height - this.padding.bottom, this.padding.top])
      .nice();

    let bars = this.svg.append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(this.items);

    console.warn(y(0), y(643));

    // draw bar placeholder
    bars
      .join('rect')
      .attr('x', d => x(d.identity))
      .attr('y', d => y(maxY))
      .attr('height', d => y(0) - y(maxY))
      .attr('width', barWidth)
      .style('fill', 'yellow');

    // draw bar
    bars
      .join('rect')
      .attr('x', d => x(d.identity))
      .attr('y', d => y(d.value))
      .attr('height', d => y(0) - y(d.value))
      // .attr('width', barWidth);
      .attr('width', x.bandwidth);

    // draw label
    bars
      .join('text')
      .text((d, i) => d.label)
      // set label by center of bar
      .attr('x', d => x(d.identity) + Math.round(barWidth / 2))
      .attr('y', d => y(0) + 20)
      .attr("font-family", "Lato")
      .attr("font-size", "12px")
      .style('fill', '#969DAD')
      .style('text-anchor', 'middle');

    //Draw axes
    var xAxis = D3.axisBottom(x);
    const positionOnY = this.height - this.padding.bottom / 2;
    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + positionOnY + ")")
      .call(xAxis);
  }
}
