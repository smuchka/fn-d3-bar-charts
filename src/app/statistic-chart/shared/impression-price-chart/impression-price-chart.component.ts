import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators'
import { HourDelimiterData, DayDelimiterData } from './core/delimiter-data';
import { ItemData } from '../bar-chart/core/interfaces/item-data';
import { DelimiterRangeData } from './core/delimiter-data';
import { ImpressionStatisticService } from './services/impression-statistic.service';
import { DayDelimiterChartComponent } from './day-delimiter-chart/day-delimiter-chart.component';
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

  @ViewChild('chart', { static: true })
  protected chart: DayDelimiterChartComponent;

  private pagginableData$: BehaviorSubject<ItemData[]>;
  public showChartData$: Observable<ItemData[]>;

  constructor(private statistic: ImpressionStatisticService) {
    this.pagginableData$ = new BehaviorSubject<ItemData[]>([]);
    this.showChartData$ = this.pagginableData$.pipe(
      filter(list => Boolean(list.length)),
    );
  }

  ngOnInit() {
    const [from, to] = this.getLastCampaignDateRange();
    const list: ItemData[] = this.statistic.loadStaticticByDates(from, to);
    this.pagginableData$.next(this.mergeStatiscticWithChunk(list));

    // TODO:
    // - make depend of Delimiter
    // - can next/prev getter
  }

  public loadMore(): void {
    if (!this.canLoadMore()) {
      return;
    }

    this.loadPrevPeriod();
  }

  /**
   * todo: make it in chart - emit event correct
   */
  public onChartEmitPetBorderEvent(e): void {
    console.log('Chart near of border!')
  }

  public onClickPrevActivate(): void {
    this.chart.goToPrevBar();
  }

  public canPrevActivate(): boolean {
    return this.chart && this.chart.canActivatePrevBar;
  }

  public onClickNextActivate(): void {
    this.chart.goToNextBar();
  }

  public canNextActivate(): boolean {
    return this.chart && this.chart.canActivateNextBar;
  }

  private loadPrevPeriod(): void {
    const date: Date = this.pagginableData$.value[0].identity;
    const [from, to] = [subHours(date, 24), subHours(date, 1)];
    const list: ItemData[] = this.statistic.loadStaticticByDates(from, to);
    this.pagginableData$.next(this.mergeStatiscticWithChunk(list))
  }

  /**
   * Must fetch dates from campaign and 
   * - get or current range of camapign (if it's in progress)
   * - or get last DelimiterRangeData
   * 
   * !!!! depend of current time Delimiter and WEB/MOBILE platform
   */
  private getLastCampaignDateRange(): [Date, Date] {
    return this.statistic.getFirstChunkDateRange();
  }

  private canLoadMore(): boolean {
    return true;
  }

  private mergeStatiscticWithChunk(chunk: ItemData[]): ItemData[] {
    return [
      ...chunk,
      ...this.pagginableData$.value,
    ]
  }
}