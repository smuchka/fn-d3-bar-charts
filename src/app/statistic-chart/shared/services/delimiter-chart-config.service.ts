import { Injectable } from '@angular/core';
import { StatisticDelimiter, PlatformSize, ListChartConfig, ChartSizeConfig } from '../../core'

@Injectable()
export class DelimiterChartConfigService {

  private isMobile: boolean;
  private config: Record<PlatformSize, ListChartConfig>;

  constructor() {

    // todo: depend current platform
    this.isMobile = false;

    this.config = {
      [PlatformSize.MOBILE]: {
        [StatisticDelimiter.Hour]: { countViewport: 7, countChunk: 7, barWidth: 16 },
        [StatisticDelimiter.Day]: { countViewport: 5, countChunk: 7, barWidth: 24 },
        [StatisticDelimiter.Week]: { countViewport: 5, countChunk: 5, barWidth: 40 },
      },
      [PlatformSize.WEB]: {
        [StatisticDelimiter.Hour]: { countViewport: 16, countChunk: 24, barWidth: 16 },
        [StatisticDelimiter.Day]: { countViewport: 14, countChunk: 14, barWidth: 24 },
        [StatisticDelimiter.Week]: { countViewport: 11, countChunk: 11, barWidth: 40 },
      },
    }
  }

  public getChartConfig(delimiter: StatisticDelimiter): ChartSizeConfig {

    let config: ChartSizeConfig = this.config[this.getCurrentPlatformSize()][delimiter];

    /**
     * Set default config
     */
    if (!config) {
      config = { countViewport: 5, countChunk: 5, barWidth: 16 };
    }

    return config;
  }

  private getCurrentPlatformSize(): PlatformSize {
    return this.isMobile ? PlatformSize.MOBILE : PlatformSize.WEB;
  }

}
