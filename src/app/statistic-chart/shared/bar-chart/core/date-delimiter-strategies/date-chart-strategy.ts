export interface DateChart {

  /**
   * Function for formatting date,
   * used for display bar label
   */
  formatLabel(date: Date | string): string;

  /**
   * Function for formatting date range,
   * used for display title range dates on navigation panel
   */
  formatRangeLabel(from: Date, to: Date): string;

  /**
   * Get start of step/bar date.
   * Depend of delimiter chart && start is 00 value
   */
  calcNowBarDate(): Date;

  calcNextBarDate(from: Date): Date;

  calcPrevBarDate(from: Date): Date;

  /**
   * Calculate date start/end from input dateF
   * Use for caclulation last/first date on x axis.
   */
  calcSomeDateOnDistance(date: Date, calcDateDelimiter: number): Date;
}