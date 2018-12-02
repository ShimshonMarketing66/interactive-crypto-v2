import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
// import * as firebase from 'firebase/app';
// import { AngularFireAuth } from 'angularfire2/auth';
import { Http, Headers } from '@angular/http';
import { AlertPage } from '../alert/alert';
import { LoginPage } from '../login/login';
import { LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import { TrackEventProvider } from '../../providers/track-event/track-event';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';


@IonicPage({
  name:"alerts-dashboard"
})
@Component({
  selector: 'page-alerts-dashboard',
  templateUrl: 'alerts-dashboard.html',
})
export class AlertsDashboardPage {
  icon: string = "md-create";
  edit: boolean = false;
  isAlretsEmpty: boolean = true;
  hasExchange: boolean;
  uid: string;
  TOSYMBOL: string;
  price: any;
  FROMSYMBOL: string;
  Above: any;
  Below: any;
  Exchanges: any;
  Exchange: string;
  Time1: boolean = true;
  Persistent: boolean = false;
  Mailcheck: boolean = false;
  SignToSymbole: string;
  jsons = new Array();
  jsons2 = new Array();
  alljsons = new Array();
  loading

  ionViewDidLoad() {
    this.trackEvent.trackView("Alert Dashboard Page")

  }

  constructor(
    public trackEvent: TrackEventProvider,  
      public loadingCtrl :LoadingController,
    public navCtrl: NavController,
    public http: Http,
    public app:App,
    public authData:AuthDataProvider,
    public navParams: NavParams) {
     
      let loading = loadingCtrl.create({
        duration:1000
      })
      loading.present() 
      firebase.auth().onAuthStateChanged((user1) => {
      if (!user1) {
        this.isAlretsEmpty = false;
        return
      }
      this.uid = user1.uid;


      var url =  " https://afternoon-mountain-15657.herokuapp.com/api/getAlerts"
      
      let header = new Headers();
      header.append('Content-Type', 'application/json');
        this.http.post(url, {"UserUid":user1.uid}, { headers: header })
          .toPromise()
          .then(data1 => {
            if (this.isEmpty(data1.json())){
              this.isAlretsEmpty = false;
              loading.dismiss()
              return
            }
         else{
           this.alljsons= data1.json()   
           console.log( this.alljsons);
              
           loading.dismiss()

            }

            })
    .catch(err => {
      console.log(err);
      
        this.isAlretsEmpty = false
        loading.dismiss()
        
     

    // loading.dismiss()
  
    })
  }
    )}
   
  
  deleteAlert(AlertUid,i){
    
    let header = new Headers();
    header.append('Content-Type', 'application/json');
      this.http.post('https://afternoon-mountain-15657.herokuapp.com/api/DeleteAlert', { "_id": AlertUid}, { headers: header })
        .toPromise()
        .then((Alert) => {
        console.log(Alert);
        this.alljsons.splice(i,1);
        if(this.alljsons.length < 1)
        this.isAlretsEmpty= false;
        }).catch(errFromserver => {
          console.log("error", errFromserver);
        })
  }
  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;

    }
    return true;
  }
  goToSetting(i) {
    this.navCtrl.push('alert', {
      alertsdashboard: true,
      TOSYMBOL: this.jsons2[i].TOSYMBOL,
      FROMSYMBOL: this.jsons2[i].FROMSYMBOL,
      exchange: this.jsons2[i].Exchange,
      SignToSymbole:this.jsons2[i].SignToSymbole,
      jsons2: this.jsons2[i]
    })

  }
  goToSetting2(i) {
    this.navCtrl.push('alert', {
      alertsdashboard: true,
      TOSYMBOL: this.jsons[i].TOSYMBOL,
      FROMSYMBOL: this.jsons[i].FROMSYMBOL,
      exchange: this.jsons[i].Exchange,
      SignToSymbole:this.jsons[i].SignToSymbole,
      jsons2: this.jsons[i]
    })

  }
  
  addAlert() {
    if (this.uid != undefined) {
      if(this.alljsons.length < 4 || this.authData.user.state== "approved")
      this.navCtrl.push("list-pairs",{isAlerts:true})
      else
      this.navCtrl.push("vip")
    }
    else
    this.app.getRootNav().setRoot("connection")
  }
  shows(alert){
    console.log(alert);
    console.log("aaaaaaaa");
    
  }
  goEdit() {

    if (this.edit) {
      this.icon = "md-create"
      this.edit = false
    } else {
      this.icon = "md-checkmark"
      this.edit = true

    }

  }

  clicktoggle(type,item_id,index){
    console.log(type,item_id,index);
    this.alljsons[index].isAppend=type;
    console.log(this.alljsons);
    
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    this.http.post('https://afternoon-mountain-15657.herokuapp.com/api/upsetAlert', { "type": type,_id:item_id}, { headers: header }).toPromise()
    .then((Alert) => {
      console.log(Alert);
      
  })
}
}
