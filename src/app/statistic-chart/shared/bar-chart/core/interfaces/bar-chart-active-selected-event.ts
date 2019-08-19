import { ItemData } from './item-data';

export class BarChartActiveSelectedEvent {

  /**
   * Offset index current item of center full items.
   * Store in % (from -100% to +100% of half all items length).
   * Used for calc position mark relate of center tooltip. 
   */
  public offsetDelta: number;

  constructor(
    /** Bar item that was selected. */
    public item: ItemData,
    /** Position on X axis */
    public positionX: number,
    /** All chart items. */
    protected allItems: ItemData[],
  ) {

    let index = this.allItems.findIndex(el => el.identity === this.item.identity);

    if (this.allItems && this.allItems.length) {
      const percent: number = Math.floor(((++index * 100) / this.allItems.length) * 100) / 100;
      this.offsetDelta = (percent - 50) * 2;
    }
  }
}