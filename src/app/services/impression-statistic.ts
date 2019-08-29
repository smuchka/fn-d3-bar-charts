import { DateRange } from '../statistic-chart/core';

export interface ImpressionStatistic {

  getPrevDateByDiffOneBar(date: Date): Date;

  getRangeRelatedDate(relateDate: Date): DateRange;

  getRangeRelatedDateWithBorder(relateDate: Date): DateRange;
}
