import {
  Component, ElementRef, Input, Output, Renderer2, EventEmitter, OnInit, AfterContentInit, OnChanges, OnDestroy,
} from '@angular/core';
import { D3ChartBaseComponent } from './d3-chart-base.component';
import { getEmptyDataInitError } from './bar-chart-errors';
import {
  differenceInSeconds,
  isWithinRange,
} from 'date-fns';
import {
  ItemData,
  DirectionActiveChange,
  DirectionLeft,
  DirectionRight,
  PaginationEvent,
  BarChartActiveSelectedEvent,
  BarChartBase,
  UpdateChartEvent,
} from '../core';
import { Observable, Subscription, Subject, merge, } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as D3 from 'd3';
import { Selection } from "d3";

@Component({
  selector: 'fn-bar-chart-time-scale',
  template: `<!--d3 create template itself-->`,
})
export abstract class BarChartAbstract extends D3ChartBaseComponent implements BarChartBase, OnInit, AfterContentInit, OnDestroy {

  private groupPanning;
  private x;
  private x2;
  private y;
  private zoom;
  private radiusRectangle: number;
  private minBarHeight: number;

  private maxValueFromChart: number;
  private translateWidthOneBar: number;
  private dataList: ItemData[];
  private dataMin: Date;
  private dataMax: Date;
  private mapItemData: Map<number, ItemData>;
  private activeDate: Date;
  private canActivatePrevBarItem: boolean;
  private canActivateNextBarItem: boolean;
  private isDataUpdateEvent: boolean;
  protected updateChart$: Subject<UpdateChartEvent>;
  protected subs: Subscription;

  @Output()
  public paginationEvent: EventEmitter<Date>;

  @Input()
  public set data(items: ItemData[]) {
    this.dataList = items;
    this.updateMapItemData(items);
    this.dataMin = D3.min(items, d => d.identity);
    this.dataMax = D3.max(items, d => d.identity);
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

  @Input('isMobile')
  public isMobile: boolean = false;

  @Input()
  public hasLeftPagination: boolean;
  private hasLeftPannning: boolean;

  public get showLeftPagination(): boolean {
    return this.hasLeftPagination || this.hasLeftPannning;
  }

  private hasRightPannning: boolean;
  public get showRightPagination(): boolean {
    return this.hasRightPannning;
  }

  @Output()
  public readonly activeItemDataChange: EventEmitter<BarChartActiveSelectedEvent>;

  public setActiveDate(date: Date) {
    const item = this.mapItemData.get(date.getTime());

    if (item && this.activeDate !== date) {
      this.activeDate = date;
      this.canActivatePrevBarItem = this.canChangeActiveOn(DirectionLeft);
      this.canActivateNextBarItem = this.canChangeActiveOn(DirectionRight);

      setTimeout(() => {
        const event = new BarChartActiveSelectedEvent(
          item,
          this.x(item.identity),
          this.dataList,
        );
        this.activeItemDataChange.emit(event);
      });
    }
  }

  public get canActivatePrevBar(): boolean {
    return this.canActivatePrevBarItem;
  }

  public get canActivateNextBar(): boolean {
    return this.canActivateNextBarItem;
  }

  public get firstViewportDate(): Date | null {
    if (this.x2 && this.x2.ticks()) {
      return this.x2.ticks()[0]
    }

    return null;
  }

  public get lastViewportDate(): Date | null {
    if (this.x2 && this.x2.ticks()) {
      return this.x2.ticks()[this.x2.ticks().length - 1]
    }

    return null;
  }

  protected constructor(
    protected element: ElementRef,
    protected renderer: Renderer2,
  ) {
    super(element, renderer);

    this.data = [];
    this.activeDate = null;
    this.canActivatePrevBarItem = false;
    this.canActivateNextBarItem = false;
    this.hasLeftPagination = false;
    this.hasLeftPannning = false;
    this.radiusRectangle = 4;
    this.minBarHeight = 10;
    this.barWidthValue = 10;
    this.initMaxValue = 1;
    this.maxValueFromChart = 0;
    this.translateWidthOneBar = 0;

    this.activeItemDataChange = new EventEmitter();
    this.paginationEvent = new EventEmitter();
    this.updateChart$ = new Subject<UpdateChartEvent>();
    this.subs = new Subscription();
  }

  public ngOnInit(): void {
    // Start work with data, should already exist
    if (!this.data || !this.data.length) {
      throw getEmptyDataInitError();
    }
  }

  public ngAfterContentInit(): void {
    // Init svg in DOM and init svg dimetions
    super.ngAfterContentInit();
    this.initSubscribes();

    this.initActiveDate();
    this.initXScale();
    this.initYScale();
    this.initZoom();

    // process drawing
    this.svg.selectAll().remove();
    this.groupPanning = this.svg.append('g').attr('class', 'panning-container');
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // public API
  public getLayoutPanning() {
    return this.groupPanning;
  }
  public getLayout() {
    return this.svg;
  }

  private onZoomed(): void {
    // rescale copy axis -> x2
    this.x2 = D3.event.transform.rescaleX(this.x);

    const { x } = D3.event.transform || { x: 0 };
    this.groupPanning.attr("transform", "translate(" + x + ",0)");

    this.hasLeftPannning = this.dataMin && this.dataMin.getTime() < this.firstViewportDate.getTime();
    this.hasRightPannning = this.dataMax && this.dataMax.getTime() > this.lastViewportDate.getTime();
    this.drawPaginationShadow();
  }

  private onZoomedEnd(): void {

    const { x } = D3.event.transform || { x: 0 };
    if (x > Math.abs(this.x(this.dataMin))) {
      this.paginationEvent.emit(new Date(this.dataMin));
    }
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
   * Update any chart elements
   */
  private updateChart(): void {

    const isChanged: boolean = this.updateMaxChartValue();
    if (isChanged) {
      this.initYScale();
    }

    this.updateZoomOnChangeData(this.dataMin, this.dataMax);

    this.drawBars();

    this.drawPaginationShadow();

    // update active item viewport position
    this.isMobile ? this.showActiveBarOnCenterViewportMobile() : this.showActiveBarOnViewportDesktop();
  }


  private initSubscribes(): void {
    this.subs.add(
      merge(
        this.updateChart$.asObservable(),
        this.activeItemDataChange.pipe(map(_ => ({ rescale: false, isDataUpdate: false })))
      )
        .subscribe((upd: UpdateChartEvent) => {
          this.isDataUpdateEvent = upd.isDataUpdate;
          if (upd.full) {
            this.initXScale();
            // @hack
            this.getLayoutPanning().selectAll('*').remove();
            this.getLayoutPanning().call(
              this.zoom.transform,
              D3.zoomIdentity.scale(1)
            );
            this.initActiveDate();
          }
          this.updateChart();
        })
    );
  }

  private initActiveDate(): void {
    let activeDate = null;

    const now = this.calcNowBarDate();
    const arr = this.data.filter(d => d.value > 0);
    const lastNotEmptyDate: Date | null = arr.length ? this.dataMax : null;
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
   * Init scaling for X axis and calc width one step (from bar start to next bar start)
   */
  private initXScale(): void {
    const [d1, d2] = this.domainDateRange();
    const { left, right } = this.getPadding();
    this.x = D3.scaleTime()
      .domain([d1, d2])
      .rangeRound([
        this.margin.left + left,
        this.width - this.margin.right - right,
      ]);

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
      ]);

    if (this.useYAxisValuesRound) {
      this.y = this.y.nice();
    }
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

  private showActiveBarOnViewportDesktop(duration: number = 0): void {
    if (!this.activeDate) {
      return;
    }

    const layout = this.svg.transition().duration(duration);
    const [initialX, initialY] = [this.x( this.activeDate ), 0];

    switch(initialX) {
      case this.x(this.firstViewportDate): // Left Side
        if(this.dataMin.getTime() !== this.firstViewportDate.getTime()) {
          layout.call(
            this.zoom.transform,
            D3.zoomIdentity.translate(
              - this.x(
                this.firstViewportDate
              ) + (this.translateWidthOneBar / 2) + this.translateWidthOneBar,
              initialY
            )
          );
        }
        break;
      case this.x(this.lastViewportDate): // Right Side
        if(this.dataMax.getTime() !== this.lastViewportDate.getTime()) {
          layout.call(
            this.zoom.transform,
            D3.zoomIdentity.translate(
              - this.x(
                this.firstViewportDate
              ) - (this.translateWidthOneBar / 2) + (this.translateWidthOneBar / 2) + this.barWidth,
              initialY
            )
          );
        }
        break;
      default: // If active date is out of viewport and user clicked on navigation button scroll to changed active date
        if(!isWithinRange(this.activeDate, this.firstViewportDate, this.lastViewportDate) && !this.isDataUpdateEvent) {
          layout.call(this.zoom.translateTo, initialX, initialY);
        }
        break;
    }
  }

  private showActiveBarOnCenterViewportMobile(duration: number = 0): void {
    if (!this.activeDate) {
      return;
    }

    let [initialX, initialY] = [this.x(this.activeDate), 0];

    const layout = this.svg
      .transition()
      .duration(duration);

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
    const endDirectionDate: Date = (
      (dir === DirectionRight) ? this.data[this.data.length - 1] : this.data[0]
    ).identity;
    const diffDates: number = differenceInSeconds(endDirectionDate, this.activeDate);

    return (dir === DirectionRight) ? diffDates > 0 : diffDates < 0;
  }

  private drawBars(): void {
    const context = this.groupPanning;

    // width from bar to bar
    const barClickAreaWidth: number = this.translateWidthOneBar;
    const optionsBarArea = {
      x: (d: ItemData) => this.x(d.identity) - Math.round(barClickAreaWidth / 2),
      y: (d: ItemData) => this.y(this.maxValueFromChart),
      width: barClickAreaWidth,
      height: (d: ItemData) => this.y(0) - this.y(this.maxValueFromChart) + this.minBarHeight
    };

    const optionsBarData = {
      x: (d: ItemData) => this.x(d.identity) - Math.round(this.barWidth / 2),
      y: (d: ItemData) => this.y(d.value),
      width: this.barWidth,
      height: (d: ItemData) => {
        if (d.value) {
          return this.y(0) - this.y(d.value) + this.minBarHeight
        }

        return 0;
      },
    };

    const optionsBarPlaceholder = {
      x: (d: ItemData) => this.x(d.identity) - Math.round(this.barWidth / 2),
      y: (d: ItemData) => this.y(this.maxValueFromChart),
      width: this.barWidth,
      height: (d: ItemData) => this.y(0) - this.y(this.maxValueFromChart) + this.minBarHeight,
    };

    const yLabelPosition: number = this.y(0)
      + this.minBarHeight
      + (this.labelConfig.labelOffsetTop || 0)
      + (this.labelConfig.labelFontSize || 0);

    const optionsBarLabel = {
      x: (d: ItemData) => this.x(d.identity),
      y: (d: ItemData) => yLabelPosition,
    };

    const createBarContextFn = (context) => {

      // draw click bg
      const barAreaClickSelection = context.append('rect');
      this.drawBarRectangle(barAreaClickSelection, 'click-area', optionsBarArea)
        .attr('opacity', '.0')

      // draw placeholder bar
      const barPlaceholderSelection = context.append('rect');
      this.drawBarRectangle(barPlaceholderSelection, 'bar', optionsBarPlaceholder)
        .classed('placeholder', true);

      // draw data bar
      const barDataSelection = context.append('rect');
      this.drawBarRectangle(barDataSelection, 'bar', optionsBarData);

      // draw label
      const barLabelSelection = context.append('text')
      this.drawBarTextLabel(barLabelSelection, 'label', optionsBarLabel);
    }

    const barGroupSelection = context.selectAll('g.bar-group')
      .data(this.data, (d: ItemData) => d.identity)
      .join(
        (enter) => {
          return enter.append('g')
            .classed('bar-group entered', true)
            .call(createBarContextFn)
        },
        (update) => {
          update.classed('entered', false)
          return update;
        },
        (exit) => {
          exit.remove();
          return exit;
        },
      )
      .call(this.drawAsActiveBar.bind(this))

    // click on bar group (include click on bar + palceholder + empty area aroud placeholder)
    barGroupSelection.on("click", this.onBarClick.bind(this));
  }

  private drawBarRectangle(
    selectionRects: Selection<SVGElement, {}, HTMLElement, any>,
    className: string,
    options: {
      width?: any,
      height?: any,
      x?: any,
      y?: any,
    } = {}
  ): Selection<SVGElement, {}, HTMLElement, any> {

    const width = options.width !== undefined
      ? options.width
      : this.barWidth;
    const height = options.height !== undefined
      ? options.height
      : (d: ItemData) => this.y(0) - this.y(d.value) + this.minBarHeight;
    const x = options.x !== undefined
      ? options.x
      : (d: ItemData) => this.x(d.identity) - Math.round(this.barWidth / 2);
    const y = options.y !== undefined
      ? options.y
      : (d: ItemData) => this.y(d.value);

    selectionRects
      .attr('x', x)
      .attr('y', y)
      .attr('height', height)
      .attr('width', width)
      .attr('rx', d => this.radiusRectangle)
      .attr('ry', d => this.radiusRectangle)
      .attr('class', className)

    return selectionRects;
  }

  private drawBarTextLabel(
    selection: Selection<SVGElement, {}, HTMLElement, any>,
    className: string,
    options: {
      x?: any,
      y?: any,
    } = {}
  ): Selection<SVGElement, {}, HTMLElement, any> {

    selection
      .text((d, i) => this.formatLabel(d))
      .attr('class', className)
      .attr('x', options.x || 0)
      .attr('y', options.y || 0)
      .style('text-anchor', 'middle')
      .attr("font-family", `${this.labelConfig.labelFontFamily}`)
      .attr("font-size", `${this.labelConfig.labelFontSize}px`)

    return selection;
  }

  private drawAsActiveBar(selection: Selection<SVGElement, {}, HTMLElement, any>): any {
    const fnActive = (d) => d.identity.getTime() === this.activeDate.getTime();
    selection.classed('active', fnActive);
  }

  private drawPaginationShadow(): any {
    const layout = this.getLayout();

    layout.selectAll('.shadow-container').remove();

    // shadow container
    const shadowPaginationGroup = layout.append('g')
      .attr('class', 'shadow-container')
    var tooltipDef = shadowPaginationGroup.append('defs');
    const createFilterShadow = (defs: any, idFilter: string, deviation: number = 8) => {
      const filterRef = defs.append('filter').attr('id', idFilter);
      filterRef
        .attr('x', '-50%').attr('y', '-50%')
        .attr('width', '200%').attr('height', '200%')
      filterRef.append('feGaussianBlur').attr('stdDeviation', deviation);
    };
    const idFilter = 'svg_3_blur';
    createFilterShadow(tooltipDef, idFilter, 15)

    const blurColor = 'white';
    const blurOffsetX = 25;
    const widthShadowWithMargin = 70;
    const { left, right } = this.getPadding();
    let posX = 0;

    // fn draw shadow
    const fnDrawShadow = (x: number, className: string) => {
      shadowPaginationGroup
        .selectAll(`rect.${className}`)
        .data([[x, 0]])
        .join('rect')
        .attr('class', `${className}`)
        .attr('opacity', '1')
        .attr('filter', `url(#${idFilter})`)
        .attr('x', ([x,]) => x)
        .attr('y', d => this.y(this.maxValueFromChart))
        .attr('width', widthShadowWithMargin)
        .attr('height', d => this.y(0) - this.y(this.maxValueFromChart) + this.minBarHeight)
        .attr('fill', blurColor)
        .attr('stroke-opacity', '0.5')
        .attr('stroke-width', '10')
        .attr('stroke', blurColor)
    }

    // draw left shadow
    if (this.showLeftPagination) {
      posX = 0 - (widthShadowWithMargin - (widthShadowWithMargin / 2)) - blurOffsetX;
      fnDrawShadow(posX, 'left')
    }

    // draw right shadow
    if (this.showRightPagination) {
      posX = this.width - (widthShadowWithMargin / 2) + blurOffsetX;
      fnDrawShadow(posX, 'right')
    }
  }

  private updateMapItemData(items: ItemData[]): void {

    if (!this.mapItemData) {
      this.mapItemData = new Map<number, ItemData>();
    } else {
      this.mapItemData.clear();
    }

    if (items && items.length) {
      items.forEach((el: ItemData) => {
        this.mapItemData.set(el.identity.getTime(), el)
      });
    }
  }

  /**
   * Get formatted string for item
   */
  protected abstract formatLabel(date: ItemData): string;

  /**
   * Get start of step/bar date.
   * Depend of delimiter chart && start is 00 value
   */
  protected abstract calcNowBarDate(): Date;

  /**
   * How much dates need show on x axis - [from;to]
   */
  protected abstract domainDateRange(): [Date, Date];

  protected abstract calcNextBarDate(from: Date): Date;

  protected abstract calcPrevBarDate(from: Date): Date;
}
