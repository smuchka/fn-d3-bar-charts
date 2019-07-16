import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { BaseD3ChartComponent } from '../base-d3-chart.component';
import { ItemData } from '../core/interfaces/item-data';
import {
  startOfToday, endOfToday,
  startOfYesterday,
  differenceInHours, addHours,
  format
} from 'date-fns'
import * as D3 from 'd3';

const colorDataBar = '#969DAD';
const colorLabel = '#969DAD';
const colorPlaceholderBar = '#F2F5FA';

@Component({
  selector: 'fn-bar-chart-time-scale',
  template: `<!--d3 create template itself-->
  <button (click)="positionEndViewPort()">to end</button>
  <button (click)="positionReset()">reset</button>
  <button (click)="positionZero()">to (0,0)</button>
  `,
  styles: ['./bar-chart-time-scale.scss'],
})
export class BarChartTimeScaleComponent extends BaseD3ChartComponent implements OnInit, OnChanges {

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
  @Input('maxValue')
  public initMaxValue: number;
  @Input()
  public barWidth: number;

  @Input()
  public countViewBars: number;

  private maxValueFromChart: number;
  private activeDate: Date;

  public constructor(
    protected element: ElementRef,
    protected renderer: Renderer2,
  ) {
    super(element, renderer);

    this.items = [];
    this.radiusRectangle = 4;
    this.initMaxValue = 0;
    this.maxValueFromChart = 0;

    this.activeDate = addHours(startOfToday(), 8)
  }

  public ngOnInit(): void {
    //
    this.initialiseSizeAndScale();
    this.buildSVG();
    this.createZoom();
    this.createXScale();
    this.createYScale();
    //
    this.svg.selectAll().remove();
    this.drawBottomAxis();
    this.groupPlaceholderBars = this.svg.append('g').attr('class', 'placeholder');
    this.groupDataBars = this.svg.append('g').attr('class', 'bar');
    this.updateChart();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.items && changes.items.firstChange) {
      return;
    }

    if (changes.items && changes.items.currentValue) {
      console.log(changes.items.currentValue)
      this.updateChart();
    }
  }

  // todo: hours dependencies
  protected xAxisDateRange(): [Date, Date] {
    return [this.startRange, addHours(this.startRange, this.countViewBars - 1)];
    // return [this.startRange, this.endRange];
  }

  private createXScale(): void {
    this.x = D3.scaleTime()
      .domain(this.xAxisDateRange())
      .range([this.margin.left, this.width - this.margin.right]);
    this.x2 = this.x.copy();
  }

  private createYScale(): void {
    this.y = D3.scaleLinear()
      .domain([0, this.maxValueFromChart])
      .range([this.height - this.padding.bottom, this.padding.top])
      .nice();
  }

  private createZoom(): void {

    const a = 100;
    this.zoom = D3.zoom()
      // .extent([
      //   [100, 100],
      //   [this.x(addHours(this.endRange, 4)), this.height]
      // ])
      .scaleExtent([1, 1])

      // // TODO: how limit scroll range ????
      // // todo: hours dependencies
      // .translateExtent([
      //   [this.x(addHours(this.startRange, -3)), 0],
      //   [this.x(addHours(this.endRange, 3)), this.height]
      // ])
      .on("zoom", this.onZoomed.bind(this));

    this.svg.call(this.zoom);
  }

  private checkAndUpdateMaxValue(): boolean {
    const oldValue = this.maxValueFromChart;

    this.maxValueFromChart = D3.max([
      this.initMaxValue,
      D3.max(this.items, d => d.value),
    ]);

    return this.maxValueFromChart !== oldValue;
  }

  private goTo(x: number = 0, y: number = 0, animationDuration: number = 750): void {
    this.svg
      .transition()
      .duration(750)
      .call(
        this.zoom.transform,
        D3.zoomIdentity.translate(x, y)
      );
  }

  private positionBarInViewPort(date: Date): void {
    const x = this.x(date);
    this.goTo(x);
  }

  public positionEndViewPort(): void {
    const lastDateCurrentRange: Date = endOfToday();
    this.positionBarInViewPort(lastDateCurrentRange);
  }

  public positionReset(): void {
    this.svg
      .transition()
      .duration(750)
      .call(
        this.zoom.transform,
        D3.zoomIdentity
      );
  }

  public positionZero(): void {
    this.svg
      .transition()
      .duration(750)
      .call(
        this.zoom.transform,
        D3.zoomIdentity.translate(0, 0)
      );
  }

  private onZoomed(): void {
    // recalc X Scale and redraw xAxis
    this.x = D3.event.transform.rescaleX(this.x2) // update the working 
    this.xAxis.scale(this.x);
    // this.xAxisG.call(this.xAxis);

    // redraw groups of bars 
    const { x } = D3.event.transform || {};
    this.groupPlaceholderBars.attr("transform", "translate(" + x + ",0)");
    this.groupDataBars.attr("transform", "translate(" + x + ",0)");
  }

  private updateChart(): void {

    if (this.checkAndUpdateMaxValue()) {
      this.createYScale();
    }

    // draw bar placeholders
    const placeholderBars = this.groupPlaceholderBars
      .selectAll('rect')
      .data(this.items)
      .call(this.drawPlaceholderBar.bind(this))

    // draw bar label
    this.groupPlaceholderBars
      .selectAll('text')
      .data(this.items)
      .call(this.drawBarLabel.bind(this))

    // draw DATA bars
    this.groupDataBars
      .selectAll('rect')
      .data(this.items.filter(el => el.value))
      .call(this.drawDataBar.bind(this))


    rect.exit().remove();
  }

  private drawDataBar(selection: any): void {
    this
      .drawBarPrimitive(selection, colorDataBar)
      // mark active label
      .call(this.drawAsActiveBar.bind(this))
  }

  private drawPlaceholderBar(selection: any): void {
    this
      .drawBarPrimitive(selection, colorPlaceholderBar)
      .attr('y', d => this.y(this.maxValueFromChart))
      .attr('height', d => this.y(0) - this.y(this.maxValueFromChart))
      .attr('class', 'bar placeholder')
  }

  private drawBarPrimitive(selection: Selection, color: string): Selection {
    return selection
      .join('rect')
      .attr('x', d => this.x(d.identity))
      .attr('y', d => this.y(d.value))
      .attr('height', d => this.y(0) - this.y(d.value))
      .attr('width', this.barWidth)
      .attr('rx', d => this.radiusRectangle)
      .attr('ry', d => this.radiusRectangle)
      .attr('class', 'bar')
    // .attr('dutc', d => d.identity.toUTCString())
    // .attr('dlocal', d => d.identity.toString())
  }

  private drawBarLabel(selection: any): void {

    const labelFontSize: number = 12;
    const labelOffsetTop: number = 10;
    const labelFontFamily: string = 'Lato';

    selection
      .join('text')
      .text((d, i) => d.label)
      .attr('class', 'label')
      // set label by center of bar
      .attr('x', d => this.x(d.identity) + Math.round(this.barWidth / 2))
      .attr('y', d => this.y(0) + labelOffsetTop + labelFontSize)
      .attr("font-family", `${labelFontFamily}`)
      .attr("font-size", `${labelFontSize}px`)
      .style('text-anchor', 'middle')
      // mark active label
      .call(this.drawAsActiveBar.bind(this))

    return selection;
  }

  private drawAsActiveBar(selection: Selection): any {
    const fnActive = (d) => d.identity.getTime() === this.activeDate.getTime();
    selection.classed('active', fnActive);
  }

  // debug
  private drawBottomAxis() {
    this.xAxis = D3.axisBottom(this.x);
    const positionOnY = this.height - this.padding.bottom / 2;
    // this.xAxisG = this.svg.append("g")
    //   .attr("class", "x axis")
    //   .attr("transform", "translate(0," + positionOnY + ")")
    //   .call(this.xAxis);
  }
}
