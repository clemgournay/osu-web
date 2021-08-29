import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SelectModule } from '@views/select/select.module';
import { PlayModule } from '@views/play/play.module';
import { BeatmapsModule } from '@views/beatmaps/beatmaps.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    SelectModule,
    PlayModule,
    BeatmapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
