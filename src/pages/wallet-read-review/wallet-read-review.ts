import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { TrackEventProvider } from '../../providers/track-event/track-event';


@IonicPage({
  name: "wallet-read-review"
})
@Component({
  selector: 'page-wallet-read-review',
  templateUrl: 'wallet-read-review.html',
})
export class WalletReadReviewPage {
  srcImg: any;
  language: string;
  url: string;
  pageName:string;
  constructor(public navCtrl: NavController,
    public http: Http,
     public navParams: NavParams,
     public trackEvent: TrackEventProvider) {
    this.pageName = this.navParams.get("pagename");
    this.language = this.navParams.get("language");
    if( this.language=="fr")
    this.language="FR"
    else
    this.language="EN"
    this.url = "https://afternoon-mountain-15657.herokuapp.com/walletReview/" + this.pageName + "/" + this.language
    console.log(this.pageName)
    
    this.http.get(this.url)
    .toPromise()
    .then(response => {
      do {
        document.getElementById("blog").innerHTML = response.text();
      }
      while (document.getElementById("blog").innerHTML === "")

     
    })
    .catch(err => {
      console.log('error in server')
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletReadReviewPage');
    this.trackEvent.trackView("Wallet Read Review -> "+this.pageName)

    
  }
  
}
