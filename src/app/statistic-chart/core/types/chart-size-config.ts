import { StatisticDelimiter } from '../enums/statistic-delimiter';

export type ChartSizeConfig = {
  countViewport: number;
  countChunk: number;
  barWidth: number;
}

export type ListChartConfig = Record<StatisticDelimiter, ChartSizeConfig>;
