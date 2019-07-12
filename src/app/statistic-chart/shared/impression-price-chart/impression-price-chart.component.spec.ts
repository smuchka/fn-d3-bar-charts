import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpressionPriceChartComponent } from './impression-price-chart.component';

describe('ImpressionPriceChartComponent', () => {
  let component: ImpressionPriceChartComponent;
  let fixture: ComponentFixture<ImpressionPriceChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpressionPriceChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpressionPriceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
