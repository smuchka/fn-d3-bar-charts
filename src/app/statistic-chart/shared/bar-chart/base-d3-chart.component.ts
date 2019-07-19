import { Component, ElementRef, Renderer2, Input } from '@angular/core';
import * as D3 from 'd3';

type Position = {
  top: number,
  bottom: number,
  right: number,
  left: number,
};

@Component({
  selector: 'fn-base-d3-chart',
  template: '<!--d3 create template itself-->',
})
export abstract class BaseD3ChartComponent implements OnInit {

  protected svg;
  protected height;
  protected width;
  protected host;

  @Input()
  public heightCorrection: number;
  @Input()
  public widthCorrection: number;

  protected margin: Position = {
    top: 0,
    bottom: 25,
    right: 20,
    left: 25,
  };

  protected padding: Position = {
    top: 130,
    // bottom: 25,
    bottom: 50,
    right: 20,
    left: 0,
  };

  public constructor(
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
  ) {
    this.host = D3.select(elementRef.nativeElement);
    this.heightCorrection = 0;
    this.widthCorrection = 0;
  }

  public ngOnInit(): void {
    this.initialiseSizeAndScale();
    this.buildSVG();
  }

  protected initialiseSizeAndScale() {
    const container = this.getParentElement();
    console.warn(container)
    const clientWidth = container.clientWidth;
    const clientHeight = container.clientHeight;
    this.width = clientWidth - this.margin.left - this.margin.right + this.widthCorrection;
    this.height = clientHeight - this.margin.bottom - this.margin.top + this.heightCorrection;
  }

  protected buildSVG() {
    // this.host.html('');
    const divBlock = this.host.append('div')
    // .style('overflow-x', 'auto');

    this.svg = divBlock.append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('padding-top', this.margin.top)
      .style('padding-bottom', this.margin.bottom)
      .style('padding-left', this.margin.left)
      .style('padding-right', this.margin.right)
    // .style('background-color', '#6ecc9e');
  }

  protected abstract bindEvents(): void;

  /**
   * Date range to Width chart ratio.
   * How many dates include in view area of chart.
   * use for calculation x axix values
   */
  protected abstract xAxisDateRange(): [Date, Date];

  /**
   * Get element container of chip list
   * @return HTMLElement
   */
  private getParentElement(): HTMLElement {
    return this.renderer.parentNode(this.elementRef.nativeElement);
  }
}
