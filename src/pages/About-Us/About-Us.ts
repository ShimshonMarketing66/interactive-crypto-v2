import { Component } from '@angular/core';
import { termAndPrivacyPage } from '../../pages/termAndPrivacy/termAndPrivacy';
import { NavController, App, MenuController, IonicPage } from "ionic-angular"
import { TrackEventProvider } from '../../providers/track-event/track-event';

@IonicPage({
  name:"about-us"
})

@Component({
  selector: 'page-About-Us',
  templateUrl: 'About-Us.html'
})
export class AboutUsPage {
  
  constructor(    public trackEvent: TrackEventProvider
    ,public navCtrl: NavController, public app:App,public menu:MenuController) {
 
  }
  openTermsAndPrivacy(){
    this.navCtrl.push(termAndPrivacyPage,{option : "0"});
  }

  ionViewDidLoad() {
    this.menu.swipeEnable(false);
    this.trackEvent.trackView("about-us")
  }
  ionViewWillLeave(){
    this.menu.swipeEnable(true);
  }
}