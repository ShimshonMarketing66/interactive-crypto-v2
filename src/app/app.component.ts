import { Component, ViewChild } from '@angular/core';
import { Platform , Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AdMobFreeBannerConfig, AdMobFree, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
import { TabsPage } from '../pages/tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';
import { AuthDataProvider } from '../providers/auth-data/auth-data';
import { Profile } from '../models/profile-model';
import { OneSignal } from '@ionic-native/onesignal';
import { Deeplinks } from '@ionic-native/deeplinks';
import { HttpClient } from '../../node_modules/@angular/common/http';
import { AppVersion } from '../../node_modules/@ionic-native/app-version';
import { TrackEventProvider } from '../providers/track-event/track-event';

declare var require: any;


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  isFirsTime: boolean=true;
  rootPage: any = "";

  constructor(
    public oneSignal: OneSignal,
    public platform: Platform,
    public translate: TranslateService,
    public statusBar: StatusBar,
    private admobFree: AdMobFree,
    private admobFree2: AdMobFree,
    public authData: AuthDataProvider,
    public http: HttpClient,
    public trackEvent: TrackEventProvider,
    public appVersion: AppVersion,
    public splashScreen: SplashScreen) {
    translate.setDefaultLang('en');

      // firebase.auth().onAuthStateChanged(user => {  
 

      platform.ready().then(() => {
        let plt;
        if (!platform.is("cordova")) {
          this.initialize();
          return;
        }
        else
          if (platform.is("ios"))
            plt = "ios";
          else if (platform.is("android"))
            plt = "android";
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.http.get("https://afternoon-mountain-15657.herokuapp.com/api/versionToUpdate/" + plt).toPromise()
      .then((version) => {
        var compareVersions = require('compare-versions')
        appVersion.getVersionNumber().then((ver) => {
          var a = compareVersions(ver, (version).toString());
          if (a == -1) {
            this.rootPage = "update-app";
          } else {
            this.initialize();
          }
        })
      })
      .catch((err) => {
        console.log(err);

        this.rootPage = "server-error";
      })
    // });

    


    if (!this.platform.is('cordova')) return

    // var options = {
    //   devKey: 'SmETXRWQwsJVhLhWbBBfn'// your AppsFlyer devKey               
    // };

    // if (this.platform.is('ios')) {
    //   options["appId"] = "1291765934";            // your ios app id in app store 
    // }

    // window['plugins'].appsFlyer.initSdk(options);
    
    this.oneSignal.startInit('5a9c7a10-76f6-43f0-87c6-7ce90cd2117c', '783700927099');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
    });

    this.oneSignal.endInit();
  //  var x=this.oneSignal.getIds()["__zone_symbol__value"]["userId"]
  //  if(this.authData.user._id && !this.authData.user.notificationId)
  
  this.alreadyUser()
  });
  }
  
alreadyUser(){
  if (!this.platform.is('cordova')) return

  const bannerConfig: AdMobFreeBannerConfig = {
    // add your config here
    // for the sake of this example we will just use the test config
    isTesting: false,
        autoShow: true,
    id: this.platform.is("ios") ? "ca-app-pub-7144298839495795/5755948624" : "ca-app-pub-7144298839495795/5755948624"
  };
  const bannerConfig2: AdMobFreeInterstitialConfig = {
    // add your config here
    // for the sake of this example we will just use the test config
    isTesting: false,
    autoShow: true,
    id: this.platform.is("ios") ? 'ca-app-pub-7144298839495795/9697819798' : 'ca-app-pub-7144298839495795/8900986715'
  };
 
  if(this.authData.user.state != "approved"){

    this.admobFree.banner.config(bannerConfig);
    this.admobFree2.interstitial.config(bannerConfig2);
    this.admobFree.banner.prepare()
    this.admobFree2.interstitial.prepare().then(() => {
      console.log("aviho");
    })
      .catch(e => console.log(e));
    setTimeout(() => {
      if (this.authData.user.state != 'approved') {
        // 
        console.log(".user.state != 'approved");
        
        this.admobFree2.interstitial.show()
        setTimeout(() => {
          this.admobFree.banner.show()
        }, 10000);
      
      }
    }, 7500);
    }
  }
    initialize(){
      this.trackEvent.appInit();
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
 if( this.isFirsTime){
          this.authData.checkIfUserExistAlready(user.uid)
            .then((userFromServer: Profile) => {              
              if (userFromServer == null)
                this.navCtrl.setRoot("onboarding")
              else {
                if (userFromServer.is_phone_number_verified){
                  console.log("tabs");
                  // this.alreadyUser()
                  this.rootPage="tabs";
                  this.isFirsTime = false;
                   if(!userFromServer.notificationId)
              this.authData.updatenotificationId()
              if(userFromServer.countryData.city)
              this.authData.updatecountryData()
              if (!this.platform.is("ios")) {
                this.authData.initializeStore()
              }              if(this.authData.user["isAlvexo"] == true)
              this.authData.user.state = 'approved';

                }
                else{
                  console.log("c");
                  this.navCtrl.setRoot("phone-number-verified")

                }

                }

            })
       } } else {
        this.isFirsTime = false;
        this.rootPage = "onboarding";
       
              }
        // this.isFirsTime = false;

      })
      setTimeout(() => {
        if( this.isFirsTime){
        this.navCtrl.setRoot("tabs");
        console.log("d");
        }
      }, 3000);
    }
}