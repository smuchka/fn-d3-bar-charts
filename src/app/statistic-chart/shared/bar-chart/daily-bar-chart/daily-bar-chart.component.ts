import {
  Component, ElementRef, OnInit, Renderer2
} from '@angular/core';
import { BarChartTimeScaleComponent } from '../bar-chart-time-scale/bar-chart-time-scale.component';
import { addDays, addHours, startOfToday } from 'date-fns'

@Component({
  selector: 'fn-daily-bar-chart',
  template: `<!--d3 create template itself-->`,
  styleUrls: ['./daily-bar-chart.component.scss']
})
export class DailyBarChartComponent extends BarChartTimeScaleComponent {

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