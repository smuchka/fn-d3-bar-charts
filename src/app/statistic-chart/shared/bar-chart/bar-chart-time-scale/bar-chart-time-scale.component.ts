import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { BaseD3ChartComponent } from '../base-d3-chart.component';
import { ItemData } from '../core/interfaces/item-data';
import { startOfToday, endOfToday, startOfYesterday, differenceInHours, addHours, format } from 'date-fns'
import * as D3 from 'd3';

const colorDataBar = '#969DAD';
const colorPlaceholderBar = '#F2F5FA';

@Component({
  selector: 'fn-bar-chart-time-scale',
  template: '<!--d3 create template itself-->',
})
export class BarChartTimeScaleComponent extends BaseD3ChartComponent implements OnInit {

  @Input()
  public items: ItemData[];

  private groupPlaceholderBars;
  private groupDataBars;
  private x;
  private x2;
  private y;
  private xAxis;
  private xAxisG;
  private zoom;
  private radiusRectangle;

  @Input()
  public startRange: Date;
  @Input()
  public endRange: Date;
  @Input()
  public barWidth: number;

  @Input()
  public countViewBars: number;

  public constructor(
    protected element: ElementRef,
    protected renderer: Renderer2,
  ) {
    super(element, renderer);

    this.items = [];
    this.radiusRectangle = 4;
  }

  public ngOnInit(): void {
    this.initialiseSizeAndScale();
    this.buildSVG();
    this.render();
  }

  // todo: hours dependencies
  protected calcXAxisEndDate(): Date {
    return addHours(this.startRange, this.countViewBars - 1);
  }

  private createXScale(): void {
    const x = D3.scaleTime()
      .domain([this.startRange, this.calcXAxisEndDate()])
      .range([this.margin.left, this.width - this.margin.right]);
    x.ticks(D3.utcMinute.every(60));
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
    const inputMax = 0;
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

    const a = 100;
    this.zoom = D3.zoom()
      // .extent([
      //   [100, 100],
      //   [this.x(addHours(this.endRange, 4)), this.height]
      // ])
      .scaleExtent([1, 1])

      // TODO: how limit scroll range ????
      // todo: hours dependencies
      .translateExtent([
        [this.x(addHours(this.startRange, -3)), 0],
        [this.x(addHours(this.endRange, 3)), this.height]
      ])
      .on("zoom", this.onZoomed.bind(this));

    this.svg.call(this.zoom);

    this.drawBarAndPlaceholders();
    this.drawBottomAxis();

    console.log('!');
    // this.svg.transition()
    //   .duration(750)
    //   .call(
    //     this.zoom.transform, 
    //     D3.zoomIdentity.translate(0, 0)
    //   );
  }

  private drawBarAndPlaceholders() {

    // todo: hours dependencies
    // geberate ranage placeholders
    const countHours = differenceInHours(this.endRange, this.startRange) + 1;
    let rangeEmptyData: ItemData[] =
      Array.from(Array(countHours), (el, index) => {

        const date = addHours(this.startRange, index);
        return <ItemData>{
          identity: date,
          label: format(date, 'HH:mm'),
          value: this.getMaxYValue(),
        };
      });

    // draw placeholders
    this.groupPlaceholderBars = this.svg.append('g')
    const placeholderBars = this.groupPlaceholderBars
      .selectAll('rect')
      .data(rangeEmptyData)
      .call(this.drawPlaceholderBar.bind(this));

    // draw bar
    this.groupDataBars = this.svg.append('g');
    const bars = this.groupDataBars.attr('fill', 'steelblue')
      .selectAll('rect')
      .data(this.items)
      .call(this.drawDataBar.bind(this))

  }

  private onZoomed(): void {
    // console.log(D3.event.transform);
    // todo: run navigate on position
    // setTimeout(() => {
    //   this.svg.transition()
    //     .duration(750)
    //     .call(this.zoom.transform, D3.zoomIdentity.translate(0, 0));
    // }, 2000)

    this.x = D3.event.transform.rescaleX(this.x2) // update the working 
    this.xAxis.scale(this.x);
    this.xAxisG.call(this.xAxis);

    const { x } = D3.event.transform || {};
    this.groupPlaceholderBars
      .attr("transform", "translate(" + x + ",0)");
    this.groupDataBars
      .attr("transform", "translate(" + x + ",0)");
  }

  private drawDataBar(selectors: any): void {
    this.drawBarPrimitive(
      selectors,
      colorDataBar,
    );
  }

  private drawPlaceholderBar(selectors: any): void {
    this.drawBarPrimitive(
      selectors,
      colorPlaceholderBar,
    );

    // draw label
    // bars
    //   .join('text')
    //   .text((d, i) => d.label)
    //   // set label by center of bar
    //   .attr('x', d => this.x(d.identity) + Math.round(this.barWidth / 2))
    //   .attr('y', d => this.y(0) + 20)
    //   .attr("font-family", "Lato")
    //   .attr("font-size", "12px")
    //   .style('fill', '#969DAD')
    //   .style('text-anchor', 'middle');
  }

  private drawBarPrimitive(
    selectors: any,
    color: string,
  ): void {
    selectors
      .join('rect')
      .attr('x', d => this.x(d.identity))
      .attr('y', d => this.y(d.value))
      .attr('height', d => this.y(0) - this.y(d.value))
      .attr('width', this.barWidth)
      .attr('rx', d => this.radiusRectangle)
      .attr('ry', d => this.radiusRectangle)
      .attr('dutc', d => d.identity.toUTCString())
      .attr('dlocal', d => d.identity.toString())
      .style('fill', color);
  }

  // debug
  private drawBottomAxis() {
    this.xAxis = D3.axisBottom(this.x);
    const positionOnY = this.height - this.padding.bottom / 2;
    this.xAxisG = this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + positionOnY + ")")
      .call(this.xAxis);
  }
}
