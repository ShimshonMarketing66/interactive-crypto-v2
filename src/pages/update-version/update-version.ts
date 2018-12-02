import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, MenuController } from 'ionic-angular';
import { Market } from '@ionic-native/market';


@IonicPage({
  name:"update-app"
})
@Component({
  selector: 'page-update-version',
  templateUrl: 'update-version.html',
})
export class UpdateVersionPage {

  constructor(public platform:Platform,public navCtrl: NavController,    public menu: MenuController, 
    public navParams: NavParams,public market:Market) {

  }

  ionViewDidLoad() {
    this.menu.swipeEnable(false);

  }

  updateApp(){
    let x = (this.platform.is('ios') ? 'id1291765934' : 'com.interactive_crypto.app')
    this.market.open(x);
  }

}
