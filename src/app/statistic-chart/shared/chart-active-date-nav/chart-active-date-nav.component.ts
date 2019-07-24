import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  DirectionActiveChange,
  DirectionLeft,
  DirectionRight
} from '../bar-chart/core/types/direction-active-change';

@Component({
  selector: 'fn-chart-active-date-nav',
  templateUrl: './chart-active-date-nav.component.html',
  styleUrls: ['./chart-active-date-nav.component.scss']
})
export class ChartActiveDateNavComponent implements OnInit {

  public set activeDate(date: Date) {
    this.activeDateValue = date;
  }
  public get activeDate(): Date {
    return this.activeDateValue;
  }
  private activeDateValue: Date;

  @Output()
  public activeDateDirectionChange: EventEmitter<DirectionActiveChange>;

  constructor() {
    this.activeDateDirectionChange = new EventEmitter<DirectionActiveChange>();
  }

  ngOnInit() {
  }

  public canPrevActivate(): boolean {
    return false;
  }

  public canNextActivate(): boolean {
    return false;
  }

  public onClickPrevActivate(): void {
    this.activeDateDirectionChange.next(DirectionLeft);
  }

  public onClickNextActivate(): void {
    this.activeDateDirectionChange.next(DirectionRight);
  }

  public setActive(date: Date): void {
    this.activeDateValue = date;
  }

}