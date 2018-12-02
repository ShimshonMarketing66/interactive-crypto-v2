import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { termAndPrivacyPage } from '../../pages/termAndPrivacy/termAndPrivacy';
import { Http, Headers } from '@angular/http';
import { Market } from '@ionic-native/market';
  


@IonicPage({name:"pop-up-rate-us"})

@Component({
  selector: 'pop-up-rate-us',
  templateUrl: 'pop-up-rate-us.html',
})


export class PopUpRateUsPage {
  star: number;
  reponseCode : number;

  constructor(public platform: Platform,
    private market: Market,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
  ) {
    
    this.star=0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopUpGetNewsPage');
    (document.getElementsByClassName("submitButton")[0] as HTMLButtonElement).disabled = true;
    ;
  }
  
  submit() {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    
    var data = {
     
    }

  
  }
  disablePopUp(){
    
  //   this.nativeStorage.setItem('PopUpNewsLetter',
  //   {
  //    value: '1'
  //    })
  //  .then(
  //    () => console.log('pop up disabled'),
  //    error => console.error('pop up disabled : Error storing item', error)
  //  );
 
  }
  close() {
    this.navCtrl.pop();
  }
  

  onestar(){
    this.star=1;
  }
  twostar(){
    this.star=2;
  }
  threestar(){
    this.star=3;
  }
  fourstar(){
    this.star=4;
    let x = (this.platform.is('ios') ? 'id1291765934' : 'com.interactive_crypto.app')
    
    this.market.open(x);
    this.navCtrl.pop();
  }
  fivestar(){
    this.star=5;
    let x = (this.platform.is('ios') ? 'id1291765934' : 'com.interactive_crypto.app')
    this.market.open(x);
    this.navCtrl.pop();
    
  }
  

  
}
