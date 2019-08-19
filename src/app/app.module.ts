import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { StatisticChartModule } from './statistic-chart/statistic-chart.module';

import { StatisticHourDelimiterService } from './services/statistic-hour-delimiter.service';
import { StatisticDayDelimiterService } from './services/statistic-day-delimiter.service';
import { StatisticDelimiterService } from './services/statistic-delimiter.service';
import { StatisticWeekDelimiterService } from './services/statistic-week-delimiter.service';
import { DelimiterChartConfigService } from './services/delimiter-chart-config.service';

// TODO: only for debug - in FN use other device detection flow
import { DeviceDetectorModule } from 'ngx-device-detector';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    StatisticChartModule,
    DeviceDetectorModule.forRoot()
  ],
  declarations: [
    AppComponent,
    HelloComponent
  ],
  providers: [
    StatisticHourDelimiterService,
    StatisticDayDelimiterService,
    StatisticDelimiterService,
    StatisticWeekDelimiterService,
    DelimiterChartConfigService
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {
}
