import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { TrackEventProvider } from '../../providers/track-event/track-event';

@IonicPage({
  name:"brokers-read-review"
})
@Component({
  selector: 'page-brokers-read-review',
  templateUrl: 'brokers-read-review.html',
})
export class BrokersReadReviewPage {
  language: string;
  link: string;
  url: string;  
  gosite:string;  
  pageName:string;
  constructor(public navCtrl: NavController, public trackEvent: TrackEventProvider,    
    public http: Http,
     public navParams: NavParams) {
       console.log(this.navParams.get("pagename"));
       console.log(this.navParams.get("language"));
       
       
    this.pageName = this.navParams.get("pagename");
    this.link = this.navParams.get("link");    
    this.language = this.navParams.get("language");
    this.gosite="VISIT SITE"
    
    this.url = "https://afternoon-mountain-15657.herokuapp.com/BrokersReview/" + this.pageName + "/" + this.language
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
    this.trackEvent.trackView("Broker Read Reaview")

  }
  trackButton(name){
    this.trackEvent.trackEvent("Broker Read Reaview","click")

  }
}
