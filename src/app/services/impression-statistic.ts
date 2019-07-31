import { ItemData } from '../statistic-chart/shared/bar-chart/core';
import { StatisticDelimiter, DateRange } from '../statistic-chart/core';

export interface ImpressionStatistic {

  /**
   * Method can get statisctic data (if exist) for current dates range
   */
  loadStaticticByDates(d1: Date, d2: Date): ItemData[];

  /**
   * Calculate nice first date range for campaignDates range
   * - depends of delimiter and platform (in general depends of config)
   */
  getFirstChunkDateRange(delimiter: StatisticDelimiter, campaignStart: Date, campaignEnd: Date): DateRange;

  /**
   * Calculate chunk date range previous date 'before'.
   * Calculate previous chunk date range.
   * - depends of delimiter and platform (in general depends of config)
   */
  calcPreviousDateRange(delimiter: StatisticDelimiter, before: Date): DateRange;
}