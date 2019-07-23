import {
  Component, ElementRef, OnInit, Renderer2
} from '@angular/core';
import { BarChartAbstract } from './bar-chart-abstract/bar-chart-abstract.component';
import { addWeeks, startOfWeek } from 'date-fns'

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
export class WeekBarChartComponent extends BarChartAbstract {

  protected countBarsInViewport: number;

  public constructor(
    protected element: ElementRef,
    protected renderer: Renderer2,
  ) {
    super(element, renderer);

    this.barWidth = 40;
    this.countBarsInViewport = 11;
  }

  /**
   * Get start of step/bar date.
   * Depend of delimiter chart && start is 00 value
   */
  protected calcNowBarDate(): Date {
    return startOfWeek(new Date(), { weekStartsOn: 1 });
  }

  protected calcNextBarDate(from: Date): Date {
    return addWeeks(from, 1);
  }

  protected calcPrevBarDate(from: Date): Date {
    return addWeeks(from, -1);
  }

  protected viewportDateRange(): [Date, Date] {
    const from: Date = this.data[0].identity;
    return [from, addWeeks(from, this.countBarsInViewport - 1)];
  }

}