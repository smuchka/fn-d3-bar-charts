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

  private placeholderBarsGroup;
  private x;
  private x2;
  private y;
  private xAxis;
  private xAxisG;
  private placeholderBars;
  private zoom;

  @Input()
  public startRange: Date;
  @Input()
  public endRange: Date;

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
    this.bindEvents();

    // this.startRange = startOfToday();
    // this.endRange = endOfToday();

    this.render();
  }

  protected calcXAxisEndDate(): void {

  }

  private createXScale(): void {
    const x = D3.scaleTime()
      .domain([this.startRange, this.endRange])
      .range([this.margin.left, this.width - this.margin.right]);
    x.ticks(D3.timeMinute.every(60));
    this.x2 = x.copy();
    return x;
  }

  private createYScale(): void {
    return D3.scaleLinear()
      .domain([0, this.getMaxYValue()])
      .range([this.height - this.padding.bottom, this.padding.top])
      .nice();

  }

  private getMaxYValue() {
    const inputMax = 999;
    const maxY = D3.max([
      inputMax,
      D3.max(this.items, d => d.value),
    ]);

    return maxY;
  }

  private render() {
    if (!this.svg) {
      return;
    }

    this.svg.selectAll().remove();
    // if data exist
    this.x = this.createXScale();
    this.y = this.createYScale();

    this.zoom = D3.zoom()
      .extent([[200, 0], [this.width, this.height]])
      .scaleExtent([1, 1])
      .translateExtent([[0, 0], [this.width, this.height]])
      .on("zoom", this.onZoomed.bind(this));

    this.svg.call(this.zoom);

    this.drawBarAndPlaceholders();
    this.drawBottomAxis();
  }

  protected bindEvents(): void {
    if (!this.svg) {
      return;
    }
  }

  private onZoomed(): void {
    // // var t = zoom.translate(),
    //  let tx = D3.event.transform.x,
    //   ty = D3.event.transform.y;

    // tx = Math.min(tx, 0);
    // tx = Math.max(tx, this.width);
    // zoom.translate([tx, ty]);

    console.log(D3.event);

    // setTimeout(() => {
    //   this.svg.transition()
    //     .duration(750)
    //     .call(this.zoom.transform, D3.zoomIdentity.translate(0, 0));
    // }, 2000)

    this.x = D3.event.transform.rescaleX(this.x2) // update the working 
    this.xAxis.scale(this.x);
    this.xAxisG.call(this.xAxis);
    this.placeholderBarsGroup.attr("transform", "translate(" + D3.event.transform.x + ",0)");
  }

  private drawBarAndPlaceholders() {

    let barWidth = 20;
    let radiusRectangle = 4;

    console.warn(':', differenceInHours(this.endRange, this.startRange));

    const countHours = differenceInHours(this.endRange, this.startRange) + 1;
    let rangeEmptyData =
      Array.from(Array(countHours), (el, index) => {
        return addHours(this.startRange, index);
      });

    console.warn(rangeEmptyData[0].getTime());

    // // // // // // // // //
    // draw bar placeholder //
    // // // // // // // // //
    this.placeholderBarsGroup = this.svg.append('g')
    this.placeholderBars = this.placeholderBarsGroup
      .selectAll('rect')
      .data(rangeEmptyData);

    this.placeholderBars
      .join('rect')
      .attr('x', d => {
        // console.log(d.data)
        return this.x(d)
      })
      .attr('y', d => this.y(this.getMaxYValue()))
      .attr('rx', d => radiusRectangle)
      .attr('ry', d => radiusRectangle)
      .attr('height', d => this.y(0) - this.y(this.getMaxYValue()))
      .attr('width', barWidth)
      // .attr('width', this.x.bandwidth)
      .style('fill', '#F2F5FA')
      .style('radius', '4px');

    // draw bar
    let bars = this.svg.append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(this.items);

    bars
      .join('rect')
      .attr('x', d => this.x(d.identity))
      .attr('y', d => this.y(d.value))
      .attr('height', d => this.y(0) - this.y(d.value))
    // .attr('width', barWidth);
    // .attr('width', this.x.bandwidth);

    // draw label
    bars
      .join('text')
      .text((d, i) => d.label)
      // set label by center of bar
      .attr('x', d => this.x(d.identity) + Math.round(barWidth / 2))
      .attr('y', d => this.y(0) + 20)
      .attr("font-family", "Lato")
      .attr("font-size", "12px")
      .style('fill', '#969DAD')
      .style('text-anchor', 'middle');

  }

  private drawBottomAxis() {
    this.xAxis = D3.axisBottom(this.x);
    const positionOnY = this.height - this.padding.bottom / 2;
    this.xAxisG = this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + positionOnY + ")")
      .call(this.xAxis);
  }
}
