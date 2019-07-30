import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { filter, tap } from 'rxjs/operators'

import { StatisticDelimiterService } from './services/statistic-delimiter.service';
import { ItemData } from './statistic-chart/shared/bar-chart/core';
import { StatisticDelimiter } from './statistic-chart/core';
import {
  format, parse,
  startOfToday, endOfToday,
  differenceInHours,
  addHours, subHours,
  subDays, addDays,
  endOfDay, startOfDay
} from 'date-fns'

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private pagginableData$: BehaviorSubject<ItemData[]>;
  private dateRange: [Date, Date];
  private showChartData$: Observable<ItemData[]>;
  private showDelimiter: StatisticDelimiter = StatisticDelimiter.Day;

  public delimitersItems = [
    StatisticDelimiter.Hour,
    StatisticDelimiter.Day,
    StatisticDelimiter.Week
  ]

  public constructor(
    private statistic: StatisticDelimiterService,
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
    this.loadFirstPeriod();
  }

  private loadFirstPeriod(): void {
    const [from, to] = this.dateRange = [
      subHours(startOfToday(), 0),
      subHours(endOfToday(), 0)
    ];

    const list: ItemData[] = this.statistic.loadStaticticByDates(this.showDelimiter, from, to);
    const mergedList: ItemData[] = this.mergeStatiscticWithChunk(list);
    this.pagginableData$.next(mergedList);
  }

  private loadPrevPeriod(): void {
    const date: Date = this.dateRange[0];
    const [from, to] = [subHours(date, 24), subHours(date, 1)];
    this.dateRange = [from, this.dateRange[1]];

    const list: ItemData[] = this.statistic.loadStaticticByDates(this.showDelimiter, from, to);
    this.pagginableData$.next(this.mergeStatiscticWithChunk(list))
  }

  private mergeStatiscticWithChunk(chunk: ItemData[]): ItemData[] {
    return [
      ...chunk,
      ...this.pagginableData$.value || [],
    ]
  }
}
