export function getBarChartEmptyDateStrategyError() {
  return Error('Not provided a strategy for calculating dates.');
}

export function getEmptyCountBarInViewportError() {
  return Error('Not provided a count bars for chart in viewport.');
}