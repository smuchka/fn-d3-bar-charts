import { Component, ElementRef, Renderer2 } from '@angular/core';
import * as D3 from 'd3';

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

  protected margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  protected padding = 40;

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

    console.warn(
      'Init dimensions:',
      this.width,
      this.height,
      JSON.stringify(this.margin),
      'Parent: ', container,
      container.clientWidth,
      container.clientHeight,
    );
  }

  protected buildSVG() {
    this.host.html('');
    this.svg = this.host.append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('padding-top', this.padding - 10)
      .style('padding-left', this.padding)
      .style('padding-bottom', this.padding)
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
