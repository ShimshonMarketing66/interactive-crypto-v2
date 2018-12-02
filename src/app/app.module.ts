import { NgModule, ErrorHandler, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthDataProvider } from '../providers/auth-data/auth-data';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule} from '@angular/http';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { CryptoProvider } from '../providers/crypto/crypto';
import { Sim } from '@ionic-native/sim';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EducationReviewService } from '../services/education-review.service';
import { Screenshot } from '@ionic-native/screenshot';
import { SocialDataProvider } from '../providers/social-data/social-data';
import { AdMobFree } from '@ionic-native/admob-free';
import { OneSignal } from '@ionic-native/onesignal';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2';
import { TrackEventProvider } from '../providers/track-event/track-event';
import { Deeplinks } from '@ionic-native/deeplinks';
import { Market } from '@ionic-native/market';
import firebase from 'firebase';
import { ChatProvider } from '../providers/chat/chat';
import { Firebase } from '@ionic-native/firebase'
import { AppVersion } from '@ionic-native/app-version';
import { AppRate } from '@ionic-native/app-rate';



export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    MyApp,
   
  ],
  imports: [
        HttpModule,
    BrowserAnimationsModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
    }
    })
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    OneSignal,
    GoogleAnalytics,
    StatusBar,
    SplashScreen,
    AndroidPermissions,
    Sim,
    AppRate,
    InAppPurchase2,
    Screenshot,
    SocialSharing,
    AdMobFree,
    Deeplinks,
    Market,
    AppVersion,
    Firebase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthDataProvider,
    TrackEventProvider,
    CryptoProvider,
    SocialDataProvider,
    EducationReviewService,
    Facebook,
    GooglePlus,
    ChatProvider, 
  ]
})
export class AppModule {}
