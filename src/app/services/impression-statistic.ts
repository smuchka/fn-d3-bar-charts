import { ItemData } from '../statistic-chart/shared/bar-chart/core';

export interface ImpressionStatistic {
  loadStaticticByDates(d1: Date, d2: Date): ItemData[];
  getFirstChunkDateRange(): [Date, Date];
}