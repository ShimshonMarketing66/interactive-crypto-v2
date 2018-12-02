import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2';
import { Platform } from 'ionic-angular';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { Product } from '../../models/product-model';
import { MyApp } from '../../app/app.component';
import { App } from 'ionic-angular/components/app/app';
// import { GlobalParamesProvider } from '../../providers/global-parames/global-parames';
import { TrackEventProvider } from '../../providers/track-event/track-event';




@IonicPage({
  name: "vip"
})
@Component({
  selector: 'page-vip',
  templateUrl: 'vip.html',
})
export class VipPage {
  productMouth: Product
  productYear: Product

  constructor(
    public authData: AuthDataProvider,
    public platform: Platform,
    public app: App,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    private store: InAppPurchase2,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    // public globalParamesProvider: GlobalParamesProvider,
    public trackEvent: TrackEventProvider
  ) {
    console.log("user", this.authData.user);

    this.productYear = new Product()
    this.productMouth = new Product()
    let loading = this.loadingCtrl.create()
    loading.present()

    this.platform.ready().then(() => {
      if(!this.platform.is("ios"))
      this.initializeStore();
      loading.dismiss()
    })
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad vip");
    this.trackEvent.trackView("vip")
  }

  goToNotificationpage() {
    this.navCtrl.push("notifications")
  }

  async initializeStore() {
    this.productMouth.appleProductId = "interactivecrypto.vip.month"
    this.productMouth.googleProductId = "interactivecrypto.vip.month"
    this.productMouth.name = "unlimited alerts (1 month)"

    this.productYear.appleProductId = "interactivecrypto.vip.year"
    this.productYear.googleProductId = "interactivecrypto.vip.year"
    this.productYear.name = "unlimited alerts (1 year)"

    if (!this.platform.is('cordova')) { return };

    this.store.verbosity = this.store.INFO;
    this.store.refresh();
    InAppPurchase2.getPlugin().ready(() => {
      this.store.refresh();
      var productMouth_id = ""
      var productYear_id = ""
      if (this.platform.is('ios')) {
        productMouth_id = this.productMouth.appleProductId
        productYear_id = this.productYear.appleProductId
      } else {
        productMouth_id = this.productMouth.googleProductId
        productYear_id = this.productYear.googleProductId
      }
      this.store.register({
        id: productMouth_id,
        alias: productMouth_id,
        type: this.store.NON_RENEWING_SUBSCRIPTION
      });
      this.store.register({
        id: productYear_id,
        alias: productYear_id,
        type: this.store.NON_RENEWING_SUBSCRIPTION
      });


      this.store.refresh();
      var that = this
      this.store.when(this.productMouth.googleProductId).approved((product: IAPProduct) => {
        product.finish()
        that.authData.user.state = "approved";
      })
      this.store.when(this.productYear.appleProductId).approved((product: IAPProduct) => {
        product.finish()
        that.authData.user.state = "approved";
      })

      this.store.when(this.productYear.googleProductId).owned((product: IAPProduct) => {
        product.finish()
        that.authData.user.state = "approved";
      })
      this.store.when(this.productMouth.appleProductId).owned((product: IAPProduct) => {
        product.finish()
        that.authData.user.state = "approved";
      })

      this.store.when(this.productMouth.googleProductId).updated(function (product) {
        if (product.state == "finished" || product.state == "owned" || product.state == "approved") {
          that.authData.user.state = "approved";
          product.finish();
        }
      });
      this.store.when(this.productMouth.appleProductId).updated(function (product) {
        if (product.state == "finished" || product.state == "owned" || product.state == "approved") {
          that.authData.user.state = "approved";
          product.finish();
        }
      });
    })
  }

  async restorepurchase(productId) {
    if(this.platform.is('ios')){
      this.toastCtrl.create({
        message: "coming soon.",
        duration: 4000
      }).present()
      return}
    console.log("restorepurchase");
    this.store.refresh();
    InAppPurchase2.getPlugin().ready(() => {
      console.log("getPlugin");
      this.store.refresh();
      this.store.order(productId).then(() => {
        console.log("order");
        var that = this
        this.store.refresh();

        this.store.when(productId).updated(function (product) {
          console.log("updated");

          if (product.state == "finished" || product.state == "owned" || product.state == "approved") {
            console.log("finished");
            window['plugins'].appsFlyer.trackEvent("subscribtion", {
              product: productId,
              user_id: that.authData.user._id
            });
            product.finish();
            that.authData.user.state = "approved";

            that.authData.updateIdOneSignals().then(() => {
              console.log("avi1");
            }).catch(() => {
              console.log("avi2");
            })
          }

        });

      })
    })
    this.store.refresh();



  }
  ionViewDidLeave() {
    // this.app.getRootNav().setRoot(MyApp);
  }
}
