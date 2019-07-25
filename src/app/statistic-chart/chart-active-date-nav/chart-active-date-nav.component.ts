import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { StatisticDelimiter } from '../core';
import {
  DirectionActiveChange,
  DirectionLeft,
  DirectionRight,
  DelimiterStrategy,
} from '../shared/bar-chart/core';
import { DelimiterChartStrategyService } from '../shared/services/delimiter-chart-strategy.service';

@Component({
  selector: 'fn-chart-active-date-nav',
  templateUrl: './chart-active-date-nav.component.html',
  styleUrls: ['./chart-active-date-nav.component.scss']
})
export class ChartActiveDateNavComponent implements OnInit {

  @Input()
  public set delimiter(delimiter: StatisticDelimiter) {
    this.delimiterValue = delimiter;
    this.updateDateDelimiterStrategy();
  }
  public get delimiter(): StatisticDelimiter {
    return this.delimiterValue;
  }
  private delimiterValue: StatisticDelimiter;

  @Input()
  public set activeDate(date: Date) {
    this.activeDateValue = date;
  }
  public get activeDate(): Date {
    return this.activeDateValue;
  }
  private activeDateValue: Date;

  @Output()
  public activeDateDirectionChange: EventEmitter<DirectionActiveChange>;

  private dateDelimiterStrategy: DelimiterStrategy.DateChart;

  public constructor(
    private dateDelimiter: DelimiterChartStrategyService,
  ) {
    this.activeDateDirectionChange = new EventEmitter<DirectionActiveChange>();
    this.dateDelimiterStrategy = null;
  }

  public get dateRangeTitle(): string {
    if (this.activeDate) {
      const endDate: Date = this.dateDelimiterStrategy.calcNextBarDate(this.activeDate);

      return this.format(this.activeDate, endDate);
    }

    return null;
  }

  public ngOnInit(): void {
    // this.updateDateDelimiterStrategy();
    console.log(this.activeDate, this.delimiter)
  }

  // todo: check
  public canPrevActivate(): boolean {
    return false;
  }

  // todo: check
  public canNextActivate(): boolean {
    return false;
  }

  // todo: check
  public onClickPrevActivate(): void {
    this.activeDateDirectionChange.next(DirectionLeft);
  }

  // todo: check
  public onClickNextActivate(): void {
    this.activeDateDirectionChange.next(DirectionRight);
  }

  // todo: check
  public setActive(date: Date): void {
    this.activeDateValue = date;
  }

  private format(from: Date, to: Date): string {
    return this.dateDelimiterStrategy.formatRangeLabel(from, to);
  }

  private updateDateDelimiterStrategy(): void {
    this.dateDelimiterStrategy = this.dateDelimiter.resolveDateDelimiterStrategy(this.delimiter);
  }
}