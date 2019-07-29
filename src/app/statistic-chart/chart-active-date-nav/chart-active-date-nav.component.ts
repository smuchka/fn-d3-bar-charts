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
  public activeDate: Date;

  @Input()
  public canActivateNextDate: boolean;

  @Input()
  public canActivatePrevDate: boolean;

  @Output()
  public activeDateDirectionChange: EventEmitter<DirectionActiveChange>;

  private dateDelimiterStrategy: DelimiterStrategy.DateChart;

  public constructor(
    private dateDelimiter: DelimiterChartStrategyService,
  ) {
    this.activeDateDirectionChange = new EventEmitter<DirectionActiveChange>();
    this.dateDelimiterStrategy = null;
    this.canActivateNextDate = false;
    this.canActivatePrevDate = false;
  }

  public get dateRangeTitle(): string {
    if (this.activeDate) {
      const endDate: Date = this.dateDelimiterStrategy.calcNextBarDate(this.activeDate);

      return this.format(this.activeDate, endDate);
    }

    return null;
  }

  public ngOnInit(): void {
  }

  public onClickPrevActivate(): void {
    this.activeDateDirectionChange.next(DirectionLeft);
  }

  public onClickNextActivate(): void {
    this.activeDateDirectionChange.next(DirectionRight);
  }

  // todo: check
  public setActive(date: Date): void {
    this.activeDate = date;
  }

  private format(from: Date, to: Date): string {
    return this.dateDelimiterStrategy.formatRangeLabel(from, to);
  }

  private updateDateDelimiterStrategy(): void {
    this.dateDelimiterStrategy = this.dateDelimiter.resolveDateDelimiterStrategy(this.delimiter);
  }

  private canPrevActivate(): boolean {
    return this.canActivatePrevDate;
  }

  private canNextActivate(): boolean {
    return this.canActivateNextDate;
  }
}