import {
  Component, ElementRef, Input, Output, OnChanges, OnInit, Renderer2, SimpleChanges, EventEmitter, OnDestroy
} from '@angular/core';
import { D3ChartBaseComponent } from './d3-chart-base.component';
import {
  startOfToday, endOfToday,
  startOfYesterday,
  differenceInHours, differenceInSeconds,
  addHours, addDays,
  format
} from 'date-fns';
import {
  ItemData,
  DirectionActiveChange,
  DirectionLeft,
  DirectionRight
} from '../core';
import { Observable, Subscription, merge } from 'rxjs';
import { filter, delay, tap } from 'rxjs/operators';
import * as D3 from 'd3';

@Component({
  selector: 'fn-bar-chart-time-scale',
  template: `<!--d3 create template itself-->`,
})
export abstract class BarChartAbstract extends D3ChartBaseComponent implements OnInit, OnChanges, OnDestroy {

  private groupPlaceholderBars;
  private groupDataBars;
  private x;
  private x2;
  private y;
  private zoom;
  private radiusRectangle: number;
  private minBarHeight: number;

  private maxValueFromChart: number;
  private translateWidthOneBar: number;
  private dataList: ItemData[];
  private mapItemData: Map<number, ItemData>;
  private activeDate: Date;
  private subs: Subscription;
  private canActivatePrevBar: boolean;
  private canActivateNextBar: boolean;
  private changeData: EventEmitter<ItemData[]>;
  private changeBarWidth: EventEmitter<null>;

  @Input()
  public set data(items: ItemData[]) {
    this.dataList = items;
    this.updateMapItemData(items);
  }
  public get data(): ItemData[] {
    return this.dataList;
  }

  @Input()
  public get barWidth(): number {
    return this.barWidthValue;
  }
  public set barWidth(width: number) {
    this.barWidthValue = width;
  }
  private barWidthValue: number;

  @Input('maxValue')
  public initMaxValue: number;

  @Output()
  public petBorder: EventEmitter<any>;

  @Output('activeItemChange')
  public activeItemDataChange: EventEmitter<ItemData | null>;

  public setActiveDate(date: Date) {
    const data = this.mapItemData.get(date.getTime());
    if (data && this.activeDate !== date) {
      this.activeDate = date;
      this.canActivatePrevBar = this.canChangeActiveOn(DirectionLeft);
      this.canActivateNextBar = this.canChangeActiveOn(DirectionRight);
      setTimeout(() => this.activeItemDataChange.emit(data))
    }
  }

  public constructor(
    protected element: ElementRef,
    protected renderer: Renderer2,
  ) {
    super(element, renderer);

    this.data = [];
    this.activeDate = null;
    this.canActivatePrevBar = false;
    this.canActivateNextBar = false;
    this.radiusRectangle = 4;
    this.minBarHeight = 0;
    this.minBarHeight = 10;
    this.barWidthValue = 10;
    this.initMaxValue = 1;
    this.maxValueFromChart = 0;
    this.translateWidthOneBar = 0;

    this.changeData = new EventEmitter();
    this.changeBarWidth = new EventEmitter();
    this.activeItemDataChange = new EventEmitter();
    this.petBorder = new EventEmitter();
    this.subs = new Subscription();
  }

  public ngOnInit(): void {
    // Init svg in DOM and init svg dimetions
    super.ngOnInit();

    // Start work with data, shoul already exist
    if (!this.data || !this.data.length) {
      return;
    }

    // Requiered init after chart entities
    this.initSubscribes();

    this.initActiveDate();
    this.initXScale();
    this.initYScale();
    this.initZoom();

    // process drowing
    this.svg.selectAll().remove();
    this.groupPlaceholderBars = this.svg.append('g').attr('class', 'placeholder');
    this.groupDataBars = this.svg.append('g').attr('class', 'bar');

    this.showActiveBarOnCenterViewport();
    this.updateChart()
  }

  public ngOnChanges(changes: SimpleChanges): void {

    // skip any changes until onInit unavailable
    if (changes.data && changes.data.firstChange) {
      return;
    }

    if (changes.barWidth && changes.barWidth.currentValue) {
      this.changeBarWidth.next();
    }

    if (changes.data && changes.data.currentValue) {
      this.changeData.emit(changes.data.currentValue);
    }
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private onZoomed(): void {
    // console.log('onZoomed');

    // recalc X Scale
    this.x = D3.event.transform.rescaleX(this.x2);

    // redraw groups of bars 
    const { x } = D3.event.transform || {};
    this.groupPlaceholderBars.attr("transform", "translate(" + x + ",0)");
    this.groupDataBars.attr("transform", "translate(" + x + ",0)");
  }

  private onZoomedEnd(e): void {
    // console.log('zoomEnd', D3.event.transform)

    // TODO:
    // detect here zoom/scroll ending and emit event outside
    // use it for paggination -> upload prev chunk
    // if (
    //   D3.event.transform.x
    // ) {
    //   this.petBorder.emit(true);
    // }
  }

  private onBarClick(d: ItemData): void {
    this.setActiveDate(d.identity);
  }

  private updateMaxChartValue(): boolean {
    const oldValue = this.maxValueFromChart;

    this.maxValueFromChart = D3.max([
      this.initMaxValue,
      D3.max(this.data, d => d.value),
    ]);

    return this.maxValueFromChart !== oldValue;
  }

  /**
   * Update availabel scroll zoom
   * Set restrict X axis from range dates
   */
  private updateZoomOnChangeData(from: Date, to: Date): void {
    const { left, right } = this.getPadding();

    this.zoom = this.zoom
      .extent([
        [this.margin.left + left, 0],
        [this.width - this.margin.right - right, 0]
      ])
      .translateExtent([
        [this.x(from), 0],
        [this.x(to), this.height]
      ])
  }

  /**
   * Handler of changing input data
   */
  private recalculateAndUpdateChart(): void {
    this.initXScale();
    this.updateChart();
  }

  /**
   * Update any chart elements
   */
  private updateChart(): void {

    const isChanged: boolean = this.updateMaxChartValue()
    if (isChanged) {
      this.initYScale();
    }

    this.updateZoomOnChangeData(
      D3.min(this.data, d => d.identity),
      D3.max(this.data, d => d.identity),
    );

    // draw bar placeholders
    const placeholderBars = this.groupPlaceholderBars
      .selectAll('rect')
      .data(this.data)
      .call(this.drawPlaceholderBar.bind(this))

    // draw bar label
    this.groupPlaceholderBars
      .selectAll('text')
      .data(this.data)
      .call(this.drawBarLabel.bind(this))

    // draw DATA bars
    this.groupDataBars
      .selectAll('rect')
      .data(this.data.filter(el => el.value))
      .call(this.drawDataBar.bind(this))

    // update active item viewport position
    this.showActiveBarOnCenterViewport();
  }

  private initSubscribes(): void {

    const observe = this.getObserveSource();
    this.subs.add(
      merge(...observe)
        .subscribe(this.recalculateAndUpdateChart.bind(this))
    )

    this.subs.add(
      merge(
        this.changeBarWidth,
        this.activeItemDataChange,
      )
        .subscribe(this.updateChart.bind(this))
    );
  }

  private initActiveDate(): void {
    let activeDate = null;
    const now = this.calcNowBarDate();
    const arr = this.data.filter(d => d.value > 0)
    const lastNotEmptyDate: Date | null = arr.length
      ? D3.max(arr, d => d.identity)
      : null;
    const lastChartDate = this.data[this.data.length - 1].identity;
    const todayInDateRange: boolean = differenceInSeconds(now, lastChartDate) <= 0;

    if (lastNotEmptyDate) {
      activeDate = todayInDateRange
        ? D3.max([now, lastNotEmptyDate])
        : lastNotEmptyDate
    } else if (todayInDateRange) {
      // if now NOT out of current chart dates range
      activeDate = now;
    } else {
      // make active item from center chunk
      activeDate = this.data[Math.floor((this.data.length - 1) / 2)].identity;
    }

    this.setActiveDate(activeDate);
  }

  /**
   * Intit scaling for X axis and calc width one step (from bar start to next bar start)
   */
  private initXScale(): void {
    const [d1, d2] = this.viewportDateRange();
    const { left, right } = this.getPadding();

    this.x = D3.scaleTime()
      .domain([d1, d2])
      .rangeRound([
        this.margin.left + left,
        this.width - this.margin.right - right,
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
    const { top, bottom } = this.getPadding();
    this.y = D3.scaleLinear()
      .domain([0, this.maxValueFromChart])
      .range([
        // this.height - bottom,
        this.height - bottom - this.minBarHeight,
        // this.height - this.minBarHeight,
        top
      ])

    if (this.useYAxisValuesRound) {
      this.y = this.y.nice();
    }
  }

  protected getObserveSource(): Observable<any>[] {
    return [
      this.changeData
    ];
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

  private showActiveBarOnCenterViewport(duration: number = 0): void {
    if (!this.activeDate) {
      return;
    }

    let [initialX, initialY] = [this.x(this.activeDate), 0];

    const layout = this.svg
      .transition()
      .duration(duration)

    // - create new transform and apply it
    // const offset = 100
    // const newTransform = D3.zoomIdentity.translate(-initialX, 0);
    // layout.call(this.zoom.transform, newTransform);

    // - BETTER!
    // - need add offset
    // const offset = 100
    // layout.call(this.zoom.translateBy, -initialX + offset, initialY);

    // - on zoom function call method - translateTo
    layout.call(this.zoom.translateTo, initialX, initialY)
  }

  public goToPrevBar(): boolean {
    if (!this.canActivatePrevBar) return false;
    this.setActiveDate(
      this.calcPrevBarDate(this.activeDate)
    );

    return true;
  }

  public goToNextBar(): boolean {
    if (!this.canActivateNextBar) return false;
    this.setActiveDate(
      this.calcNextBarDate(this.activeDate)
    );

    return true;
  }

  private canChangeActiveOn(dir: DirectionActiveChange): boolean {
    const endDirectionDate: date = (
      (dir === DirectionRight) ? this.data[this.data.length - 1] : this.data[0]
    ).identity;
    const diffDates: number = differenceInSeconds(endDirectionDate, this.activeDate);

    return (dir === DirectionRight) ? diffDates > 0 : diffDates < 0;
  }

  private drawDataBar(selection: any): void {
    this
      .drawBarPrimitive(selection)
      // mark active label
      .call(this.drawAsActiveBar.bind(this))
  }

  private drawPlaceholderBar(selection: any): void {
    this
      .drawBarPrimitive(selection)
      .attr('y', d => this.y(this.maxValueFromChart))
      .attr('height', d => this.y(0) - this.y(this.maxValueFromChart) + this.minBarHeight)
      .attr('class', 'bar placeholder')
      .on("click", this.onBarClick.bind(this));
  }

  private drawBarPrimitive(selection: Selection): Selection {
    return selection
      .join('rect')
      .attr('x', d => this.x(d.identity) - Math.round(this.barWidth / 2))
      .attr('y', d => this.y(d.value))
      .attr('height', d => this.y(0) - this.y(d.value) + this.minBarHeight)
      .attr('width', this.barWidth)
      .attr('rx', d => this.radiusRectangle)
      .attr('ry', d => this.radiusRectangle)
      .attr('class', 'bar')
      .on("click", this.onBarClick.bind(this));
  }

  private drawBarLabel(selection: any): void {

    const yPos: number = this.y(0)
      + this.minBarHeight
      + (this.labelConfig.labelOffsetTop || 0)
      + (this.labelConfig.labelFontSize || 0);

    selection
      .join('text')
      .text((d, i) => this.formatLabel(d))
      .attr('class', 'label')
      // set label by center of bar
      .attr('x', d => this.x(d.identity))
      .attr('y', d => yPos)
      .attr("font-family", `${this.labelConfig.labelFontFamily}`)
      .attr("font-size", `${this.labelConfig.labelFontSize}px`)
      .style('text-anchor', 'middle')
      // mark active label
      .call(this.drawAsActiveBar.bind(this))

    return selection;
  }

  private drawAsActiveBar(selection: Selection): any {
    const fnActive = (d) => d.identity.getTime() === this.activeDate.getTime();
    selection.classed('active', fnActive);
  }

  private updateMapItemData(items: ItemData[]): void {
    if (!this.mapItemData) {
      this.mapItemData = new Map<number, ItemData>();
    } else {
      this.mapItemData.clear();
    }

    items.forEach((el: ItemData) => {
      this.mapItemData.set(el.identity.getTime(), el)
    });
  }

  protected abstract formatLabel(date: ItemData): string;

  /**
   * Get start of step/bar date.
   * Depend of delimiter chart && start is 00 value
   */
  protected abstract calcNowBarDate(): Date;

  /**
   * How much dates need show on x axis - [from;to]
   */
  protected abstract viewportDateRange(): [Date, Date];

  protected abstract calcNextBarDate(from: Date): Date;

  protected abstract calcPrevBarDate(from: Date): Date;
}