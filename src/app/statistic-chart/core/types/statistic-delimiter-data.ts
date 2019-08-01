export interface StatisticData {
  views: number;
  cost: number;
  year: string;
  month: string;
  day: string;
  hour: string;
  week: string;
}

export type WeekDelimiterData = Pick<StatisticData, 'views' | 'cost' | 'year' | 'month' | 'week' | 'day'>;
export type DayDelimiterData = Pick<StatisticData, 'views' | 'cost' | 'year' | 'month' | 'day'>;
export type HourDelimiterData = Pick<StatisticData, 'views' | 'cost' | 'year' | 'month' | 'day' | 'hour'>;
