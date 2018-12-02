import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import { TrackEventProvider } from '../../providers/track-event/track-event';



@IonicPage({name:"pop-up"})
@Component({
  selector: 'page-popup',
  templateUrl: 'popup.html',
})
export class PopupPage {

  constructor(public app:App,
    public trackEvent: TrackEventProvider,
     public navCtrl: NavController,
      public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopupPage');
    this.trackEvent.trackView("Popup not user")

  }
  gotoconnection(){
this.app.getActiveNav().push("connection")
  }
}
