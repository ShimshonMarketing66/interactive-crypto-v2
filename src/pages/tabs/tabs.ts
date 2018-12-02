import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';


@IonicPage({
  name:"tabs"
})
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = "allcoin";
  tab2Root = "port-folio";
  tab3Root =  "news";
  tab4Root = "alerts-dashboard";
  tab5Root = "settings";

  constructor() {
   
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad");

}
}
