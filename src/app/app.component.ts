import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators'
import { StatisticDelimiterService } from './services/statistic-delimiter.service';
import { ItemData, PaginationEvent } from './statistic-chart/shared/bar-chart/core';
import { StatisticDelimiter, DateRange } from './statistic-chart/core';
import { subDays, subWeeks, startOfHour } from 'date-fns';

// TODO: only for debug - in FN use other device detection flow
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private pagginableData$: BehaviorSubject<ItemData[]>;
  private dateRange: DateRange;
  private showChartData$: Observable<ItemData[]>;
  private showForDelimiter: StatisticDelimiter = StatisticDelimiter.Hour;

  private campaignStart: Date;
  private campaignEnd: Date;

  public delimitersItems = [
    StatisticDelimiter.Hour,
    StatisticDelimiter.Day,
    StatisticDelimiter.Week
  ];

  // TODO: Detect it by DeviceDetectorService in FNSocial
  public isMobile = null;

  public constructor(
    private deviceService: DeviceDetectorService,
    private statistic: StatisticDelimiterService,
  ) {
    this.pagginableData$ = new BehaviorSubject<ItemData[]>([]);
    this.showChartData$ = this.pagginableData$.pipe(
      filter(list => Boolean(list.length)),
    );
    this.campaignEnd = subDays(new Date(), 3);
    this.campaignStart = subWeeks(this.campaignEnd, 4);
    this.isMobile = this.deviceService.isMobile();
  }

  public ngOnInit(): void {
    this.loadFirstPeriod();
  }

  public onChangeDelimiter(delimiter: StatisticDelimiter): void {
    this.loadFirstPeriod();
  }

  private loadFirstPeriod(): void {
    const onlyStartBarDateRange: boolean = true;

    this.dateRange = this.statistic.calcFirstChunkRange(
      this.showForDelimiter,
      { from: this.campaignStart, to: this.campaignEnd },
      onlyStartBarDateRange
    );
    const range: DateRange = this.statistic.calcFirstChunkRange(
      this.showForDelimiter,
      { from: this.campaignStart, to: this.campaignEnd, },
      !onlyStartBarDateRange
    );

    const list: ItemData[] = this.statistic.loadStaticticByDates(this.showForDelimiter, range);
    const mergedList: ItemData[] = this.mergeStatisticWithChunk(list);
    this.pagginableData$.next(mergedList);
  }

  private loadPrevPeriod(date: Date): void {
    const onlyStartBarDateRange: boolean = true;
    const previousDateRange = this.statistic.calcPreviousDateRange(
      this.showForDelimiter,
      date,
      onlyStartBarDateRange,
    );

    this.dateRange = {
      from: previousDateRange.from,
      to: startOfHour(this.campaignEnd),
    };

    const range: DateRange = this.statistic.calcPreviousDateRange(
      this.showForDelimiter,
      date,
      onlyStartBarDateRange
    );

    const list: ItemData[] = this.statistic.loadStaticticByDates(this.showForDelimiter, range);
    const mergedList: ItemData[] = this.mergeStatisticWithChunk(list);
    this.pagginableData$.next(mergedList)
  }

  private mergeStatisticWithChunk(chunk: ItemData[]): ItemData[] {
    return [
      ...chunk,
      ...this.pagginableData$.value || [],
    ]
  }
}
