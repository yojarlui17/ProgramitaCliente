import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

// GEOLOCATION IMPORT
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { HttpClientModule } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { AgmCoreModule } from "@agm/core";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDtRzYcP17LfV24Y_FFyuUA9RT5u3peXIA",
      libraries: ["Places"]
    })
  ],
  providers: [
    Geolocation,
    StatusBar,
    DatePipe,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
