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
   * Function to calculate offset index between date range according to delimiter
   * @param from Date
   * @param to Date
   * @param chunkSize number
   */
  calcOffsetIndexByRange(from: Date, to: Date, chunkSize: number): number;

  /**
   * Get start of step/bar date.
   * Depend of delimiter chart && start is 00 value
   */
  calcNowBarDate(): Date;

  calcStartBarOfDate(date: Date): Date;

  calcEndBarOfDate(date: Date): Date;

  calcNextBarDate(from: Date): Date;

  calcPrevBarDate(from: Date): Date;

  /**
   * Calculate date start/end from input dateF
   * Use for caclulation last/first date on x axis.
   */
  calcSomeDateOnDistance(date: Date, calcDateDelimiter: number): Date;
}
