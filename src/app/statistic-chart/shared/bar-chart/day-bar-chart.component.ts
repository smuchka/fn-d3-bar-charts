import {
  Component, ElementRef, OnInit, Renderer2
} from '@angular/core';
import { BarChartAbstract } from './bar-chart-abstract/bar-chart-abstract.component';
import { addDays, addHours, startOfToday } from 'date-fns'

@Component({
  selector: 'fn-daily-bar-chart',
  template: `<!--d3 create template itself-->`,
  styles: [`
    :host {
      width: 100%;
      height: 100%;
      display: flex;
    }
  `]
})
export class DayBarChartComponent extends BarChartAbstract {

  protected countBarsInViewport: number;

  public constructor(
    protected element: ElementRef,
    protected renderer: Renderer2,
  ) {
    super(element, renderer);

    this.barWidth = 24;
    this.countBarsInViewport = 14;
  }

  /**
   * Get start of step/bar date.
   * Depend of delimiter chart && start is 00 value
   */
  protected calcNowBarDate(): Date {
    return startOfToday();
  }

  protected calcNextBarDate(from: Date): Date {
    return addDays(from, 1);
  }

  protected calcPrevBarDate(from: Date): Date {
    return addDays(from, -1);
  }

  protected viewportDateRange(): [Date, Date] {
    const from: Date = this.data[0].identity;
    return [from, addDays(from, this.countBarsInViewport - 1)];
  }

}