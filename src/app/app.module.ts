import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { StatisticChartModule } from './statistic-chart/statistic-chart.module';

import { StatisticHourDelimiterService } from './services/statistic-hour-delimiter.service';
import { StatisticDayDelimiterService } from './services/statistic-day-delimiter.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    StatisticChartModule,
  ],
  declarations: [
    AppComponent,
    HelloComponent
  ],
  providers: [
    StatisticHourDelimiterService,
    StatisticDayDelimiterService
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {
}
