import { Component, ElementRef, Renderer2 } from '@angular/core';
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
  styles: [],
})
export class BaseD3ChartComponent {

  protected svg;
  protected height;
  protected width;
  protected host;

  protected margin: Position = {
    top: 20,
    bottom: 10,
    right: 20,
    left: 20,
  };

  protected padding: Position = {
      top: 0,
      bottom: 50,
      right: 0,
      left: 0,
    };

  public constructor(
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
  ) {
    this.host = D3.select(elementRef.nativeElement);

  }

  protected initialiseSizeAndScale() {
    const container = this.getParentElement();
    const clientWidth = container.clientWidth;
    const clientHeight = container.clientHeight;
    this.width = clientWidth - this.margin.left - this.margin.right;
    this.height = clientHeight - this.margin.bottom - this.margin.top;

    // console.warn(
    //   'Init dimensions:',
    //   this.width,
    //   this.height,
    //   JSON.stringify(this.padding),
    //   'Parent: ', container,
    //   container.clientWidth,
    //   container.clientHeight,
    // );
  }

  protected buildSVG() {
    this.host.html('');
    this.svg = this.host.append('svg')
      .attr('width', this.width)
      // .attr('width', '100%')
      .attr('height', this.height)
      .style('padding-top', this.margin.top)
      .style('padding-bottom', this.margin.bottom)
      .style('padding-left', this.margin.left)
      .style('padding-right', this.margin.right)
      .style('background-color', '#6ecc9e');
  }

  /**
   * Get element container of chip list
   * @return HTMLElement
   */
  private getParentElement(): HTMLElement {
    return this.renderer.parentNode(this.elementRef.nativeElement);
  }
}
