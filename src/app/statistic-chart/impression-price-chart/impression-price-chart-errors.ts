export function getEmptyChartDelimiterError() {
  return Error('Not provided view delimiter.');
}

export function getEmptyDataError() {
  return Error('Not provided statistic data.');
}

export function getEmptyChartDateRangeError() {
  return Error('Not provided a date range for chart.');
}