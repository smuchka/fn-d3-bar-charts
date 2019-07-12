import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { BaseD3ChartComponent } from '../base-d3-chart.component';
import { ItemData } from '../core/interfaces/item-data';
import { startOfToday, endOfToday, differenceInHours, addHours } from 'date-fns'
import * as D3 from 'd3';

@Component({
  selector: 'fn-bar-chart-time-scale',
  template: '<!--d3 create template itself-->',
})
export class BarChartTimeScaleComponent extends BaseD3ChartComponent implements OnInit {

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
    if(!this.svg) {
      return;
    }

    this.svg.selectAll().remove();

    // if data exist

    let barWidth = 20;
    let radiusRectangle = 4;
    let startRange = startOfToday();
    let endRange = endOfToday();

    const countDays = differenceInHours(endRange, startRange) + 1;
    let rangeEmptyData =
      Array.from(Array(countDays), (el, index) => {
        return addHours(startRange, index);
      });

    console.warn(':', differenceInHours(endRange, startRange));

    let x = D3.scaleTime()
      .domain([startRange, endRange])
      .range([this.margin.left, this.width - this.margin.right]);
    x.ticks(D3.timeMinute.every(60));

    const inputMax = 999;
    const maxY = D3.max([
      inputMax,
      D3.max(this.items, d => d.value),
    ]);

    const y = D3.scaleLinear()
      .domain([0, maxY])
      .range([this.height - this.padding.bottom, this.padding.top])
      .nice();

    console.warn(y(0), y(643));

    // // // // // // // // //
    // draw bar placeholder //
    // // // // // // // // //
    let placeholderBars = this.svg.append('g')
      .selectAll('rect')
      .data(rangeEmptyData);

    placeholderBars
      .join('rect')
      .attr('x', d => x(d))
      .attr('y', d => y(maxY))
      .attr('rx', d => radiusRectangle)
      .attr('ry', d => radiusRectangle)
      .attr('height', d => y(0) - y(maxY))
      .attr('width', barWidth)
      .style('fill', '#F2F5FA')
      .style('radius', '4px');

    // draw bar
    let bars = this.svg.append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(this.items);

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
