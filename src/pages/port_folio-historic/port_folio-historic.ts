import { Component, transition } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http,Headers} from '@angular/http';
import { initializeApp } from 'firebase/app';
import * as io from "socket.io-client";
import { dateDataSortValue } from 'ionic-angular/util/datetime-util';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { TrackEventProvider } from '../../providers/track-event/track-event';
// import { ToFixeNumberPipe } from '../../pipes/to-fixe-number/to-fixe-number';

@IonicPage({
  name:"port_folio-historic"
})
@Component({
    selector: 'page-port_folio-historic',
    templateUrl: 'port_folio-historic.html',
  })

  export class PortFolioHistoricPage {
TransactionsClosed:any []
SignToSignSymbol: string = "$"


constructor(
  public authData:AuthDataProvider,
  public loadingCtrl:LoadingController,
  public navCtrl: NavController,
  public http: Http,
  public trackEvent: TrackEventProvider,
  public navParams: NavParams) {
  
  }


  ionViewDidEnter() {
    let header = new Headers();
    let loading = this.loadingCtrl.create({duration:10000})
    loading.present()
    header.append('Content-Type', 'application/json');
    console.log(this.authData.user._id);
    let dataFoServer = {
      UserUid: this.authData.user._id
    }
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/getClosedTransaction",  JSON.stringify(dataFoServer), { headers: header })
    .toPromise()
    .then(transition=>{
      console.log(transition.json());
      this.TransactionsClosed = transition.json()
      for (let index = 0; index <  this.TransactionsClosed.length; index++) {
        this.TransactionsClosed[index]["GainPrricePercent"] = this.getOnPercent(this.TransactionsClosed[index].CostInUSD,this.TransactionsClosed[index].ClosedPrice)
      }
      loading.dismiss()
    })
    .catch((err)=>{
      console.log(err);
      loading.dismiss()
    })
    this.trackEvent.trackView("port_folio-historic")

  }

  getOnPercent(OldPrice, NewPrice): number {
    if (OldPrice == 0 && NewPrice==0) {
      return 0
    }
    
    var result = 0
    result = ((NewPrice - OldPrice) / OldPrice) * 100

    return result
  }
}