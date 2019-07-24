export interface DateChartStrategy {
  /**
   * Get start of step/bar date.
   * Depend of delimiter chart && start is 00 value
   */
  calcNowBarDate(): Date;

  calcNextBarDate(from: Date): Date;

  calcPrevBarDate(from: Date): Date;

  getCountBarDateInViewPort(): number;
}