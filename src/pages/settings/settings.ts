import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App, ModalController,ModalOptions, Platform } from 'ionic-angular';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { Market } from '@ionic-native/market';
import { TrackEventProvider } from '../../providers/track-event/track-event';



@IonicPage({
  name:"settings"
})
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  countryimg:string= "http://xosignals.herokuapp.com/api2/sendImgCountryByName/"
  constructor(public navCtrl: NavController,
    public authData:AuthDataProvider,
    public platform: Platform,
    private market: Market,
    public app :App,
    public trackEvent: TrackEventProvider,
    public modalCtrl: ModalController,
     public navParams: NavParams) {
       this.countryimg+=this.authData.user.countryData.country;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.trackEvent.trackView("SettingsPage")

  }
  logoutUser(){
    this.authData.logoutUser()
   
  }
  gotoAboutus(){
this.app.getRootNav().push("about-us")
  }
  gototermsTermAndPrivacy(){
    this.app.getRootNav().push("termAndPrivacy")
      }

      presentListtimezone() {
        let profileModal = this.modalCtrl.create("countries", {
            type: "timezone"
        });
        profileModal.onDidDismiss(data => {
            console.log(data);

            if (data != undefined ) {
                this.authData.user.countryData.timezone = data;

            }
        });
        profileModal.present();
    }
   
   gotovip(){
 this.navCtrl.push("vip")

    }

    rateus(){
      let x = (this.platform.is('ios') ? 'id1291765934' : 'com.interactive_crypto.app')
    
      this.market.open(x);
    }
}
