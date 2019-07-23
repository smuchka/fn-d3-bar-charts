import { ItemData } from '../../bar-chart/core/interfaces/item-data';

export interface StatisticData {
  views: number;
  cost: number;
  year: string;
  month: string;
  day: string;
  hour: string;
  week: string;
}

export type WeekDelimiterData = Pick<StatisticData, 'views' | 'cost' | 'year' | 'month' | 'week'>;
export type DayDelimiterData = Pick<StatisticData, 'views' | 'cost' | 'year' | 'month' | 'day'>;
export type HourDelimiterData = Pick<StatisticData, 'views' | 'cost' | 'year' | 'month' | 'day' | 'hour'>;

export enum StatisticDelimiter {
  Hour = 'Hour',
  Day = 'Day',
  Week = 'Week',
}