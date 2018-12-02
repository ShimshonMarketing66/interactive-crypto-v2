import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Profile } from '../../models/profile-model';
import { ModalController, Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { CountryModel } from '../../models/country-model';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2';
import { OneSignal } from '@ionic-native/onesignal';
import { Product } from '../../models/product-model';

firebase.initializeApp({
  apiKey: "AIzaSyAUVmQK6LAi3b9dj6h_KxmzvABgTD9GrIw",
  authDomain: "interactive-crypto-2f07f.firebaseapp.com",
  databaseURL: "https://interactive-crypto-2f07f.firebaseio.com",
  projectId: "interactive-crypto-2f07f",
  storageBucket: "interactive-crypto-2f07f.appspot.com",
  messagingSenderId: "783700927099"
});


@Injectable()
export class AuthDataProvider {

  isAuth: boolean = false
  user: Profile= new Profile();
  productMouth: Product
  productYear: Product
  localCountry: CountryModel = new CountryModel();

  
  constructor(
    private store: InAppPurchase2,
    public oneSignal:OneSignal,
    private googlePlus: GooglePlus,
    public facebook: Facebook,
    public modalCtrl: ModalController,
    public http: HttpClient,
    public plt: Platform,
  ) {
    this.productYear = new Product()
    this.productMouth = new Product()
   

   
    
    this.user = new Profile();

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.plt.ready().then(() => {
          let provider
          if (user.providerData[0] != undefined) {
            provider = user.providerData[0].providerId
          } else {
            provider = "password"
          }
        })
        this.user._id = user.uid
        if (plt.is('ios'))
          this.user.platform = "ios"
        else
          this.user.platform = "android"
        this.isAuth = true
      } else {
        this.isAuth = false
      }
    });

  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  loginUserWithProvider(m_provider: string): Promise<Profile> {
    console.log("loginUserWithProvider");
    var provider
    switch (m_provider) {
      case "facebook":
        provider = new firebase.auth.FacebookAuthProvider()
        break;
      case "google":
        provider = new firebase.auth.GoogleAuthProvider()
      default:
        break;
    }

    //ios and android
    if (this.plt.is("cordova")) {
      return new Promise((resolve, reject) => {
        this.providerLogin(m_provider).then((profile: Profile) => {
          console.log(profile,"providerLogin");

          this.checkIfUserExistAlready(profile._id).then(userFromServer2 => {
            if (userFromServer2 == null) {
              profile.is_phone_number_verified = false
              this.keepProfileInServer(profile).then((profile) => {
                this.user = profile
                this.user.is_phone_number_verified = profile.is_phone_number_verified
                if (profile.provider != undefined) {
                  this.user.provider = profile.provider
                }
                this.user=profile as Profile
                resolve(profile)
              })
                .catch(() => {
                  reject("error")
                })
            } else {
              this.user= userFromServer2
              resolve(userFromServer2 as Profile)
            }
          })
        })
          .catch((err) => {
            console.log("err", err);

            reject(err)
          })
      })
    }


    //browser
    else {
      return new Promise((resolve, reject) => {
        console.log("signInWithPopup " + m_provider);
        firebase.auth().signInWithPopup(provider).then((newUser) => {
          console.log(newUser.user, "newUser");

          this.checkIfUserExistAlready(newUser.user.uid).then(userFromServer2 => {
            if (userFromServer2 == null) {


              var profile = this.getProfileWithFirebaseUser(newUser.user, m_provider)
              console.log(profile);

              profile.is_phone_number_verified = false
              profile.platform = (this.plt.is('ios'))? "ios":"android" 

              this.keepProfileInServer(profile).then((profile) => {
                this.user = profile             
                if (profile.provider != undefined) {
                  this.user.provider = profile.provider
                }
                resolve(profile)
              })
                .catch(() => {
                  reject("error")
                })
            } else {
              console.log(userFromServer2);
              
              resolve(userFromServer2 as Profile)
            }
          })
            .catch(err => {
              reject("error")
            })
        })
          .catch(function (error) {
            reject(error.message)
          });
      })
    }
  }

  loginUserViaEmail(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  }

  logoutUser(): Promise<any> {
    return firebase.auth().signOut();
  }

  signupUser(profile: Profile): Promise<any> {

    console.log(profile);

    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(profile.email, profile.password)
        .then((newUser) => {
          profile._id = newUser.uid
          profile.platform = (this.plt.is('ios'))? "ios":"android" 
          if (newUser.providerData[0] != undefined) {
            profile.provider = newUser.providerData[0].providerId
          } else {
            profile.provider = "password"
          }

          this.user = profile as Profile

          this.keepProfileInServer(profile)
            .then(data => {
              console.log(this.user);
              this.sendVerifyCode()
              resolve(data)
            })
            .catch(err => {
              reject(err)
            })
        })
        .catch(err => {
          reject(err)
        })
    })

  }

  keepProfileInServer(profile: Profile): Promise<Profile> {
    console.log(profile);
    
    return new Promise((resolve, reject) => {
      this.http.post("https://afternoon-mountain-15657.herokuapp.com/api/createUser", profile)
        .toPromise()
        .then((newUserServer) => {
          console.log(newUserServer, "keepProfileInServer");

          resolve(profile)
        })
        .catch((err) => {
          reject(err)
        })
    })

  }

  checkIfUserExistAlready(_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post("https://afternoon-mountain-15657.herokuapp.com/api/getUsersById", { _id: _id })
        .toPromise()
        .then(data => {
          console.log(data,"data");
        
          this.user= data as Profile;
          resolve(data)
        })
        .catch(() => {
          resolve("error in our servers")
        })
    })
  }

  getProfileWithFirebaseUser(user, m_provider): Profile {
    var profile = new Profile()
    console.log("getProfileWithFirebaseUser", user);

    if (user.displayName != null) {
      let displayName = user.displayName.split(" ")

      if (displayName.length >= 2) {
        profile.first_name = displayName[0];

        profile.last_name = "";
        for (let index = 1; index < displayName.length - 1; index++) {
          profile.last_name += displayName[index] + " ";
        }
        profile.last_name += displayName[displayName.length - 1];

      } else {
        profile.first_name = user.displayName;
      }
    }
    profile.email = user.email;
    profile._id = user.uid;
    profile.provider = m_provider
    profile.countryData=this.localCountry ;
    return profile
  }


  

  sendVerifyCode(): Promise<any> {
    console.log(this.user);
    return this.http.post("https://afternoon-mountain-15657.herokuapp.com/api/sendUserVerifyCode", this.user).toPromise().then(data =>
     console.log(data)
     
    )
      .catch(err => {
        console.log(err, "sendUserVerifyCode");

      })

  }


  matchUserVerifyCode(verify_code): Promise<any> {
    var data = {
      _id: this.user._id,
      verify_code: verify_code
    }
    return this.http.post("https://afternoon-mountain-15657.herokuapp.com/api/matchUserVerifyCode", data).toPromise().then(data => data)
  }

  providerLogin(m_provider): Promise<Profile> {
    console.log(m_provider);

    if (m_provider == "facebook") {
      return new Promise((resolve, reject) => {
        this.facebook.login(['email'])
          .then(response => {
            console.log("response", response);

            const facebookCredential = firebase.auth.FacebookAuthProvider
              .credential(response.authResponse.accessToken);
            firebase.auth().signInWithCredential(facebookCredential)
              .then(success => {

                console.log(JSON.stringify("success", success));
                resolve(this.getProfileWithFirebaseUser(success, m_provider))
              });
          }).catch((error) => {
            console.log("error", error);

            reject(error)
          });
      })
    }
    else if (m_provider == "google") {
      return new Promise((resolve, reject) => {
        this.googlePlus.login({
          'webClientId': '783700927099-5dajidtpmtfj1e3k4720b3khgukaeul8.apps.googleusercontent.com',
        }).then(response => {
          console.log(response);
          const googleCrendential = firebase.auth.GoogleAuthProvider
            .credential(response.idToken);

          firebase.auth().signInWithCredential(googleCrendential)
            .then(success => {
              console.log(JSON.stringify(success));

              resolve(this.getProfileWithFirebaseUser(success, m_provider))
            })
            .catch(err => {
             alert(err+"error");

            })

        }).catch((error) => { reject(error) });
      })

    }

  }

  updateProfileChangeinServer(data2){
    console.log("updateProfileChangeinServer",data2);
    
    this.http.post("https://afternoon-mountain-15657.herokuapp.com/api/updateProfilenotificationId", data2).toPromise().then(data =>
    console.log(data) )
  }
  // getBrokerByName(){
  //   this.http.get("./assets/lot of data/brokers.json")
  //   .toPromise()
  //   .then((response) => {
      
  //      for (let index = 0; index < response["brokers"].length; index++) {
  //        if( response["brokers"][index].name == this.user.broker ){
  //         this.user.brokerimg=response["brokers"][index].img 
                  
  //        break}
  //      }
  //   })
  // }
  async initializeStore() {
    console.log("initializeStore");

    this.productMouth.appleProductId = "interactivecrypto.vip.month";
    this.productMouth.googleProductId = "interactivecrypto.vip.month";
    this.productMouth.name = "unlimited alerts (1 month)";

    this.productYear.appleProductId = "interactivecrypto.vip.year";
    this.productYear.googleProductId = "interactivecrypto.vip.year";
    this.productYear.name = "unlimited alerts (1 year)";


    if (!this.plt.is('cordova')) { return };
    var productMouth_id = ""
    var productYear_id = ""
    if (this.plt.is('ios')) {
      productMouth_id = this.productMouth.appleProductId
      productYear_id = this.productYear.appleProductId
    } else {
      productMouth_id = this.productMouth.googleProductId
      productYear_id = this.productYear.googleProductId
    }
 

    this.store.verbosity = this.store.INFO;
    this.store.refresh()
    InAppPurchase2.getPlugin().ready(() => {
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

      this.store.when(this.productMouth.appleProductId).cancelled(() => {
        console.log("cancelled")
      })
      this.store.when(this.productYear.appleProductId).cancelled(() => {
        console.log("cancelled")
      })

      this.store.when(this.productMouth.googleProductId).approved((product: IAPProduct) => {
        product.finish()
        this.user.state = "approved";
        this.updateIdOneSignals()
        console.log("approved")
      })
      this.store.when(this.productYear.appleProductId).approved((product: IAPProduct) => {
        product.finish()
        this.user.state = "approved";
        this.updateIdOneSignals()
        console.log("approved")
      })

      this.store.when(this.productYear.googleProductId).owned((product: IAPProduct) => {
        product.finish()
        this.updateIdOneSignals()
        this.user.state = "approved";
        console.log("owned")
      })
      this.store.when(this.productYear.appleProductId).owned((product: IAPProduct) => {
        product.finish()
        this.updateIdOneSignals()
        this.user.state = "approved";
        console.log("owned")
      })
    })
  }


  updateIdOneSignals(){
    console.log("updateIdOneSignals vip");

    return this.http.post("https://afternoon-mountain-15657.herokuapp.com/api/insertVipUser", {
      _id: this.user._id,
      notificationId: this.user.notificationId
    }).toPromise().
    then(aa=>console.log(aa)
    )
  }

  updatenotificationId(){
    console.log("updatenotificationId");

      if (!(document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080'))) {
      
      this.plt.ready().then(()=>{
        this.oneSignal.getIds().then(data=>{
          this.user.notificationId = data.userId
           this.http.post("https://afternoon-mountain-15657.herokuapp.com/api/updateProfilenotificationId", {
            _id: this.user._id,
            notificationId: this.user.notificationId
          }).toPromise().then(()=>{
          }).catch(()=>{
          })
        })
      })
    }
    
  }
  updatecountryData(){
    this.getContry().then((data)=>{
      console.log(data,"AAAa");
      
      this.http.post("https://afternoon-mountain-15657.herokuapp.com/api/updatecountryData", {
        _id: this.user._id,CountryModel:data
    }).toPromise().then(aa=>{
      console.log(aa,"aviho");
      
    })
  })
    
  }


  getContry(): Promise<CountryModel> {
    console.log("getContry");
    
    return new Promise((resolve, reject) => {
      if (this.localCountry.isRequested) {
        console.log("isRequested true");

        return this.localCountry;

      } else {
        console.log("https://afternoon-mountain-15657.herokuapp.com/get-location-data");
        
        this.http.get("https://afternoon-mountain-15657.herokuapp.com/get-location-data").toPromise()
          .then((data: CountryModel) => {
            console.log(data,"SS");

            Object.keys(this.localCountry).forEach(key => this.localCountry[key] = data[key]);
            this.localCountry.isRequested = true;
            
            this.http.get('assets/lot of data/countries.json')
              .toPromise()
              .then(response => {
                console.log(response);
                
                for (let index = 0; index < response["countries"].length; index++) {
                  if (((response["countries"][index].name) as string).toLocaleUpperCase() == (data.country as string).toLocaleUpperCase()) {
                    this.localCountry.dial_code = response["countries"][index].dial_code;
                    this.user.countryData= this.localCountry
                    break;
                  }
                }
                resolve(this.localCountry);
              })

          })
          .catch(err => {
            console.log(err);
            
            resolve(undefined)
          })
      }
    })
  }
  checkCode(verify_code): Promise<boolean> {
    return new Promise(resolve => {
      var data = {
        _id: this.user._id,
        verify_code: verify_code
      }
      this.http.post("https://afternoon-mountain-15657.herokuapp.com/api/matchUserVerifyCode", data).toPromise()
        .then(data => {
          console.log(data);

          if (data == "ok") {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          console.log("err", err);
          resolve(false);
        })
    })
  }
}

  