import { StatisticDelimiter } from './statistic-delimiter-data';

export type ChartSizeConfig = {
  countViewport: number;
  countChunk: number;
  barWidth: number;
}

export type ListChartConfig = Record<StatisticDelimiter, ChartSizeConfig>;