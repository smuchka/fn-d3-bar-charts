import { Component, OnInit } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { filter, tap } from 'rxjs/operators'
import { StatisticHourDelimiterService } from './services/statistic-hour-delimiter.service';
import { ItemData } from './statistic-chart/shared/bar-chart/core';
import { StatisticDelimiter } from './statistic-chart/core';
import {
  subHours,
} from 'date-fns'

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private pagginableData$: BehaviorSubject<ItemData[]>;
  private showChartData$: Observable<ItemData[]>;

  private showDelimiter: StatisticDelimiter = StatisticDelimiter.Hour;
  public delimitersItems = [
    StatisticDelimiter.Hour,
    StatisticDelimiter.Day,
    StatisticDelimiter.Week
  ];

  public constructor(
    // private statistic: StatisticDayDelimiterService,
    private statistic: StatisticHourDelimiterService,
  ) {
    this.pagginableData$ = new BehaviorSubject<ItemData[]>([]);
    this.showChartData$ = this.pagginableData$.pipe(
      filter(list => Boolean(list.length)),
    );
  }

  public ngOnInit(): void {
    this.loadFirstPeriod();
  }

  public onChangeDelimiter(delimiter: StatisticDelimiter): void {
    // this.pagginableData$.next([])
    // this.loadFirstPeriod();
    // console.warn(this.)
  }

  public loadMore(): void {
    if (!this.canLoadMore()) {
      return;
    }

    this.loadPrevPeriod();
  }

  private canLoadMore(): boolean {
    return true;
  }

  private loadFirstPeriod(): void {
    const [from, to] = this.getLastCampaignDateRange();
    const list: ItemData[] = this.statistic.loadStaticticByDates(from, to);
    const mergedList: ItemData[] = this.mergeStatiscticWithChunk(list);
    this.pagginableData$.next(mergedList);
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

  private mergeStatiscticWithChunk(chunk: ItemData[]): ItemData[] {
    return [
      ...chunk,
      ...this.pagginableData$.value || [],
    ]
  }

  ///
  public onClickPrevActivate(): void {
    // this.chart.goToPrevBar();
  }

  public canPrevActivate(): boolean {
    return false;
    // return this.chart && this.chart.canActivatePrevBar;
  }

  public onClickNextActivate(): void {
    // this.chart.goToNextBar();
  }

  public canNextActivate(): boolean {
    return false;
    // return this.chart && this.chart.canActivateNextBar;
  }
}
