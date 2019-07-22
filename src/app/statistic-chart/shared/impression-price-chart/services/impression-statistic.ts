import { ItemData } from '../../bar-chart/core/interfaces/item-data';

export interface ImpressionStatistic {
  loadStaticticByDates(d1: Date, d2: Date): ItemData[];
  getFirstChunkDateRange(): [Date, Date];
}