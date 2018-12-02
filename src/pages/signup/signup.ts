import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController, App, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../../models/profile-model';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
// import { DeviceAccounts } from '@ionic-native/device-accounts';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Sim } from '@ionic-native/sim';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from '../../app/app.component';
import { Location } from '@angular/common';
import { TrackEventProvider } from '../../providers/track-event/track-event';



@IonicPage({
  name:"signup"
})
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
error:string;

  constructor( 
    public trackEvent: TrackEventProvider,
        public sim:Sim,
    public app: App,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public profile: Profile,
    public authdata: AuthDataProvider,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public splashscreen: SplashScreen,
    private androidPermissions: AndroidPermissions,
    public http: HttpClient
) {
   
    }
    // this.http.get('http://freegeoip.net/json')
    //     .toPromise()
    //     .then(data => {
    //         this.profile.country = data["country_name"]
    //         this.http.get('./assets/lot of data/countries.json')
    //             .toPromise()
    //             .then(response => {
    //                 for (let index = 0; index < response["countries"].length; index++) {
    //                     if (response["countries"][index].name == this.profile.country) {
    //                         this.profile.dial_code = response["countries"][index].dial_code
    //                         break;
    //                     }
    //                 }
    //             })
    //     })
    //     .catch((err) => {
    //         console.log(err);

    //     })


    ionViewDidLoad() {
    console.log("ionViewDidEnter register");
    this.trackEvent.trackView("register")

    this.authdata.getContry().then(data => {
        console.log(data,"data");
        
        this.profile.countryData = data;      
        if (!this.platform.is("cordova")) {
          return;
        }
        this.sim.hasReadPermission().then((info) => {
          if (!info) {
            this.sim.requestReadPermission().then(() => {
              console.log('Permission granted')
              this.sim.getSimInfo().then(
                (info) => {
                  console.log("info",info);
                  
                 let a =  this.profile.countryData.dial_code.length
                 this.profile.phone_number = info.phoneNumber.substring(a);
                },
                (err) => {
                  console.log('Unable to get sim info: ', err);
                }
              );},
              () => {
                console.log('Permission denied')
              }
            );
          }else{
            this.sim.getSimInfo().then(
              (info) => {
                console.log("info",info);
               let a =  this.profile.countryData.dial_code.length
               this.profile.phone_number = info.phoneNumber.substring(a);
              },
              (err) => {
                console.log('Unable to get sim info: ', err);
              }
            )
          }
        })
      })
}

ionViewWillLeave() {
    console.log("ionViewDidLeave");

}



presentcountries() {
    let profileModal = this.modalCtrl.create("countries", {
        type: "country"
    });
    profileModal.onDidDismiss(data => {
        if (data != undefined && data.dial_code != undefined) {
            this.profile.countryData.dial_code = data.dial_code
            this.profile.countryData.country = data.name
        }
    });
    profileModal.present();
}

presentDialCode() {
    let profileModal = this.modalCtrl.create("countries", {
        type: "dial_code"
    });
    profileModal.onDidDismiss(data => {
        if (data != undefined && data.dial_code != undefined) {
            this.profile.dial_code = data.dial_code
        }
    });
    profileModal.present();
}

submit() {
    this.error = ""

    if (this.profile.first_name == undefined || this.profile.first_name.length < 2) {
        this.error = "enter real first name"
        return
    }

    if (this.profile.last_name == undefined || this.profile.last_name.length < 2) {
        this.error = "enter real last name"
        return
    }

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(this.profile.email).toLowerCase())) {
        this.error = "enter real mail"
        return
    }

    if (this.profile.countryData.country == undefined) {
        this.error = "enter real country"
        return
    }

    if (this.profile.countryData.dial_code == undefined) {
        this.error = "enter real dial_code"
        return
    }

    if (isNaN(Number(this.profile.phone_number)) || this.profile.phone_number.length < 5) {
        this.error = "enter real phone number"
        return
    }

    if (this.profile.password == undefined || this.profile.password.length < 6) {
        this.error = "enter real password number minimum 6"
        return
    }

    let loading = this.loadingCtrl.create()
    loading.present()
    this.authdata.signupUser(this.profile)
        .then((data) => {
            console.log(data);


                loading.dismiss()
                this.app.getRootNav().push("verify-code")
           
            
        })
        .catch((error) => {
            let alert = this.alertCtrl.create({
                message: error.message,
                buttons: [
                    {
                        text: "Ok",
                        role: 'cancel'
                    }
                ]
            })
            loading.dismiss()
            alert.present();
        })
}

loginViaProvider(m_provider: string) {
    let loading = this.loadingCtrl.create()
    loading.present()
    this.authdata.loginUserWithProvider(m_provider)
        .then((profile: Profile) => {
            loading.dismiss()
            if (profile.is_phone_number_verified) {
              
                this.splashscreen.show();
                this.app.getRootNavs()[0].setRoot(MyApp).then(() => {
                  window.location.reload();
                })                        } else {
                            console.log("b");

                this.app.getRootNav().push("phone-number-verified")
            }
        })
        .catch(err => {
            let alert = this.alertCtrl.create({
                message: "Try Again",
                buttons: [
                    {
                        text: "Ok",
                        role: 'cancel'
                    }
                ]
            })
            loading.dismiss()
            alert.present();
        })
}



goToTremsAndConditions() {
    this.app.getRootNav().push("termAndPrivacy")
  }
}
