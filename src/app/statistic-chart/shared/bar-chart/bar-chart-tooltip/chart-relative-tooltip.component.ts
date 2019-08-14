import { Component, forwardRef } from '@angular/core';
import { BarChartActiveSelectedEvent } from '../core';

import { ChartStaticTooltipComponent } from './chart-static-tooltip.component';
import { BaseChartInstance } from './base-chart-tooltip';

const colorTooltip = '#ffffff';
// const colorTooltip = '#eee';

@Component({
  selector: 'fn-relative-tooltip',
  template: `<!--d3 create template itself-->`,
  styles: [],
  providers: [
    {
      provide: BaseChartInstance,
      useExisting: forwardRef(() => ChartRelativeTooltipComponent),
    },
  ],
})
export class ChartRelativeTooltipComponent extends BaseChartInstance {

  public get correctionHeight(): number {
    return 130;
  }

  public getLayout(): any {

    if (!this.chart) {
      return null;
    }

    return this.chart.getLayoutPanning();
  }

  public draw(event: BarChartActiveSelectedEvent): void {

    if (!this.chart) {
      return;
    }

    const left = 0;
    const top = 0;
    const padding = {
      top: 24,
      right: 10,
      bottom: 24,
      left: 10,
    };

    const layout = this.getLayout();

    layout
      .selectAll('.tooltipGroup')
      .remove();

    const fullWidth = this.chart.getWidth();
    const centerXAxis = fullWidth / 2;
    const tooltipHeight = 52;
    const offsetToDivideLine = 24;

    // 


    // tooltip group container
    const tooltipGroup = layout.append('g')
      .attr('class', 'tooltipGroup')

    var tooltipDef = tooltipGroup.append('defs')

    tooltipDef.append('path').attr('id', 'tooltip_path')
      .attr('d', 'M4,-2.72848411e-12 L124,-2.72848411e-12 C126.209139,-2.72848411e-12 128,1.94582363 128,4.15693243 L128,101.153366 C128,103.364475 126.209139,105.156932 124,105.156932 L4,105.156932 C1.790861,105.156932 0,103.364475 0,101.153366 L0,4.00356665 C0,1.79245784 1.790861,-2.72848411e-12 4,-2.72848411e-12 Z');

    tooltipDef.append('path').attr('id', 'tooltip_mark_path')
      .attr('d', 'M28,112.843068 L35.2810568,105.305204 C35.6649327,104.907789 36.2980074,104.89709 36.6950688,105.281308 C36.7031607,105.289138 36.71112,105.297105 36.7189432,105.305204 L44,112.843068 L28,112.843068 Z');

    const filterShadowBg = tooltipDef.append('filter').attr('id', 'filter-shadow-bg');
    filterShadowBg.append('feOffset')
      .attr('in', 'SourceAlpha').attr('result', 'shadowOffsetOuter1')
      .attr('dx', 0)
      .attr('dy', 0);
    filterShadowBg.append('feGaussianBlur')
      .attr('in', 'shadowOffsetOuter1').attr('result', 'shadowBlurOuter1')
      .attr('stdDeviation', '8');
    filterShadowBg.append('feColorMatrix')
      .attr('in', 'shadowBlurOuter1')
      .attr('values', '0 0 0 0 0.0117647059   0 0 0 0 0.0117647059   0 0 0 0 0.0117647059  0 0 0 0.1 0')
      .attr('type', 'matrix');

    // // // // // // // // // // // // // // // // // // // // // 
    // // //  DEBUG .... 
    // // // // // // // // // // // // // // // // // // // // // 

    tooltipGroup.selectAll("circle")
      .data([[event.positionX, 140, 1]]).enter()
      .append("circle")
      .attr("cx", function (d) { return d[0] })
      .attr("cy", function (d) { return d[1] })
      .attr("r", function (d) { return d[2] })
      .style("fill", "steelblue")

    // // // // // // // // // // // // // // // // // // // // // 
    // // // // // // // // // // // // // // // // // // // // // 

    let tooltipPosX = 0;
    let directionScaled = 0;
    const centerOffset = 28;
    let offsetMountPointX = 0;

    if (event.beforeCenterData) {
      // min -50
      directionScaled = -50;
      offsetMountPointX = -50;
      tooltipPosX = event.positionX + directionScaled - offsetMountPointX;
      tooltipPosX -= 13;
    } else {
      // max +50
      directionScaled = 0;
      offsetMountPointX = 50;
      tooltipPosX = event.positionX + directionScaled - offsetMountPointX;
      tooltipPosX -= 65;
    }
    console.warn(tooltipPosX, event.beforeCenterData);

    const tooltipG = tooltipGroup.append('g')
      .attr('id', 'tooltip')
      .attr('transform', `translate(${tooltipPosX}, 16.000000)`);

    this.drawTooltipBackgroudWithShadow(tooltipG, tooltipPosX);

    // divide line
    tooltipG.append('rect')
      .attr('fill', '#DFE3EC')
      .attr('x', '8')
      .attr('y', '52')
      .attr('width', '112')
      .attr('height', '1')

    // top text area
    this.drawTooltipContentTop(tooltipG);

    // bottom text area
    this.drawTooltipContentBottom(tooltipG);

    // tooltip mark
    // const tDefaultMarkPosX = tooltipPosX;
    const tDefaultMarkPosY = 108.921534;
    const tooltipMarkG = tooltipG.append('g')
      .attr('id', 'bg-mark')
      .call(this.magicTransform.bind(this), 0, tDefaultMarkPosY, centerOffset + offsetMountPointX)
      // .call(this.magicTransform.bind(this), tDefaultMarkPosX, tDefaultMarkPosY, -24)
      .append('g')

    // tooltip mark bg shadow
    tooltipMarkG.append('use')
      .attr('fill', 'black')
      .attr('fill-opacity', '1')
      .attr('filter', 'url(#filter-shadow-bg)')
      .attr('xlink:href', '#tooltip_mark_path');

    // tooltip mark bg white
    tooltipMarkG.append('use')
      .attr('fill', colorTooltip)
      .attr('xlink:href', '#tooltip_mark_path');

  }

  private drawTooltipBackgroudWithShadow(layout, positionXAxis: number): void {

    // background
    const tooltipBackgroundG = layout.append('g')
      .attr('id', 'bg-layout')
      .attr('fill-rule', 'nonzero')
      .call(this.magicTransform.bind(this), positionXAxis + 64.0, 52.578466)

    // bg shadow
    tooltipBackgroundG.append('use')
      .attr('fill', 'black')
      .attr('fill-opacity', '1')
      .attr('filter', 'url(#filter-shadow-bg)')
      .attr('xlink:href', '#tooltip_path');

    // bg white
    tooltipBackgroundG.append('use')
      .attr('fill', colorTooltip)
      .attr('xlink:href', '#tooltip_path');
  }

  private drawTooltipContentTop(layout): void {
    layout.append('text')
      .attr('fill', '#292A31')
      .attr('font-family', 'Lato-Regular, Lato')
      .attr('font-size', '16')
      .attr('font-weight', 'normal')
      .attr('line-spacing', '24')

      .append('tspan')
      .attr('x', '44.244')
      .attr('y', '40')
      .text('9,678')

    layout.append('text')
      .attr('fill', '#969DAD')
      .attr('font-family', 'Lato-Regular, Lato')
      .attr('font-size', '12')
      .attr('font-weight', 'normal')
      .attr('line-spacing', '16')

      .append('tspan')
      .attr('x', '35.442')
      .attr('y', '20')
      .text('Impression')
  }

  private drawTooltipContentBottom(layout): void {
    layout.append('text')
      .attr('fill', '#292A31')
      .attr('font-family', 'Lato-Regular, Lato')
      .attr('font-size', '16')
      .attr('font-weight', 'normal')
      .attr('line-spacing', '24')

      .append('tspan')
      .attr('x', '39.104')
      .attr('y', '89')
      .text('$16.86')

    layout.append('text')
      .attr('fill', '#969DAD')
      .attr('font-family', 'Lato-Regular, Lato')
      .attr('font-size', '12')
      .attr('font-weight', 'normal')
      .attr('line-spacing', '16')

      .append('tspan')
      .attr('x', '27.456')
      .attr('y', '69')
      .text('Amount spent');
  }

  private magicTransform(selection, sizeX, sizeY, offsetX = 0, offsetY = 0) {
    return selection.attr('transform', `translate(${sizeX + offsetX}, ${sizeY + offsetY}) scale(1, -1) translate(${-1 * (sizeX)}, ${-1 * sizeY})`)
  }
}
