import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
// import { AngularFireAuth } from 'angularfire2/auth';
// import { AlertsDashboardPage } from '../alerts-dashboard/alerts-dashboard';
// import * as firebase from 'firebase/app';
import firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { TrackEventProvider } from '../../providers/track-event/track-event';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';

@IonicPage({
  name:"alert"
})
@Component({
  selector: 'page-alert',
  templateUrl: 'alert.html',
})
export class AlertPage {
  AlertUid: String;
  jsons2: any;
  alertsdashboard: boolean = false;
  hasExchange: boolean = true;
  token: string;
  name: string;
  mail: string;
  uid: string;
  _id: string
  phone: string;
  TOSYMBOL: string;
  price: any;
  FROMSYMBOL: string;
  Above: number;
  Below: number;
  Exchanges: any;
  Exchange: string;
  Time1: boolean = true;
  Persistent: boolean = false;
  Mailcheck: boolean = true;
  SignToSymbole: string;
  Belowbox: boolean;
  Abovebox: boolean;
  ionViewDidLoad() {
    this.trackEvent.trackView("Alert")

  }
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public trackEvent: TrackEventProvider,
    public authData:AuthDataProvider,
        public http: HttpClient) {

      firebase.auth().onAuthStateChanged((user1) => {
      let loading = this.loadingCtrl.create({})
      loading.present()
      this.name = user1.displayName;
      this.mail = user1.email;
      this.phone = user1.phoneNumber;
      this.uid = user1.uid;

      this.TOSYMBOL = navParams.get('TOSYMBOL')
      this.FROMSYMBOL = navParams.get('FROMSYMBOL')
      // this.Exchange = navParams.get('exchange')
      this.SignToSymbole = navParams.get('SignToSymbole')
      this.alertsdashboard = navParams.get('alertsdashboard')
      this.jsons2 = navParams.get('jsons2')
      if (this.alertsdashboard == true) {//come from dashboard
       
        
        this._id = this.jsons2._id
        this.Persistent = this.jsons2.Persistent
        if (!this.Persistent){
          this.Time1 = true
        }else{
          this.Time1 = false
        }
          
        this.Mailcheck = this.jsons2.Mailcheck
        this.Above = this.jsons2.Above
        if (this.Above != 100000000) {
          this.Abovebox = true;
        }
        this.Below = this.jsons2.Below
        if (this.Below != 0) {
          this.Belowbox = true;
        }
      }
      this.http.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + this.FROMSYMBOL + "&tsyms=" + this.TOSYMBOL).toPromise()
        .then((data:any) => {
          console.log(data);
          this.Below=Number((data.RAW[this.FROMSYMBOL][this.TOSYMBOL].PRICE*0.9).toFixed(6))
          this.Above=Number((data.RAW[this.FROMSYMBOL][this.TOSYMBOL].PRICE*1.1).toFixed(6))
          this.price=Number(data.RAW[this.FROMSYMBOL][this.TOSYMBOL].PRICE.toFixed(6));
        }).catch(errFromserver => {

          console.log("error", errFromserver);
          let alert = this.alertCtrl.create({
            title: 'error!',
            subTitle: "please refresh your page",
            buttons: ['Ok']
          })
          alert.present()
        })

      loading.dismiss()
    });
    
  }

  // onSelectExchange() {
  //   let url = "https://crypto.tradingcompare.com/" + this.FROMSYMBOL + "/" + this.TOSYMBOL
  //   if (this.Exchange != "undefined" && this.Exchange != undefined)
  //     url += "&e=" + this.Exchange
  //   this.http.get(url).toPromise().then((data) => {
  //     this.price = data.json().RAW[this.FROMSYMBOL][this.TOSYMBOL].PRICE;
  //     if (this.alertsdashboard != true) {
  //       if (this.price > 1) {
  //         this.Above = Math.round(this.price * 1.1) + 1
  //         this.Below = Math.round(this.price / 1.1)
  //       } else {
  //         this.Above = parseFloat((this.price * 1.1).toFixed(6))
  //         this.Below = parseFloat((this.price / 1.1).toFixed(6))
  //       }
  //     }
  //     else {
  //       if (this.Above == 100000000) {
  //         this.Above = parseFloat((this.price * 1.1).toFixed(6))

  //       }

  //       if (this.Below == 0) {
  //         this.Below = parseFloat((this.price / 1.1).toFixed(6))
  //       }

  //     }
  //   }

  //   ).catch(errFromserver => {
  //     console.log("error", errFromserver);
  //     let alert = this.alertCtrl.create({
  //       title: 'error!',
  //       subTitle: "please refresh your page",
  //       buttons: ['Ok']
  //     })
  //     alert.present()
  //   })
  // }

  saveAlert() {
    this.Abovebox = (<HTMLInputElement>document.getElementById("Aboveboxid")).checked
    this.Belowbox = (<HTMLInputElement>document.getElementById("Belowboxid")).checked
    if (this.Abovebox == true || this.Belowbox == true) {
      if (this.Abovebox == true) {
        if (this.Belowbox == true) {

        } else {
          this.Below = 0;
        }
      } else {
        this.Above = 100000000;
      }
    } else {
      let alert = this.alertCtrl.create({
        title: 'Invalid values',
        subTitle: 'Please Choose on Abovebox or Belowbox or Both',
        buttons: ['Ok']
      });
      alert.present();
      return
    }
    let loading = this.loadingCtrl.create({})
    loading.present()
    var x = (<HTMLInputElement>document.getElementById("1TimeId")).checked;
    this.Time1 = x;
    var x2 = (<HTMLInputElement>document.getElementById("PersistentId")).checked
    this.Persistent = x2
    this.Mailcheck = (<HTMLInputElement>document.getElementById('MailId')).checked;
    if (!(this.price < this.Above && this.Below < this.price && this.Below != null && this.Above != null)) {
      if (this.Below == 0) {
        this.Below = null
      } else if (this.Above == 100000000) {
        this.Above = null
      }
      let alert = this.alertCtrl.create({
        title: 'Invalid values',
        subTitle: 'Please Check Above And Below',
        buttons: ['Ok']
      });
      loading.dismiss()
      alert.present();
      return
    }

    if (!(this.Time1 != this.Persistent)) {
      let alert = this.alertCtrl.create({
        title: 'Invalid values',
        subTitle: 'please choose one Time or Persistent',
        buttons: ['Ok']
      });
      loading.dismiss()
      alert.present();
      return
    }
    this.Exchange = this.Exchange ? this.Exchange : "undefined"
    var dataForTheDatabase = {
      UserUid: this.uid,
      name: this.name,
      phone: this.phone,
      email: this.mail,
      FROMSYMBOL: this.FROMSYMBOL,
      TOSYMBOL: this.TOSYMBOL,
      Exchange: this.Exchange,
      Persistent: this.Persistent,
      Mailcheck: this.Mailcheck,
      Above: Number(this.Above).toFixed(10).replace(/\.?0+$/, ""),
      Below: Number(this.Below).toFixed(10).replace(/\.?0+$/, ""),
      SignToSymbole: this.SignToSymbole,
      isAppend: false,
      date:new Date().toLocaleString(),
      notificationId:this.authData.user.notificationId
    }
    if (this.alertsdashboard == true) {
      loading.dismiss()
console.log("a");

      this.updatealert(dataForTheDatabase)
    } else {
      this.setAlertInserverAndGetUid(dataForTheDatabase)
        .then((AlertUid) => {
          if (AlertUid) {
            let alert = this.alertCtrl.create({
              title: 'Success!',
              subTitle: "Your Alert is saved successfully",

              buttons: [{
                text: 'Ok',
                handler: () => {
                  this.navCtrl.setRoot("alerts-dashboard")
                }
              }]
            })
            var label = dataForTheDatabase.FROMSYMBOL + "/" + dataForTheDatabase.TOSYMBOL + " -> " + dataForTheDatabase.Exchange
            loading.dismiss()
            alert.present()
          }
          else {
            let alert = this.alertCtrl.create({
              title: 'error!',
              subTitle: "Can't save the alert right now",
              buttons: ['Ok']
            })
            loading.dismiss()
            alert.present()
          }
        })

    }
  }

  setAlertInserverAndGetUid(dataForTheDatabase: any): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      let header = new Headers();
      header.append('Content-Type', 'application/json');
      this.http.post('https://afternoon-mountain-15657.herokuapp.com/api/AddAlert', dataForTheDatabase,)
        .toPromise()
        .then((AlertUid) => {
          resolve(AlertUid as JSON)
        })
        .catch(err => {
          reject(err)
          let alert = this.alertCtrl.create({
            title: 'error!',
            subTitle: "Can't save the alert right now",
            buttons: ['Ok']
          })
          alert.present()
        })
    });
    return promise
  }

  updatealert(dataForTheDatabase) {
    console.log(dataForTheDatabase);
    dataForTheDatabase["_id"] = this._id;
    let loading = this.loadingCtrl.create({})
    loading.present()
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    this.http.post('https://afternoon-mountain-15657.herokuapp.com/api/updateAlert', dataForTheDatabase)
      .toPromise()
      .then((Alert) => {
        console.log("aa",Alert);
        
        loading.dismiss()
        let alert = this.alertCtrl.create({
          title: 'Success!',
          subTitle: "Your Alert is saved successfully",
          buttons: [{
            text: 'Ok',
            handler: () => {
              this.navCtrl.setRoot("alerts-dashboard")
            }
          }]
        })
        alert.present()
      }).catch(errFromserver => {
        loading.dismiss()
        console.log("error", errFromserver);
        let alert = this.alertCtrl.create({
          title: 'error!',
          subTitle: "Can't save the alert right now",
          buttons: ['Ok']
        })
        alert.present()
      })
  }

}




