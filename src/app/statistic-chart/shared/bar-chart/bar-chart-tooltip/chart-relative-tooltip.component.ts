import { Component, forwardRef } from '@angular/core';
import { BarChartActiveSelectedEvent, numberWithCommas } from '../core';
import { BaseChartInstance } from './base-chart-tooltip';

const colorTooltipBg = '#ffffff';

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
    return 120;
  }

  private insideTooltipCenterPosX: number = 0;

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

    const layout = this.getLayout();

    layout
      .selectAll('.tooltipGroup')
      .remove();

    // tooltip group container
    const tooltipGroup = layout.append('g')
      .attr('class', 'tooltipGroup')

    var tooltipDef = tooltipGroup.append('defs')

    // draw defs section (mark, tooltip bg, filter shadow bg)
    this.drawSvgDefs(tooltipDef);

    // inherited from svg mark path
    const offsetMarkCentered = 25;
    // max distance moving tooltip mark [-55px; 55px] from center tooltip
    const maxOffsetFromMountPoint = 55;
    const offsetBgShadow = 10;
    // offset relate of tooltip center (position mark relate of center tooltip). 
    // Store in % (from -100% to +100% of half tooltiop width).
    let offsetRelateMountPoint = (maxOffsetFromMountPoint * event.offsetDelta) / 100;

    const beforeCenterData = event.offsetDelta < 0;
    let tooltipPosX = event.positionX - offsetRelateMountPoint;
    this.insideTooltipCenterPosX = maxOffsetFromMountPoint + offsetBgShadow;
    let tooltipPosY = 10;

    // addition offset correction - move back to mount point
    tooltipPosX -= (beforeCenterData ? 50 : 54) + offsetBgShadow

    const tooltipG = tooltipGroup.append('g')
      .attr('id', 'tooltip')
      .attr('transform', `translate(${tooltipPosX}, ${tooltipPosY})`);

    this.drawTooltipBackgroudWithShadow(tooltipG, tooltipPosX);

    // divide line
    tooltipG.append('rect')
      .attr('fill', '#DFE3EC')
      .attr('x', '8')
      .attr('y', '52')
      .attr('width', '112')
      .attr('height', '1')

    // top text area
    const impressionValue = numberWithCommas(event.item.value.toString());
    this.drawTooltipContentTop(tooltipG, impressionValue);

    // bottom text area
    const amount = Math.floor((event.item.external.amount || 0) * 100) / 100;
    const amountValue = numberWithCommas(amount.toString());
    this.drawTooltipContentBottom(tooltipG, `\$ ${amountValue}`);

    // tooltip mark
    const tDefaultMarkPosY = 108.921534;
    const tooltipMarkG = tooltipG.append('g')
      .attr('id', 'bg-mark')
      .call(
        this.magicTransform.bind(this),
        0,
        tDefaultMarkPosY,
        offsetMarkCentered + offsetRelateMountPoint
      )
      .append('g')

    // tooltip mark bg shadow
    tooltipMarkG.append('use')
      .attr('fill', 'black')
      .attr('fill-opacity', '1')
      .attr('filter', 'url(#filter-shadow-mark)')
      .attr('xlink:href', '#tooltip_mark_path');

    // tooltip mark bg white
    tooltipMarkG.append('use')
      .attr('fill', colorTooltipBg)
      .attr('xlink:href', '#tooltip_mark_path');
  }

  private drawSvgDefs(layout: any): void {

    layout.append('path')
      .attr('id', 'tooltip_path')
      .attr('d', 'M4,-2.72848411e-12 L124,-2.72848411e-12 C126.209139,-2.72848411e-12 128,1.94582363 128,4.15693243 L128,101.153366 C128,103.364475 126.209139,105.156932 124,105.156932 L4,105.156932 C1.790861,105.156932 0,103.364475 0,101.153366 L0,4.00356665 C0,1.79245784 1.790861,-2.72848411e-12 4,-2.72848411e-12 Z');

    layout.append('path')
      .attr('id', 'tooltip_mark_path')
      .attr('d', 'M28,112.843068 L35.2810568,105.305204 C35.6649327,104.907789 36.2980074,104.89709 36.6950688,105.281308 C36.7031607,105.289138 36.71112,105.297105 36.7189432,105.305204 L44,112.843068 L28,112.843068 Z');

    const createFilterShadow = (defs: any, idFilter: string, deviation: number = 8) => {
      const filterShadowBg = defs.append('filter').attr('id', idFilter);
      filterShadowBg.append('feOffset')
        .attr('in', 'SourceAlpha').attr('result', 'shadowOffsetOuter1')
        .attr('dx', 0)
        .attr('dy', 0);
      filterShadowBg.append('feGaussianBlur')
        .attr('in', 'shadowOffsetOuter1').attr('result', 'shadowBlurOuter1')
        .attr('stdDeviation', deviation);
      filterShadowBg.append('feColorMatrix')
        .attr('in', 'shadowBlurOuter1')
        .attr('values', '0 0 0 0 0.0117647059   0 0 0 0 0.0117647059   0 0 0 0 0.0117647059  0 0 0 0.1 0')
        .attr('type', 'matrix');
    }

    createFilterShadow(layout, 'filter-shadow-bg', 8);
    createFilterShadow(layout, 'filter-shadow-mark', 16);
  }

  private drawTooltipBackgroudWithShadow(layout: any, positionXAxis: number): void {

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
      .attr('fill', colorTooltipBg)
      .attr('xlink:href', '#tooltip_path');
  }

  private drawTooltipContentTop(layout: any, value: string): void {
    layout.append('text')
      .attr('fill', '#292A31')
      .attr('font-family', 'Lato-Regular, Lato')
      .attr('font-size', '16')
      .attr('font-weight', 'normal')
      .attr('line-spacing', '24')

      .append('tspan')
      .attr('text-anchor', 'middle')
      .attr('x', this.insideTooltipCenterPosX)
      .attr('y', '40')
      .text(value)

    layout.append('text')
      .attr('fill', '#969DAD')
      .attr('font-family', 'Lato-Regular, Lato')
      .attr('font-size', '12')
      .attr('font-weight', 'normal')
      .attr('line-spacing', '16')

      .append('tspan')
      .attr('text-anchor', 'middle')
      .attr('x', this.insideTooltipCenterPosX)
      .attr('y', '20')
      .text('Impression')
  }

  private drawTooltipContentBottom(layout: any, value: string): void {
    layout.append('text')
      .attr('fill', '#292A31')
      .attr('font-family', 'Lato-Regular, Lato')
      .attr('font-size', '16')
      .attr('font-weight', 'normal')
      .attr('line-spacing', '24')

      .append('tspan')
      .attr('text-anchor', 'middle')
      .attr('x', this.insideTooltipCenterPosX)
      .attr('y', '89')
      .text(value)

    layout.append('text')
      .attr('fill', '#969DAD')
      .attr('font-family', 'Lato-Regular, Lato')
      .attr('font-size', '12')
      .attr('font-weight', 'normal')
      .attr('line-spacing', '16')

      .append('tspan')
      .attr('text-anchor', 'middle')
      .attr('x', this.insideTooltipCenterPosX)
      .attr('y', '69')
      .text('Amount spent');
  }

  private magicTransform(selection: any, sizeX, sizeY, offsetX = 0, offsetY = 0) {
    return selection.attr('transform', `translate(${sizeX + offsetX}, ${sizeY + offsetY}) scale(1, -1) translate(${-1 * (sizeX)}, ${-1 * sizeY})`)
  }
}
