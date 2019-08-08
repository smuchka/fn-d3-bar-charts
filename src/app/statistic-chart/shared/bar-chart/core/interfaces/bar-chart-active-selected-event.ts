import { ItemData } from './item-data';

export class BarChartActiveSelectedEvent {
  constructor(
    /** Bar item that was selected. */
    public item: ItemData,
    /** Position on X axis */
    public positionX: number,
  ) { }
}