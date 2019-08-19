import { Injectable } from '@angular/core';

import { ItemData } from '../statistic-chart/shared/bar-chart/core';
import { StatisticWeekDelimiterService } from './statistic-week-delimiter.service';
import { StatisticDayDelimiterService } from './statistic-day-delimiter.service';
import { StatisticHourDelimiterService } from './statistic-hour-delimiter.service';
import { ImpressionStatistic } from './impression-statistic';
import { StatisticDelimiter, DateRange } from '../statistic-chart/core';


@Injectable()
export class StatisticDelimiterService {

  constructor(
    private hourStatistic: StatisticHourDelimiterService,
    private dayStatistic: StatisticDayDelimiterService,
    private weekStatistic: StatisticWeekDelimiterService,
  ) { }

  /**
   * Get first chunk of date range for chart.
   * Use it for retrieving dates for firtst paggination page.
   * includeBorderValues - used for receiving full range from first second to last second of range.
   */
  public calcFirstChunkRange(
    delimiter: StatisticDelimiter,
    boundRange: DateRange,
    includeBorderValues: boolean = false,
  ): DateRange {

    let now: Date = new Date();
    let relatedDate: Date = null;

    if (now <= boundRange.to) {
      // before start OR inside range (include end)
      relatedDate = now;
    } else if (now > boundRange.to) {
      // after end
      relatedDate = boundRange.to;
    }

    if (includeBorderValues) {
      return this.source(delimiter).getRangeRelatedDate(relatedDate);
    }

    return this.source(delimiter).getRangeRelatedDateWithBorder(relatedDate);
  }

  /**
   * Get following chunk of date range for chart after 'before' date.
   * Use it for retrieving dates for 2th, 3th .... paggination pages.
   * includeBorderValues - used for receiving full range from first second to last second of range.
   */
  public calcPreviousDateRange(
    delimiter: StatisticDelimiter,
    before: Date,
    includeBorderValues: boolean = false,
  ): DateRange {

    // get date in previous bar
    const relatedDate: Date = this.source(delimiter).getPrevDateByDiffOneBar(before);

    if (includeBorderValues) {
      return this.source(delimiter).getRangeRelatedDate(relatedDate);
    }

    return this.source(delimiter).getRangeRelatedDateWithBorder(relatedDate);
  }

  /**
   * Switch source for calulation dates
   */
  private source(delimiter): StatisticHourDelimiterService | StatisticDayDelimiterService | StatisticWeekDelimiterService | null{
    switch (delimiter) {
      case StatisticDelimiter.Hour:
        return this.hourStatistic;

      case StatisticDelimiter.Day:
        return this.dayStatistic;

      case StatisticDelimiter.Week:
        return this.weekStatistic;
    }

    return null;
  }

  /**
   * Loading data from server
   */
  public loadStaticticByDates(
    delimiter: StatisticDelimiter,
    range: DateRange
  ): ItemData[] {

    // for real requerst use
    // - delimiter
    // - range.from
    // - range.to

    // todo: use for debug
    return this.source(delimiter).loadStaticticByDates(range);
  }
}
