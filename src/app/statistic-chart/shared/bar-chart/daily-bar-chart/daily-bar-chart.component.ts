import {
  Component, ElementRef, OnInit, Renderer2
} from '@angular/core';
import { BarChartTimeScaleComponent } from '../bar-chart-time-scale/bar-chart-time-scale.component';
import { addHours } from 'date-fns'

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

    this.barWidth = 16;
    this.countBarsInViewport = 16;
  }

  /**
   * Get start of step/bar date.
   * Depend of delimiter chart && start is 00 value
   */
  protected calcNowBarDate(): Date {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  }

  protected calcNextBarDate(from: Date): Date {
    return addHours(from, 1);
  }

  protected calcPrevBarDate(from: Date): Date {
    return addHours(from, -1);
  }

  protected viewportDateRange(): [Date, Date] {
    const from: Date = this.data[0].identity;
    return [from, addHours(from, this.countBarsInViewport - 1)];
  }

}