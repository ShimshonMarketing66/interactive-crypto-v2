import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:"forgot-password"
})
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  constructor( 
    public authdata: AuthDataProvider,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
     public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }
  resetPassword(email){  
    this.authdata.resetPassword(email) .then(() => {
      let alert = this.alertCtrl.create({
        message: "We sent you a reset link to your email",
        buttons: [
          {
            text: "Ok",
            role: 'cancel',
            handler: () => { 
              this.navCtrl.pop(); 
            }
          }
        ]
      });
      alert.present();

    }, (error) => {
      var errorMessage: string = error.message;
      let errorAlert = this.alertCtrl.create({
        message: errorMessage,
        buttons: [{ text: "Ok", role: 'cancel' }]
      });
      errorAlert.present();
    });
  }
}
