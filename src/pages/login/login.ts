import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, LoadingController } from 'ionic-angular';
import { Profile } from '../../models/profile-model';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from '../../app/app.component';
import { TrackEventProvider } from '../../providers/track-event/track-event';



@IonicPage({name:"login"})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  error: string;
  email: string;
  password: string;

  constructor(
    public app: App,
    public splashscreen: SplashScreen,
    public navCtrl: NavController, 
    public trackEvent: TrackEventProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public profile: Profile,
    public authdata: AuthDataProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.trackEvent.trackView("LoginPage")

  }
  loginViaProvider(m_provider: string) {
    let loading = this.loadingCtrl.create()
    loading.present()
    this.authdata.loginUserWithProvider(m_provider)
        .then((profile: Profile) => {
          console.log("back",profile);
          
            loading.dismiss()
            if (profile.is_phone_number_verified) {
        console.log("a");
        
        this.splashscreen.show();
        this.app.getRootNavs()[0].setRoot(MyApp).then(() => {
          window.location.reload();
        })
            } else {
              console.log("b");

              this.app.getActiveNav().push("phone-number-verified")
                
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
loginViaEmail() {
  console.log(this.email,this.password);
  
  this.error = ""
  if (this.email == null && this.password == null) {
    this.error = "please enter correct email ans password"
    return
  }
  this.authdata.loginUserViaEmail(this.email,this.password).then(() => {

    this.splashscreen.show();
    this.app.getRootNavs()[0].setRoot(MyApp).then(() => {
      window.location.reload();
    })  }).catch((err) => {
    console.log(err.message);
    let alert = this.alertCtrl.create({
      message: err.message,
      buttons: [
        {
          text: "Ok",
          role: 'cancel'
        }
      ]
    });
    alert.present();
  })

}
  gotoForgotpassword() {
    this.app.getRootNav().push("forgot-password")
  }
}
