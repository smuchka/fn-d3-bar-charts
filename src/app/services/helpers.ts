export function random(min, max) {
  return Math.floor(Math.random() * (+max - +min)) + +min;
}

export function getTimestamInSecond(date: Date) {
  return date.getTime() / 1000;
};