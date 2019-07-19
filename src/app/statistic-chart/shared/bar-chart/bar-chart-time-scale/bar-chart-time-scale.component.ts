import {
  Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, EventEmitter
} from '@angular/core';
import { BaseD3ChartComponent } from '../base-d3-chart.component';
import { ItemData } from '../core/interfaces/item-data';
import { DirectionActiveChange, DirectionLeft, DirectionRight } from '../core/types/direction-active-change';
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

@Component({
  selector: 'fn-bar-chart-time-scale',
  template: `<!--d3 create template itself-->`,
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
  private changeData: EventEmitter<ItemData[]>;
  private activeDate: Date;

  public get activeBarDate(): Date {
    return this.activeDate || null;
  }

  public constructor(
    protected element: ElementRef,
    protected renderer: Renderer2,
  ) {
    super(element, renderer);

    this.items = [];
    this.activeDate = null;
    this.radiusRectangle = 4;
    this.initMaxValue = 1;
    this.maxValueFromChart = 0;
    this.translateWidthOneBar = 0;
    this.changeData = new EventEmitter();

    // subscribe on:
    this.changeData
      .subscribe(this.onDataChanged.bind(this));
  }

  public ngOnInit(): void {

    // Init svg in DOM
    // and init svg dimetions
    super.ngOnInit();

    // Start work with data, shoul already exist
    if (!this.items || !this.items.length) {
      return;
    }

    this.initActiveDate();
    this.initXScale();
    this.initYScale();
    this.initZoom();

    // process drowing
    this.svg.selectAll().remove();
    this.groupPlaceholderBars = this.svg.append('g').attr('class', 'placeholder');
    this.groupDataBars = this.svg.append('g').attr('class', 'bar');

    this.showActiveBarOnCenterViewport();
    this.changeData.emit(this.items);

    // TODO:
    // - create comunication with wrapper Component
    // -- next active
    // -- prev active
    // - emit event - painning ended left/right! => upload more data ...
    // - navigation on nexx/prev active
    // - не упускать из виду активный
    // - click on bar - make it as active date
    // - show tooltip
    // - check subscriptions

    this.svg.on("click", this.onSvgClick.bind(this));
  }

  public ngOnChanges(changes: SimpleChanges): void {

    // skip any changes until onInit unavailable
    if (changes.items && changes.items.firstChange) {
      return;
    }

    if (changes.items && changes.items.currentValue) {
      this.changeData.emit(changes.items.currentValue);
    }
  }

  /**
   * Handler of changing input data
   */
  private onDataChanged(): void {
    console.log('!', this.maxValueFromChart)
    const isChanged: boolean = this.updateMaxChartValue()
    if (isChanged) {
      this.initYScale();
    }
    console.log('!', this.maxValueFromChart)

    this.updateZoomOnChangeData(
      D3.min(this.items, d => d.identity),
      D3.max(this.items, d => d.identity),
    );

    this.updateChart();
  }

  private onZoomed(): void {
    console.log('onZoomed');

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

  private onZoomedEnd(): void {
    console.log('zoomEnd', this, D3.event)

    // TODO:
    // detect here zoom/scroll ending and emit event outside
    // use it for paggination -> upload prev chunk
  }

  private onBarClick(d: ItemData): void {
  }

  private onSvgClick(d): void {
    // console.log('click svg - ', D3.zoomIdentity, format(this.activeDate, 'HH:mm'));
  }

  private updateMaxChartValue(): boolean {
    const oldValue = this.maxValueFromChart;

    console.log(this.items);
    this.maxValueFromChart = D3.max([
      this.initMaxValue,
      D3.max(this.items, d => d.value),
    ]);

    return this.maxValueFromChart !== oldValue;
  }

  /**
   * Update availabel scroll zoom
   * Set restrict X axis from range dates
   */
  private updateZoomOnChangeData(from: Date, to: Date): void {
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

  /**
   * Update any chart elements
   */
  private updateChart(): void {
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

  private initActiveDate(): void {

    const arr = this.items.filter(d => d.value > 0)
    const lastNotEmptyDate: Date | null = arr.length
      ? D3.max(arr, d => d.identity)
      : null;

    // if now include in current chart range (first and last items)
    const now = this.calcNowBarDate();
    const lastChartDate = this.items[this.items.length - 1].identity;

    // if now NOT out of current chart dates range
    if (lastNotEmptyDate && differenceInSeconds(lastChartDate, now) <= 0) {
      this.activeDate = lastNotEmptyDate
        ? differenceInSeconds(lastNotEmptyDate, now) < 0 ? lastNotEmptyDate : now
        : now;
    }

    // some items of center chunk
    this.activeDate = this.items[Math.floor((this.items.length - 1) / 2)].identity;
  }

  /**
   * Intit scaling for X axis and calc width one step (from bar start to next bar start)
   */
  private initXScale(): void {
    const [d1, d2] = this.viewportDateRange();

    this.x = D3.scaleTime()
      .domain(this.viewportDateRange())
      .rangeRound([
        this.margin.left + this.padding.left,
        this.width - this.margin.right - this.padding.right,
      ])
      .nice();
    this.x2 = this.x.copy();

    // calc width of one bar
    this.translateWidthOneBar = Math.abs(
      this.x(d1) - this.x(this.calcNextBarDate(d1))
    );
  }

  /**
   * Intit scaling for X axis
   */
  private initYScale(): void {
    this.y = D3.scaleLinear()
      .domain([0, this.maxValueFromChart])
      .range([this.height - this.padding.bottom, this.padding.top])
      .nice();
  }

  /**
   * Init api zooming for implement panning (horizontal scroll zone)
   */
  private initZoom(): void {
    this.zoom = D3.zoom()
      .scaleExtent([1, 1])
      .on("zoom", this.onZoomed.bind(this))
      .on("end", this.onZoomedEnd.bind(this));

    this.svg.call(this.zoom)
  }

  private showActiveBarOnCenterViewport(): void {
    if (!this.activeDate) {
      return;
    }

    let [initialX, initialY] = [this.x(this.activeDate), 0];

    const layout = this.svg
      .transition()
      .duration(0)

    // - create new transform and apply it
    // const newTransform = D3.zoomIdentity.translate(-initialX, 0);
    // layout.call(this.zoom.transform, newTransform);

    // - BETTER!
    // - need add offset
    // layout.call(this.zoom.translateBy, -initialX, initialY);

    // - on zoom function call method - translateTo
    layout.call(this.zoom.translateTo, initialX, initialY)
  }

  public canChangeActiveOn(dir: DirectionActiveChange): boolean {
    if (!this.activeDate) {
      return false;
    }

    const endDirectionDate: date = (
      (dir === DirectionRight) ? this.items[this.items.length - 1] : this.items[0]
    ).identity;
    const diffDates: number = differenceInSeconds(endDirectionDate, this.activeDate);

    return (dir === DirectionRight) ? diffDates > 0 : diffDates < 0;
  }

  public goToPrevBar(): boolean {
    if (!this.canChangeActiveOn(DirectionLeft)) return false;

    this.activeDate = this.calcPrevBarDate(this.activeDate);
    this.showActiveBarOnCenterViewport();
    this.updateChart();

    return true;
  }

  public goToNextBar(): boolean {
    if (!this.canChangeActiveOn(DirectionRight)) return false;

    this.activeDate = this.calcNextBarDate(this.activeDate);
    this.showActiveBarOnCenterViewport();
    this.updateChart();

    return true;
  }

  // // // // // // // // // // // // 
  // TODO: need overload in child - hours | days | weeks
  // // // // // // // // // // // // 

  protected viewportDateRange(): [Date, Date] {
    const from: Date = this.items[0].identity;
    return [from, addHours(from, this.countViewBars - 1)];
  }

  /**
   * Get start of step/bar date.
   * Depend of delimiter chart && start is 00 value
   */
  protected calcNowBarDate(): Date {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  }

  protected calcNextBarDate(from: Date): Date {
    return addHours(from, 1);
  }

  protected calcPrevBarDate(from: Date): Date {
    return addHours(from, -1);
  }

  // // // // // // // // // // // // 
  // // // // // // // // // // // //

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
    // .on("click", this.onBarClick.bind(this));
    // .on("click", (e) => {
    //   D3.zoomTransform();
    //   console.log(e, this);
    // })
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
    // .on("click", this.onBarClick.bind(this));
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
}