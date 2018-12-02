import { Component } from '@angular/core';
import { NavController, NavParams, App, ViewController, LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { Http } from '@angular/http';
import { BrokersReadReviewPage } from '../brokers-read-review/brokers-read-review';
import { TrackEventProvider } from '../../providers/track-event/track-event';

@IonicPage({
  name:"broker"
})

@Component({
  selector: 'page-brokers',
  templateUrl: 'brokers.html'
})

export class BrokersPage {
  url: string;
  items: any[];
  myInterval: any;
  toast: any;
  loading: any;
  title: string;
  readreview: string;
  gosite: string;
  language: string = "EN";
  srcImg: any;
  NotNetworkConnection: boolean = false;
  NetworkConnection: boolean = true;
  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public http: Http,
    public trackEvent: TrackEventProvider,
    public navParams: NavParams,    
    public toastCtrl: ToastController,
  ) {
    if (this.navParams.get("language") == "fr") {
      this.language = "FR";
    }
    else
      this.language = "EN";
    this.toast = this.toastCtrl.create({
      message: "You should be connected to internet in order to read news,\n Please check your connection.",
      position: 'bottom',
      showCloseButton: true
    });
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    if (this.language == "FR") {
      this.url = "http://afternoon-mountain-15657.herokuapp.com/NewBrokers" + this.language + "/"
      this.srcImg = "./img/uk.png";
      this.title = "Meilleurs courtiers pour acheter des monnaies virtuelles"
      this.readreview = "Lire la Revue"
      this.gosite = "VISITER SITE"
    } else {
      this.url = "http://afternoon-mountain-15657.herokuapp.com/NewBrokersEN/"
      this.srcImg = "./img/france.png";
      this.title = "Top Brokers to buy Cryptocurrencies"
      this.gosite = "VISIT SITE"
      this.readreview = "Read Review"
    }

    //check Network
    // this mean that I im in phone device
      this.loading.present();
      this.http.get("http://afternoon-mountain-15657.herokuapp.com/NewBrokersEN/")
        .toPromise()
        .then(Response => {
          this.items = Response.json();
          this.loading.dismiss()
        })
        .catch(error => console.log('an error was happen with the response of the the server'))
  }
  ionViewDidLoad() {
    this.trackEvent.trackView("Brokers")

  }
  
  trackButton(name) {
    this.trackEvent.trackEvent("about-us","Brooker button")
  }

  readReview(pagename, language, link) {
    this.navCtrl.push("brokers-read-review", { language, pagename, link })
  }
  
}
