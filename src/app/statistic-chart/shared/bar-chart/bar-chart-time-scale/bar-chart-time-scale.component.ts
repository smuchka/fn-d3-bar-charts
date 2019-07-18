import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { BaseD3ChartComponent } from '../base-d3-chart.component';
import { ItemData } from '../core/interfaces/item-data';
import {
  startOfToday, endOfToday,
  startOfYesterday,
  differenceInHours, differenceInSeconds,
  addHours, addDays,
  format
} from 'date-fns'
import * as D3 from 'd3';

const colorDataBar = '#969DAD';
const colorLabel = '#969DAD';
const colorPlaceholderBar = '#F2F5FA';
type DirectionActiveChange = 1 | -1;
const DirectionLeft: DirectionActiveChange = -1;
const DirectionRight: DirectionActiveChange = 1;

@Component({
  selector: 'fn-bar-chart-time-scale',
  template: `<!--d3 create template itself-->
  <button (click)="onPositionZero()">to (0,0)</button>
  <button (click)="onClickToPrevActive()">︎←</button>
  <button (click)="onClickToNextActive()">→</button>
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

  @Input('maxValue')
  public initMaxValue: number;
  @Input()
  public barWidth: number;

  @Input()
  public countViewBars: number;

  private maxValueFromChart: number;
  private translateWidthOneBar: number;
  private activeDate: Date;

  public constructor(
    protected element: ElementRef,
    protected renderer: Renderer2,
  ) {
    super(element, renderer);

    this.items = [];
    this.activeDate = null;
    this.radiusRectangle = 4;
    this.initMaxValue = 0;
    this.maxValueFromChart = 0;
    this.translateWidthOneBar = 0;
  }

  public ngOnInit(): void {

    // Init svg in DOM
    // and init svg dimetions
    super.ngOnInit();

    // must exist data !!!!
    this.initActiveDate();
    this.createXScale();
    this.createYScale();
    this.createZoom();

    // process drowing
    this.svg.selectAll().remove();
    this.drawBottomAxis();
    this.groupPlaceholderBars = this.svg.append('g').attr('class', 'placeholder');
    this.groupDataBars = this.svg.append('g').attr('class', 'bar');
    this.updateChart();

    // 1. show active date in viewport
    // 2. emit event - painning ended left/right! => upload more data ...
    // 3. !!!! navigation nex to balance better
    // 4. не упускать из виду активный
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.items && changes.items.firstChange) {
      return;
    }

    if (changes.items && changes.items.currentValue) {
      this.updateChart();
    }
  }

  protected initActiveDate(): void {
    const arr = this.items.filter(d => d.value > 0)
    const dateMax: Date | null = arr.length
      ? D3.max(arr, d => d.identity)
      : null;
    const now = this.calcNowBarDate();
    this.activeDate = dateMax
      ? differenceInSeconds(dateMax, now) < 0 ? dateMax : now
      : now;
  }

  private createXScale(): void {
    const [d1, d2] = this.viewportDateRange();

    this.x = D3.scaleTime()
      .domain(this.viewportDateRange())
      .range([
        this.margin.left + this.padding.left,
        this.width - this.margin.right - this.padding.right,
      ]);
    this.x2 = this.x.copy();

    // calc width of one bar
    this.translateWidthOneBar = Math.abs(
      this.x(d1) - this.x(this.calcNextBarDate(d1))
    );
  }

  private createYScale(): void {
    this.y = D3.scaleLinear()
      .domain([0, this.maxValueFromChart])
      .range([this.height - this.padding.bottom, this.padding.top])
      .nice();
  }

  private createZoom(): void {
    this.zoom = D3.zoom()
      .scaleExtent([1, 1])
      .on("zoom", this.onZoomed.bind(this))
      .on("end", this.onZoomedEnd.bind(this));

    this.svg.call(this.zoom)
  }

  private updateZoomByChunk(from: Date, to: Date): void {
    this.zoom = this.zoom
      .extent([
        [this.margin.left + this.padding.left, 0],
        [this.width - this.margin.right - this.padding.right, 0]
      ])
      .translateExtent([
        [this.x(from), 0],
        [this.x(to), this.height]
      ])
  }

  private checkAndUpdateMaxValue(): boolean {
    const oldValue = this.maxValueFromChart;

    this.maxValueFromChart = D3.max([
      this.initMaxValue,
      D3.max(this.items, d => d.value),
    ]);

    return this.maxValueFromChart !== oldValue;
  }

  // handlers
  // todo: check it
  private svgTranslateX(x: number = 0, animationDuration: number = 750): void {
    this.svg
      .transition()
      .duration(animationDuration)
      // .call(
      //   this.zoom.transform,
      //   D3.zoomIdentity.translate(x, 0)
      // );
      .call(this.zoom.translateBy, x, 0);
  }

  // todo: check it
  private translateBarInViewPort(date: Date): void {
    const x = this.x(date);
    this.svgTranslateX(x);
  }

  // todo: check it
  public onPositionZero(): void {
    this.svgTranslateX(0)
  }

  private canChangeActiveOn(dir: DirectionActiveChange): boolean {
    if (!this.activeDate) {
      return false;
    }

    const endDirectionDate: date = (
      (dir === DirectionRight) ? this.items[this.items.length - 1] : this.items[0]
    ).identity;
    const diffDates: number = differenceInSeconds(endDirectionDate, this.activeDate);

    return (dir === DirectionRight) ? diffDates > 0 : diffDates < 0;
  }

  // todo: check it
  public onClickToPrevActive(): void {
    if (!this.canChangeActiveOn(DirectionLeft)) return;

    this.activeDate = this.calcPrevBarDate();
    this.updateChart();
    // this.moveX(this.translateWidthOneBar)
  }

  // todo: check it
  public onClickToNextActive(): void {
    if (!this.canChangeActiveOn(DirectionRight)) return;

    this.activeDate = this.calcNextBarDate(this.activeDate);
    this.updateChart();

    console.log(
      this.x(0),
      this.x(this.width),
      this.x(this.activeDate)
    )
    // this.moveX(this.translateWidthOneBar * -1)
  }

  // todo: check it
  private moveX(count: number = 0, animationDuration: number = 100): void {

    this.groupDataBars
      .transition()
      .duration(animationDuration)
      .call(this.zoom.translateBy, count, 0);

    this.groupPlaceholderBars
      .transition()
      .duration(animationDuration)
      .call(this.zoom.translateBy, count, 0);
  }

  // todo: hours dependencies
  protected viewportDateRange(): [Date, Date] {
    const from: Date = this.items[0].identity;
    return [from, addHours(from, this.countViewBars - 1)];
  }

  // todo: hours dependencies
  protected calcNowBarDate(): Date {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  }

  // todo: hours dependencies
  protected calcNextBarDate(from: Date): Date {
    return addHours(from, 1);
  }

  // todo: hours dependencies
  protected calcPrevBarDate(): Date {
    return addHours(this.activeDate, -1);
  }

  private onZoomed(): void {

    // recalc X Scale and redraw xAxis
    this.x = D3.event.transform.rescaleX(this.x2);

    // todo: debug X axis & it group
    if (this.xAxis) this.xAxis.scale(this.x);
    if (this.xAxisG) this.xAxisG.call(this.xAxis);

    // redraw groups of bars 
    const { x } = D3.event.transform || {};
    this.groupPlaceholderBars.attr("transform", "translate(" + x + ",0)");
    this.groupDataBars.attr("transform", "translate(" + x + ",0)");
  }

  // todo: check it
  private onZoomedEnd(): void {
    // console.log(
    //   'zoomEnd',
    //   this,
    //   D3.event
    // )
  }

  private updateChart(): void {

    if (this.checkAndUpdateMaxValue()) {
      this.createYScale();
    }

    // update potencial availabel scroll zone
    // (limited current X range dates)
    this.updateZoomByChunk(
      D3.min(this.items, d => d.identity),
      D3.max(this.items, d => d.identity),
    );

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
  }

  // todo: check it !!!!
  private updateActiveBar(): void {
    this.groupDataBars
      .selectAll('rect')
      .call(this.drawDataBar.bind(this))

    this.groupPlaceholderBars
      .selectAll('.label')
      .data(this.items)
      .call(this.drawBarLabel.bind(this))
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
      .on("click", function (e) {
        var coords = D3.mouse(this);

        console.log(
          'click',
          coords,
          D3.zoomTransform(this),
          e
        );
      });
  }

  private drawBarPrimitive(selection: Selection, color: string): Selection {
    return selection
      .join('rect')
      .attr('x', d => this.x(d.identity) - Math.round(this.barWidth / 2))
      .attr('y', d => this.y(d.value))
      .attr('height', d => this.y(0) - this.y(d.value))
      .attr('width', this.barWidth)
      .attr('rx', d => this.radiusRectangle)
      .attr('ry', d => this.radiusRectangle)
      .attr('class', 'bar')
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
      .attr('x', d => this.x(d.identity))
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

  // todo: remove after debug mode
  private drawBottomAxis() {
    this.xAxis = D3.axisBottom(this.x)
    // .tickSize(6)
    // .tickSizeOuter(6)
    // .tickSizeInner(6)
    // .tickPadding(3)
    // .tickFormat(D3.timeFormat('%H:%M'))

    const positionOnY = this.height - this.padding.bottom / 2;
    this.xAxisG = this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (positionOnY) + ")")
      .call(this.xAxis);
  }
}
