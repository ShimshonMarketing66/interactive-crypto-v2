import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { MyApp } from '../../app/app.component';


@IonicPage({
  name:"server-error"
})
@Component({
  selector: 'page-server-error',
  templateUrl: 'server-error.html',
})
export class ServerErrorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public app:App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServerErrorPage');
  }

  tryAgain(){
    this.app.getRootNav().setRoot(MyApp);
  }

}
