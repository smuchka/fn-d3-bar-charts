import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fn-chart-active-date-nav',
  templateUrl: './chart-active-date-nav.component.html',
  styleUrls: ['./chart-active-date-nav.component.scss']
})
export class ChartActiveDateNavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public onClickPrevActivate(): void {
  }

  public canPrevActivate(): boolean {
    return false;
  }

  public onClickNextActivate(): void {
  }

  public canNextActivate(): boolean {
    return false;
  }

}