import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, IonicPage} from "ionic-angular"
import { TrackEventProvider } from '../../providers/track-event/track-event';


@IonicPage({
  name:"termAndPrivacy"
})

@Component({
  selector: 'page-termAndPrivacy',
  templateUrl: 'termAndPrivacy.html'
})
export class termAndPrivacyPage {
  opt:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public menu: MenuController,public trackEvent: TrackEventProvider
    ) {
    this.opt = this.navParams.get("option");
    console.log("the option selected is ",this.opt);
    this.menu.swipeEnable(false);
  }
  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }
  ngAfterViewInit() {
    console.log("the option selected is in view init",this.opt);
    if (this.opt == "1") {
      console.log("margin-top");
      
      document.getElementById("contentTandPrivacy").style.marginTop = "13.5%";
    } else {
      
    }
  }
  close(){
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
    this.trackEvent.trackView("termAndPrivacy");

  }
}