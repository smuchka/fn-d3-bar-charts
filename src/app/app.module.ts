import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { StatisticChartModule } from './statistic-chart/statistic-chart.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    StatisticChartModule,
  ],
  declarations: [AppComponent, HelloComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
}
