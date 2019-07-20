import { HourDelimiterData, StatisticData } from '../core/delimiter-data';

export const hoursMock: HourDelimiterData[] = (<StatisticData[]>[
  // 18
  // {
  //   views: 640,
  //   cost: 130.0298,
  //   day: '18',
  //   month: '7',
  //   year: '2019',
  //   hour: '2',
  //   week: null,
  // },
  // {
  //   views: 500,
  //   cost: 12.1090,
  //   day: '18',
  //   month: '7',
  //   year: '2019',
  //   hour: '4',
  //   week: null,
  // },
  // {
  //   views: 423,
  //   cost: 130.0298,
  //   day: '18',
  //   month: '7',
  //   year: '2019',
  //   hour: '5',
  //   week: null,
  // },

  // 19
  // {
  //   views: 140,
  //   cost: 130.0298,
  //   day: '19',
  //   month: '7',
  //   year: '2019',
  //   hour: '2',
  //   week: null,
  // },
  // {
  //   views: 500,
  //   cost: 12.1090,
  //   day: '19',
  //   month: '7',
  //   year: '2019',
  //   hour: '4',
  //   week: null,
  // },
  // {
  //   views: 423,
  //   cost: 130.0298,
  //   day: '19',
  //   month: '7',
  //   year: '2019',
  //   hour: '5',
  //   week: null,
  // },


  // 20
  {
    views: 40,
    cost: 130.0298,
    day: '20',
    month: '7',
    year: '2019',
    hour: '2',
    week: null,
  },
  {
    views: 500,
    cost: 12.1090,
    day: '20',
    month: '7',
    year: '2019',
    hour: '4',
    week: null,
  },
  {
    views: random(10, 500),
    cost: 130.0298,
    day: '20',
    month: '7',
    year: '2019',
    hour: '5',
    week: null,
  },
  {
    views: random(10, 423),
    cost: 130.0298,
    day: '20',
    month: '7',
    year: '2019',
    hour: '11',
    week: null,
  },
  {
    views: 300,
    cost: 130.0298,
    day: '20',
    month: '7',
    year: '2019',
    hour: '12',
    week: null,
  },
]);

function random(min, max) {
  return Math.floor(Math.random() * (+max - +min)) + +min;
}