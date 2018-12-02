import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular'
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { AuthDataProvider } from '../auth-data/auth-data';
import { Firebase } from '@ionic-native/firebase'


@Injectable()
export class TrackEventProvider {

  constructor(public http: HttpClient, public platform: Platform, public ga: GoogleAnalytics, public authData: AuthDataProvider
    , public firebase: Firebase
  ) {
    platform.ready().then(()=>{
    })
  }

  appInit() {
    console.log('TrackEventProvider -> appInit');

    if (!this.platform.is("cordova")) return;
    var googleId = this.platform.is("ios") ? 'UA-108137424-1' : 'UA-105800211-1';
    this.ga.startTrackerWithId(googleId)
      .then(() => {
        this.ga.trackEvent("open_app", "first_event");
        console.log('Google analytics is ready now');
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));


    var options = {
      devKey: 'SmETXRWQwsJVhLhWbBBfn',// your AppsFlyer devKey           
      onInstallConversionDataListener: true
    };

    if (this.platform.is('ios')) {
      options["appId"] = "1291765934";            // your ios app id in app store 
    }
    window['plugins'].appsFlyer.initSdk(options, this.onSuccess, this.onError);
    this.trackView('open_app');
  }

  trackEvent(page: string, action: string) {
    console.log('TrackEventProvider -> trackEvent',page ,action);
    if (!this.platform.is("cordova")) return;
    this.ga.trackEvent(page, action);
    console.log( this.authData.user,"a");
    if(this.authData.user)
    window['plugins'].appsFlyer.trackEvent(page, this.authData.user);
    this.firebase.logEvent(page, this.authData.user);
  }


  trackView(page: string) {
    console.log('TrackEventProvider -> trackView ' ,page);

    if (!this.platform.is("cordova")) return;
    this.ga.trackView(page);
    console.log( this.authData.user,"b");
        //  if(this.authData.user)
    // window['plugins'].appsFlyer.trackEvent(page, {"user": this.authData.user});
    // this.firebase.setScreenName(page);
  }
  onSuccess = function (result) {
    console.log("result appsflyer", result);
    if(this.authData.user)
    window['plugins'].appsFlyer.trackEvent("open_app", {"user": this.authData.user});
    // this.firebase.logEvent("open_app", this.authData.user);
  };

  onError(err) {
    console.log("result err", err);
  }

}
