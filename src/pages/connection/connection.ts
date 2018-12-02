import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Tabs } from 'ionic-angular';



@IonicPage({
  name:"connection"
})
@Component({
  selector: 'page-connection',
  templateUrl: 'connection.html'
})
export class ConnectionPage {
  @ViewChild("myTabs") tabsRef :Tabs

  loginRoot = 'login'
  signupRoot = 'signup'


  constructor(public navCtrl: NavController,public navParams: NavParams) {}
  ionViewDidEnter() {
    console.log(this.navParams.get("selectedTab"));
    if(this.navParams.get("selectedTab") == 1)
    this.tabsRef.select(this.navParams.get("selectedTab"));
   }
}
