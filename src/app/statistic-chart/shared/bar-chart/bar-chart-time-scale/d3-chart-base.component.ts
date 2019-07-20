import { Component, ElementRef, Renderer2, Input } from '@angular/core';
import * as D3 from 'd3';

type Position = {
  top: number,
  bottom: number,
  right: number,
  left: number,
};

type LabelConfig = {
  labelFontSize: number;
  labelOffsetTop: number;
  labelFontFamily: string;
}

@Component({
  selector: 'fn-base-d3-chart',
  template: '<!--d3 create template itself-->',
})
export abstract class D3ChartBaseComponent implements OnInit {

  protected svg;
  protected height;
  protected width;
  protected host;
  protected labelConfig: LabelConfig;

  protected heightCorrection: number;
  protected widthCorrection: number;

  /**
   * Margin for chart inside svg
   */
  protected margin: Position = {
    top: 0,
    bottom: 0,
    right: 10,
    left: 10,
  };

  /**
   * Padding for chart inside svg on drawing
   * Important: left & right padding say where X axis start
   */
  protected padding: Position = {
    top: 130,
    bottom: 100, // include height of label row
    right: 10,
    left: 10,
  };

  private defaultWidth: number = 300;
  private defaultHeight: number = 400;

  public constructor(
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
  ) {
    this.host = D3.select(elementRef.nativeElement);
    this.heightCorrection = 0;
    this.widthCorrection = 0;
    this.labelConfig = {
      labelFontSize: 12,
      labelOffsetTop: 10,
      labelFontFamily: 'Lato',
    };
  }

  public ngOnInit(): void {
    this.initialiseSizeAndScale();
    this.buildSVG();
  }

  protected initialiseSizeAndScale() {
    const [width, height] = this.getChartDimetions();
    this.width = width - this.margin.left - this.margin.right + this.widthCorrection;

    // height
    this.height = height
      - this.margin.bottom - this.margin.top
      - this.labelConfig.labelOffsetTop - this.labelConfig.labelFontSize
      + this.heightCorrection;
  }

  protected buildSVG() {
    this.host.html('');

    this.svg = this.host.append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('padding-top', this.margin.top)
      .style('padding-bottom', this.margin.bottom)
      .style('padding-left', this.margin.left)
      .style('padding-right', this.margin.right)
  }

  /**
   * Get element container of chart
   * Used for retrieve its dimensions and use it for chart
   * @return HTMLElement
   */
  protected getElementContainer(): HTMLElement {
    return this.renderer.parentNode(this.elementRef.nativeElement);
  }

  /**
   * Get dimetion for chart.
   */
  protected getChartDimetions(): [number, number] {
    const container = this.getElementContainer();
    const clientWidth = container.clientWidth || this.defaultWidth;
    const clientHeight = container.clientHeight || this.defaultHeight;

    return [clientWidth, clientHeight];
  }
}
