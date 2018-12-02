import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { CryptoProvider } from '../../providers/crypto/crypto';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { TrackEventProvider } from '../../providers/track-event/track-event';


@IonicPage({name:'list-pairs'})
@Component({
  selector: 'page-list-pairs',
  templateUrl: 'list-pairs.html',
})
export class ListPairsPage {
  isAlerts:boolean=false;
  offsetRequested:number=0;
allpairs: Array<{
  pair:string,
  name:string
  ,img:string
}> = [];
allpairs2: Array<{
  pair:string,
  name:string
  ,img:string
}> = [];
  constructor(public navCtrl: NavController,
    public trackEvent: TrackEventProvider,
    public cryptoProvider:CryptoProvider,
    public authData:AuthDataProvider,
     public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPairsPage');

    for (let index = 0; index <20; index++) {
      this.allpairs.push(this.cryptoProvider.arrAllCrypto[index])
    }
    this.offsetRequested+=20
    this.allpairs2=  this.cryptoProvider.arrAllCrypto;
    this.isAlerts= this.navParams.get("isAlerts");
    this.trackEvent.trackView("ListPairsPage")

  }
  getItems(ev: any) {
    let val = ev.target.value;
    if (val == undefined) {
      this.allpairs = this.allpairs2;
        return
    }
    this.allpairs = this.allpairs2.filter((item) => {
      var x=item.pair.split("_")[0]+=item.pair.split("_")[1]
        return (item.pair.toLowerCase().indexOf(val.toLowerCase()) > -1 || (item.name.toLowerCase().indexOf(val.toLowerCase())) > -1) || (x.indexOf(val.toLowerCase()) > -1) || (x.indexOf(val.toUpperCase()) > -1); 
    })
}
gotoalert(pair){
  this.navCtrl.push("alert",{
    FROMSYMBOL: pair.split("_")[0],
    TOSYMBOL:pair.split("_")[1]
  })
}
addtoWhachlist(pair,type,index){
  if(type){
    this.cryptoProvider.arrAllCrypto[index].isWatchlist=false;
  this.authData.user.watchlist.splice(index, 1);
  for (let index2 = 0; index2 <   this.cryptoProvider.mywatchlist.length; index2++) {
    if(pair ==  this.cryptoProvider.mywatchlist[index2].pair){ 
    this.cryptoProvider.mywatchlist.splice(index2, 1);
          break
  }  }
  
  this.cryptoProvider.deleteToWhachList({
    pair:pair,_id:this.authData.user._id
  })
}else{
  this.cryptoProvider.arrAllCrypto[index].isWatchlist=true;
  this.cryptoProvider.mywatchlist.push(  this.cryptoProvider.arrAllCrypto[index])
  this.authData.user.watchlist.push({pair:pair})
this.cryptoProvider.addToWhachList({
pair:pair,_id:this.authData.user._id
})
}
if(this.cryptoProvider.mywatchlist.length > 0)
    this.cryptoProvider.isWatchlistEmpty = false;
    else
    this.cryptoProvider.isWatchlistEmpty = true;

}
doInfinite() {
   
  return new Promise((resolve) => {

    let index = 0;
            for ( ;( this.offsetRequested+index) < this.allpairs2.length && index <20; index++) {
              this.allpairs.push(this.allpairs2[index+this.offsetRequested])
            }
            this.offsetRequested += index;

            resolve();
          })        }
}
