import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App } from 'ionic-angular';
import { Profile } from '../../models/profile-model';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { HttpClient } from '@angular/common/http';
import { Platform } from 'ionic-angular/platform/platform';
import { TrackEventProvider } from '../../providers/track-event/track-event';


@IonicPage({
    name: "phone-number-verified"
})
@Component({
    selector: 'page-phone-number-verified',
    templateUrl: 'phone-number-verified.html',
})
export class PhoneNumberVerifiedPage {
    error: string;
    phone_number: string
    country: string;
    isenabled: boolean = false
    constructor(public navCtrl: NavController,
        public http: HttpClient,
        public authData: AuthDataProvider,
        public profile: Profile,
        public platform: Platform,
        public app: App,
        public trackEvent: TrackEventProvider,
        public modalCtrl: ModalController,
        public navParams: NavParams) {


        if (!this.platform.is("cordova")) {
            return;
        }

    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad PhoneNumberVerifiedPage');
        this.trackEvent.trackView("PhoneNumberVerifiedPage")
        
    }
    presentcountries() {
        let profileModal = this.modalCtrl.create("countries", {
            type: "country"
        });
        profileModal.onDidDismiss(data => {
            if (data != undefined && data.dial_code != undefined) {
                this.authData.user.countryData.dial_code = data
            }
        });
        profileModal.present();
    }





    presentDialCode() {
        let profileModal = this.modalCtrl.create("countries", {
            type: "dial_code"
        });
        profileModal.onDidDismiss(data => {
            console.log(data);

            if (data != undefined && data.dial_code != undefined) {
                this.authData.user.countryData.dial_code = data.dial_code;
                this.authData.user.countryData.country = data.country;

            }
        });
        profileModal.present();
    }

    submit() {
        if (!this.phone_number && this.profile.countryData.dial_code) {
            this.error = "please enter real phone"
            return
        }
        if (this.phone_number.length < 6) {
            this.error = "please enter real phone"
            return
        }

        this.authData.user.phone_number = this.phone_number;
        this.authData.sendVerifyCode().then(() =>

            this.app.getRootNav().push("verify-code")
        )

    }

}
