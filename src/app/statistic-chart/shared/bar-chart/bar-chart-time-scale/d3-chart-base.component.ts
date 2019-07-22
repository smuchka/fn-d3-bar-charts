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
  labelLineHeight: number;
  labelOffsetTop: number;
  labelOffsetBottom: number;
  labelFontFamily: string;
}

@Component({
  selector: 'fn-base-d3-chart',
  template: '<!--d3 create template itself-->',
})
export abstract class D3ChartBaseComponent implements OnInit {

  protected svg;

  /**
   * Height of chart region.
   * Include padding & not include margin
   */
  protected height;
  /**
   * Width of chart region.
   * Include padding & not include margin
   */
  protected width;

  // todo: check both fields - use or not used
  protected heightCorrection: number;
  protected widthCorrection: number;

  /**
   * Margin for chart inside svg
   */
  protected margin: Position = {
    top: 0,
    right: 10,
    bottom: 0,
    left: 10,
  };

  /**
   * Padding for chart inside svg. 
   * For example padding used for label spaces.
   * Important: left & right padding say where X axis start
   */
  protected padding: Position = {
    // top: 130,
    top: 0,
    right: 10,
    bottom: 0,
    left: 10,
  };

  /**
   * Label bar dimetions.
   * Adds the height of the result label to the bottom indent.
   */
  protected labelConfig: LabelConfig = {
    labelFontSize: 12,
    labelLineHeight: 14,
    labelOffsetTop: 8,
    labelOffsetBottom: 10,
    labelFontFamily: 'Lato',
  };

  /**
   * Used if unable to get the width / height of the parent node
   */
  private defaultWidth: number = 300;
  private defaultHeight: number = 400;

  protected useLabel: boolean;
  protected useYAxisValuesRound: boolean;
  private host;

  public constructor(
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
  ) {
    this.host = D3.select(elementRef.nativeElement);

    this.heightCorrection = 0;
    this.widthCorrection = 0;
    this.useLabel = true;
    this.useYAxisValuesRound = false;
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
      .style('padding-right', this.margin.right);
  }

  /**
   * Get dimetion for chart.
   */
  protected getChartDimetions(): [number, number] {
    const container = this.getElementContainer();
    console.warn(container);
    const clientWidth = container.clientWidth || this.defaultWidth;
    const clientHeight = container.clientHeight || this.defaultHeight;

    return [clientWidth, clientHeight];
  }

  /**
   * Get element container of chart
   * Used for retrieve its dimensions and use it for chart
   * @return HTMLElement
   */
  protected getElementContainer(): HTMLElement {
    return this.renderer.parentNode(this.elementRef.nativeElement);
  }

  protected getPadding(): Position {

    const labelBottomCorrection: number = this.labelConfig.labelOffsetTop + this.labelConfig.labelLineHeight + this.labelConfig.labelOffsetTop;

    return {
      top: this.padding.top,
      right: this.padding.right,
      bottom: this.padding.bottom + (this.useLabel ? labelBottomCorrection : 0),
      left: this.padding.left,
    }
  }
}
