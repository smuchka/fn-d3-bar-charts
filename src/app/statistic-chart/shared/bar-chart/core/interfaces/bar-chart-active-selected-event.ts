import { ItemData } from './item-data';

export class BarChartActiveSelectedEvent {
  constructor(
    /** Bar item that was selected. */
    public item: ItemData,
    /** Position on X axis */
    public positionX: number,
    /** Help for draw tooltip position (relative left or right tooltip corner)*/
    public beforeCenterData: boolean = true, 
  ) { }
}