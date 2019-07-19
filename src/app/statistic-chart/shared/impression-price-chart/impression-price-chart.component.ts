import { Component, OnInit } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators'
import { HourDelimiterData, DayDelimiterData } from './core/delimiter-data';
import { ItemData } from '../bar-chart/core/interfaces/item-data';
import { DelimiterRangeData } from './core/delimiter-data';
import { ImpressionStatisticService } from './services/impression-statistic.service';
import {
  format, parse,
  startOfToday, endOfToday,
  differenceInHours,
  addHours, subHours,
  subDays, addDays,
  endOfDay, startOfDay
} from 'date-fns'
import * as D3 from 'd3';

@Component({
  selector: 'fn-impression-price-chart',
  templateUrl: './impression-price-chart.component.html',
  styleUrls: ['./impression-price-chart.component.scss'],
})
export class ImpressionPriceChartComponent implements OnInit {

  private pagginableDataForHourChart$: BehaviorSubject<ItemData[]>;

  constructor(private statistic: ImpressionStatisticService) {
    this.pagginableDataForHourChart$ = new BehaviorSubject<ItemData[]>(null);
  }

  ngOnInit() {
    const [from, to] = this.getLastCampaignDateRange();
    const list: ItemData[] = this.statistic.loadStaticticByDates(from, to);
    this.pagginableDataForHourChart$.next(this.mergeStatiscticWithChunk(list));
  }

  public loadPrevPeriod(): void {
    const date: Date = this.pagginableDataForHourChart$.value[0].identity;
    const [from, to] = [subHours(date, 24), subHours(date, 1)];
    const list: ItemData[] = this.statistic.loadStaticticByDates(from, to);
    this.pagginableDataForHourChart$.next(this.mergeStatiscticWithChunk(list))
  }

  /**
   * Must fetch dates from campaign and 
   * - get or current range of camapign (if it's in progress)
   * - or get last DelimiterRangeData
   * 
   * !!!! depend of current time Delimiter and WEB/MOBILE platform
   */
  private getLastCampaignDateRange(): [Date, Date] {
    return [startOfToday(), endOfToday()];
  }

  private mergeStatiscticWithChunk(chunk: ItemData[]): ItemData[] {
    return [
      ...chunk,
      ...this.pagginableDataForHourChart$.value,
    ]
  }
}