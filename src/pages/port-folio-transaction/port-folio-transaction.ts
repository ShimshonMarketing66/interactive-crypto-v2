import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { trigger, style, animate, transition, } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
// import { ToFixeNumberPipe } from '../../pipes/to-fixe-number/to-fixe-number';
import { HttpClient } from '@angular/common/http';
import { CryptoProvider } from '../../providers/crypto/crypto';
import { TrackEventProvider } from '../../providers/track-event/track-event';



@IonicPage({
  name:"port-folio-transaction"
})

@Component({
  selector: 'page-port-folio-transaction',
  templateUrl: 'port-folio-transaction.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateY(-100%)', opacity: 0 }),
          animate('300ms', style({ transform: 'translateY(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateX(0)', opacity: 1 }),
          animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
        ])
      ]
    )
  ]
})

export class PortFolioTransactionPage {
  loading: any;
  SUBMITBUTTON: string = ""
  flagForDate: boolean;
  PriceBTCPlaceholder: number = 0;
  PriceUSDPlaceholder: number = 0;
  PriceBTCInput: number
  PriceUSDInput: number 
  PriceBTC: boolean = false
  PriceUSD: boolean = false
  CurrenPrice: number = 0
  ComeForEdit: boolean
  ExistingTransaction: any
  Below: number;
  Above: number;
  error: string;
  AboveBox: boolean = false
  BelowBox: boolean = false
  Note: string = ""
  isAlert: boolean = false
  signtosymbol: string = ""
  Amount: number
  Price: number
  Exchange: string;
  Exchanges: any[];
  Pairs: any[]=[];
  Pair: string
  DateTransaction: any
  DateNow: string


  constructor(
    public trackEvent: TrackEventProvider,
        public auth: AuthDataProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public cryptoprovider:CryptoProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {

    var now = new Date();
    this.DateNow = now.toISOString().split('T')[0]

    if (navParams.get("transaction")) {
      this.SUBMITBUTTON = "UPDATE TRANSACTION"
      console.log("navParams.get('transaction')");
      this.ComeForEdit = true
      this.innitializeWithExistingParams()
    } else {
      this.SUBMITBUTTON = "ADD TRANSACTION"
      console.log("!navParams.get('transaction')");

      this.ComeForEdit = false
      this.innitializeWithNewParams()
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PortFolioTransactionPage');
  }


  innitializeTradingPairSelect(): Promise<any> {
    return new Promise(resolve => {
      for (let index = 0; index < this.cryptoprovider.arrAllCrypto.length; index++) 
        this.Pairs.push(this.cryptoprovider.arrAllCrypto[index].pair)
      
          resolve(this.cryptoprovider.arrAllCrypto[0].pair)
        })
  }

  innitializeExtchangeSelect(from: string, to: string, comeForInnitialize?: boolean): Promise<string> {

    return new Promise(resolve => {
      console.log('http://afternoon-mountain-15657.herokuapp.com/Exchanges/' + from + '/' + to);
      
      this.http.get('http://afternoon-mountain-15657.herokuapp.com/Exchanges/' + from + '/' + to).toPromise()
        .then((data  :any) => {
          if (!comeForInnitialize) {
            console.log("innitializeExtchangeSelect -> comeForInnitialize");
            console.log(data);
            for (let index = 0; index < data.length; index++) {
              if("Hitbtc" != data[index])
              this.Exchange=data[index];
            }
          }
          this.Exchanges = data ;
          resolve(data[0])
        })
    })
  }
  onSelectExchange() {
    let arr = this.Pair.split('_')
    this.getPrice(arr[0], arr[1], this.Exchange)
    this.getPriceToBtcAndUsd().then((prices)=>{
      this.PriceBTCPlaceholder = prices.BTC
      this.PriceUSDPlaceholder = prices.USD
      this.PriceBTCInput = prices.BTC
      this.PriceUSDInput = prices.USD
   })
  }

  onSelectPair() {
    let arr = this.Pair.split('_')
console.log(arr);

    if (arr[1] != "BTC" && arr[0] != "BTC") {
      this.PriceBTC = true
    } else {
      this.PriceBTC = false
    }
    if (arr[1] != "USD" && arr[0] != "USD") {
      this.PriceUSD = true
    } else {
      this.PriceUSD = false
    }

   
      this.innitializeExtchangeSelect(arr[0], arr[1]).then(ex => {
        this.getPrice(arr[0], arr[1], ex)
        this.getPriceToBtcAndUsd().then((prices)=>{
          this.PriceBTCPlaceholder = prices.BTC
          this.PriceUSDPlaceholder = prices.USD
          this.PriceBTCInput = prices.BTC
          this.PriceUSDInput = prices.USD
        })
      }) 
  }

  getPrice(from, to, ex, init?) {
console.log(from, to, ex, init);

    this.http.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + from + "&tsyms=" + to)
      .toPromise()
      .then(data => {
        console.log(data);
        
        this.CurrenPrice = (data["RAW"][from][to].PRICE)
        let a = this.CurrenPrice * 0.3;
        let b = this.CurrenPrice * 1.3;
        this.Below = this.toFixeNumber(a)
        this.Above = this.toFixeNumber(b)
        this.signtosymbol = (data["DISPLAY"][from][to].TOSYMBOL)
        if (!init) {
          this.Price = (data["RAW"][from][to].PRICE)
        }
      })
  }

  addTransaction() {
    this.error = ""
    console.log(this.Exchange, this.Pair, this.Price, this.Amount, this.isAlert, this.Note, this.AboveBox, this.BelowBox);
    if (this.isAlert) {
      if (!this.AboveBox && !this.BelowBox) {
        this.error ="You must select Above or Below"
        return
      }
      if (this.AboveBox && ((this.Above == null) || (this.Above < 0.0000001))) {
        this.error = "Please enter valid numerical <Above> amount"
        return
      }
      if (this.BelowBox && ((this.Below == null) || (this.Below < 0.0000001))) {
        this.error = "Please enter valid numerical <Below> amount"
        return
      }
    }
    if (this.Amount == null) {
      this.Amount = 1
    }
    if (this.Amount < 0.0000001) {
      this.error = "You must enter a valid amount"
      return
    }

    if (this.Price == null) {
      this.Price = this.CurrenPrice
    }

    if (this.Price < 0.0000001) {
      this.error = "You must enter a valid price"
      return
    }

    if (this.PriceBTC) {
      if (this.PriceBTCInput != null) {
        if (this.PriceBTCInput < 0.000000001) {
          this.error = "Please enter a valid numerical BTC Price"
          return
        }
      }
    }
    if (this.PriceUSD) {
      if (this.PriceUSDInput != null) {
        if (this.PriceUSDInput < 0.000000001) {
          this.error = "Please enter a valid numerical USD Price"
          return
        }
      }
    }

    //every thing is correct
    this.loading = this.loadingCtrl.create({ duration: 10000 })
    this.loading.present()

    let ab = 0, bl
    if (this.BelowBox) {
      bl = this.Below
    } else {
      bl = 0
    }
    if (this.AboveBox) {
      ab = this.Above
    } else {
      ab = 0
    }

    var tmpdata = {
      UserUid: this.auth.user._id,
      name: this.auth.user.first_name,
      phone: this.auth.user.phone_number,
      email: this.auth.user.email,
      FROMSYMBOL: this.Pair.split('_')[0],
      TOSYMBOL: this.Pair.split('_')[1],
      Exchange: this.Exchange,
      Persistent: false,
      Mailcheck: false,
      Above: ab,
      Below: Number(bl).toFixed(10).replace(/\.?0+$/, ""),
      SignToSymbole: this.signtosymbol,
      isAppend: false
    }

    if (this.ComeForEdit)
      if (this.ExistingTransaction.AlertID)
        tmpdata["_id"] = this.ExistingTransaction.AlertID

    if ((!this.isAlert && !this.ComeForEdit) || (!this.isAlert && this.ComeForEdit && !this.ExistingTransaction.AlertID)) {
      this.addTransactionInServe()
    } else if (this.isAlert && this.ComeForEdit && this.ExistingTransaction.AlertID) {
      this.setAlertInserverAndGetUid(tmpdata, "updateAlert").then(alertid => {
        this.addTransactionInServe(alertid)
      })
    } else if (!this.isAlert && this.ComeForEdit && this.ExistingTransaction.AlertID) {
      this.setAlertInserverAndGetUid(tmpdata, "DeleteAlert").then(alertid => {
        this.addTransactionInServe()
      })
    } else if ((this.isAlert && !this.ComeForEdit) || (this.isAlert && this.ComeForEdit && !this.ExistingTransaction.AlertID)) {
      this.setAlertInserverAndGetUid(tmpdata, "AddAlert").then(alertid => {
        this.addTransactionInServe(alertid)
        this.trackEvent.trackEvent("port-folio transaction","add alert");

      })
    }

  }

  addTransactionInServe(alertUid?) {
    let alertid
    if (alertUid == undefined) {
      alertid = false
    } else {
      alertid = alertUid
    }

    var data = {
      UserUid: this.auth.user._id,
      Exchange: this.Exchange,
      From: this.Pair.split('_')[0],
      To: this.Pair.split('_')[1],
      Amount: this.Amount,
      Note: this.Note,
      Date: this.DateTransaction,
      AlertID: alertid,
      Price: this.Price,
      signtosymbol:this.signtosymbol
    }


      //USD

      if (this.PriceUSD) {
        if (this.PriceUSDInput !=null) {
          data["CostInUSD"] = this.PriceUSDInput
        }else{
          data["CostInUSD"] = this.PriceUSDPlaceholder
        } 
      }else{
        if (this.Price !=null) {
          data["CostInUSD"] = this.Price
        }else{
          data["CostInUSD"] = this.Price
        } 
      }
      // if (this.Pair.split("/")[1] == "BTC") {
      //   data["CostInBTC"] = this.Price
      // } else {
      //   if (this.PriceBTCInput != null) {
      //     data["CostInBTC"] = this.PriceBTCInput
      //   } else {
      //     this.PriceBTCInput = this.PriceBTCPlaceholder
      //     data["CostInBTC"] = this.PriceBTCPlaceholder
      //   }
      // }


      //BTC

      if (this.PriceBTC) {
        if (this.PriceBTCInput !=null) {
          data["CostInBTC"] = this.PriceBTCInput
        }else{
          data["CostInBTC"] = this.PriceBTCPlaceholder
        } 
      }else{   
          data["CostInBTC"] = this.PriceBTCPlaceholder
      }
      

      console.log(data);
      
      // if (this.Pair.split("/")[1] == "USD") {
      //   data["CostInUSD"] = this.Price
      // } else {
      //   if (this.PriceUSDInput != null) {
      //     data["CostInUSD"] = this.PriceUSDInput
      //   } else {
      //     this.PriceUSDInput = this.PriceUSDPlaceholder
      //     data["CostInUSD"] = this.PriceUSDPlaceholder
      //   }
      // }

      this.postTransaction(data)
    
    //  else {
    //   this.getPriceToBtcAndUsd().then(Prices => {
    //     if (this.PriceBTC) {
    //       data["CostInBTC"] = Prices.BTC
    //     } else {
    //       data["CostInBTC"] = Prices.BTC
    //     }
    //     if (this.PriceBTC) {
    //       data["CostInUSD"] = this.PriceBTCInput == null ? this.PriceBTCInput : this.PriceBTCPlaceholder
    //     } else {
    //       data["CostInUSD"] = this.PriceUSDInput == null ? this.PriceUSDInput : this.PriceUSDPlaceholder
    //     }
    //     console.log(data);
    //     this.postTransaction(data)
    //   })
    // }
  }

  postTransaction(dataTransaction) {
    let action
    if (this.ComeForEdit) {
      action = "updateTransaction"
      console.log("this.ComeForEdit", this.ExistingTransaction._id);
      dataTransaction["_id"] = this.ExistingTransaction._id
    } else {
      action = "AddTransaction"
    }
    let header = new Headers();
    header.append('Content-Type', 'application/json');

    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/" + action, dataTransaction)
      .toPromise()
      .then((data) => {
        this.loading.dismiss()
        this.navCtrl.pop();
            this.trackEvent.trackView("port-folio transaction");

      }).catch((err) => {
        this.loading.dismiss()
        let alert = this.alertCtrl.create({
          title: 'Sorry!',
          subTitle: "Unable to add transaction right now - Please try again later",
          buttons: ['Ok']
        })
        alert.present()
      })
  }

  getPriceToBtcAndUsd(): Promise<any> {
    var prices = {}
    var TO_IS_BTC = false
    var TO_IS_USD = false

    console.log(this.Pair.split("_")[0],this.Pair);

    return new Promise<any>((resolve, reject) => {
      if (this.Pair.split("_")[1] == "BTC") {
        prices["BTC"] = this.Price
        TO_IS_BTC = true
      } else if (this.Pair.split("_")[1] == "USD") {
        TO_IS_USD = true
        prices["USD"] = this.Price
      }

      if (!TO_IS_USD && !TO_IS_BTC) {


        this.getPriceWithConvertion(this.Pair.split("_")[0], "USD", this.Exchange).then(data => {
          prices["USD"] = data.price
          this.getPriceWithConvertion(this.Pair.split("_")[0], "BTC", this.Exchange).then(data => {
            prices["BTC"] = data.price
            resolve(prices)
          }).catch(() => {
            reject("err")
          })
        })
      } else if (!TO_IS_BTC && TO_IS_USD) {
        if (this.Pair.split("_")[0] == "BTC") {
          prices["BTC"] = 1
          
          resolve(prices)
        } else {
          this.getPriceWithConvertion(this.Pair.split("_")[0], "BTC", this.Exchange).then(data => {
            prices["BTC"] = data.price
            resolve(prices)
          }).catch(() => {
            reject("err")
          })
        }
      } else { // TO_IS_BTC && !TO_IS_USD
        this.getPriceWithConvertion(this.Pair.split("_")[0], "USD", this.Exchange).then(data => {
          prices["USD"] = data.price
          console.log(data);
          
          resolve(prices)
        }).catch(() => {
          reject("err")
        })
      }
    })
  }


  getPriceWithConvertion(from, to, exchange): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      var a
      if (from == to) {
        a = {
          price: 1
        }
        console.log("jjj");
        
        resolve(a)
      } else {
        console.log("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + from + "&tsyms=" + to);
        
        var url = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + from + "&tsyms=" + to 
        this.http.get(url).toPromise().then((data) => {
          if (data["Response"] != undefined) {
            var toTmp = to == "USD" ? "BTC" : "USD"
            this.convertion(from, toTmp, to, exchange).then(PriceData => {
              console.log(from, toTmp, to,this.Pair);
              
              resolve(PriceData)
            })
              .catch(err => {
                reject(err)
              })
          } else {
            let tofixedPrice = (data["RAW"][from][to].PRICE) < 1 && (data["RAW"][from][to].PRICE) > -1 ? 6 : 2
            var price = Number(Number(data["RAW"][from][to].PRICE).toFixed(tofixedPrice))
            a = {
              price: price
            }
            resolve(a)
          }
        })
      }
    })
  }

  convertion(fromRequire, toTmp, toRequire, exchange): Promise<any> {
    console.log(fromRequire + "/" + toRequire + " is called by asking to convert it with " + toTmp);

    return new Promise<any>((resolve, reject) => {
    
      var url1 = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + fromRequire + "&tsyms=" + toTmp
      this.http.get(url1,{responseType:'json'}).toPromise().then((data1) => {
        
        if (data1["Response"] != undefined) {//si renvoie qq chose il ya une erreure
          //error... we need to think what todo
          console.log("a");
          
          reject("error")
        } else {

          var fromRequire_ToTmp_Value = data1["RAW"][fromRequire][toTmp].PRICE

          //call btc/usd
          console.log("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + toTmp + "&tsyms=" + toRequire );
          
          var url = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + toTmp + "&tsyms=" + toRequire
          this.http.get(url,{responseType:'json'}).toPromise().then((data) => {
            console.log(data);

            if (data["Response"] != undefined) {
              //error... low chance that happens.... beacause every time the call of btc/usd or usd btc exist for every exchange
              console.log("a");
              reject("error")
            } else {
              console.log("b");

              var toTmptoRequireValue = data["RAW"][toTmp][toRequire].PRICE
              var fromRequiretoRequireValue = this.toFixeNumber(toTmptoRequireValue * fromRequire_ToTmp_Value)
              var a = {
                price: fromRequiretoRequireValue
              }
              resolve(a)
            }
          })
        }
      })
    })
  }

  setAlertInserverAndGetUid(dataForTheDatabase: any, action: string): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      let header = new Headers();
      header.append('Content-Type', 'application/json');
      this.http.post('https://afternoon-mountain-15657.herokuapp.com/api/' + action, dataForTheDatabase)
        .toPromise()
        .then((AlertUid) => {
          if (action == "AddAlert") {
            resolve(AlertUid["data"].insertedIds["0"])
          } else if (action == "updateAlert") {
            resolve(this.ExistingTransaction.AlertID)
          } else {
            resolve(true)
          }

          // console.log(AlertUid.json().data.insertedIds["0"]);
        })
        .catch(err => {
          reject(err)
        })
    });
    return promise
  }



  innitializeWithExistingParams() {
    this.ExistingTransaction = this.navParams.get("transaction")
    console.log(this.ExistingTransaction);

    this.DateTransaction = this.ExistingTransaction.data
    this.Price = this.ExistingTransaction.Price
    this.CurrenPrice = this.Price
    this.Amount = this.ExistingTransaction.Amount
    this.Note = this.ExistingTransaction.Note
    this.DateTransaction = this.ExistingTransaction.Date
    this.Pair = this.ExistingTransaction.From + "_" + this.ExistingTransaction.To
    this.Exchange = this.ExistingTransaction.Exchange

    this.PriceUSDPlaceholder = this.ExistingTransaction.CostInUSD
    this.PriceBTCPlaceholder = this.ExistingTransaction.CostInBTC

    this.PriceBTCInput = this.ExistingTransaction.CostInBTC 

    this.PriceUSDInput = this.ExistingTransaction.CostInUSD
    this.flagForDate = true


    this.innitializeTradingPairSelect()
    let arr = this.Pair.split('_')

    if (arr[1] = "BTC") {
      this.PriceBTC = true
    }
    if (arr[1] != "USD") {
      this.PriceUSD = true
    }
    console.log("aaaa");
    
    // this.innitializeExtchangeSelect(arr[0], arr[1], true)

console.log(arr[0], arr[1], this.Exchange, true);

    // this.getPrice(arr[0], arr[1], this.Exchange, true)
    if (this.ExistingTransaction.AlertID) {
      this.isAlert = true
      let header = new Headers();
      header.append('Content-Type', 'application/json');
      this.http.post(
        "https://afternoon-mountain-15657.herokuapp.com/api/getAlerts",
        {
          "UserUid": this.auth.user._id
        })
        .toPromise()
        .then((alerts :any)   => {
          for (let index = 0; index < alerts.length; index++) {
            if (alerts[index]._id == this.ExistingTransaction.AlertID) {
              if (alerts[index].Above) {
                this.AboveBox = true
                this.Above = alerts[index].Above
              }
              if (alerts[index].Below) {
                this.BelowBox = true
                this.Below = alerts[index].Below
              }
            }
          }
        })
    } else {
      let a = this.CurrenPrice * 0.3;
      let b = this.CurrenPrice * 1.3;
      this.Below = this.toFixeNumber(a)
      this.Above = this.toFixeNumber(b)
    }
  }

  innitializeWithNewParams() {
    this.DateTransaction = this.DateNow
    this.innitializeTradingPairSelect().then(pair => {
      console.log(pair);
      if(this.navParams.get('pair'))
      this.Pair = this.navParams.get('pair');
      else
      this.Pair = pair;
      let arr = pair.split('_') 
      arr[1] != "USD"&&arr[0] != "USD"?this.PriceUSD=true:this.PriceUSD=false
      arr[1] != "BTC"&&arr[0] != "BTC"?this.PriceBTC=true:this.PriceBTC=false
      // this.innitializeExtchangeSelect(arr[0], arr[1], false).then(exchange => {
        console.log("this.getPrice(",arr[0], arr[1]);
        
        this.getPrice(arr[0], arr[1], "")
        this.getPriceToBtcAndUsd().then((prices)=>{
          this.PriceBTCPlaceholder = prices.BTC
          this.PriceUSDPlaceholder = prices.USD
        })
      })
    // })
  }

  changeDate() {
    return
    // if (this.DateNow != this.DateTransaction) {
    //   if (this.flagForDate) return
    //   this.flagForDate = true
    //   let arr = this.Pair.split('/')
    //   if (this.DateTransaction != this.DateNow) {
    //     if (arr[1] != "USD") {
    //       this.PriceUSD = true
    //       this.getPriceWithConvertion(this.Pair.split("/")[0], "USD", this.Exchange).then(Price => {
    //         this.PriceUSDInput = Price.price
    //         this.PriceUSDPlaceholder = Price.price
    //       })
    //     } else {
    //       this.PriceUSD = false
    //     }
    //     if (arr[1] != "BTC") {
    //       this.PriceBTC = true
    //       this.getPriceWithConvertion(this.Pair.split("/")[0], "BTC", this.Exchange).then(Price => {
    //         this.PriceBTCPlaceholder = Price.price
    //         this.PriceBTCInput = Price.price
    //       })
    //     } else {
    //       this.PriceBTC = false
    //     }
    //   }
    // } else {
    //   this.flagForDate = false
    //   this.PriceBTC = false
    //   this.PriceUSD = false
    // }
  }

  toFixeNumber(num?: number): number {
    if (num == undefined) return 0
    console.log(num);
    if (num == 0) return 0
    let isPositive = true
    if (num < 0) {
      isPositive = false
      num *= -1
    }

    if (num < 100) {
      if (num < 0.01) {
        if (num < 0.001) {
          if (num < 0.0001) {
            if (num < 0.00001) {
              if (num < 0.000001) {
                if (num < 0.0000001) {
                  if (num < 0.00000001) {
                    if (num < 0.000000001) {
                      if (num < 0.0000000001) {
                        if (num < 0.00000000001) {
                          if (num < 0.000000000001) {
                            if (num < 0.0000000000001) {
                              return isPositive ? Number(num.toFixed(14)) : Number(num.toFixed(14)) * -1
                            }
                            return isPositive ? Number(num.toFixed(13)) : Number(num.toFixed(13)) * -1
                          }
                          return isPositive ? Number(num.toFixed(12)) : Number(num.toFixed(12)) * -1
                        }
                        return isPositive ? Number(num.toFixed(11)) : Number(num.toFixed(11)) * -1
                      }
                      return isPositive ? Number(num.toFixed(10)) : Number(num.toFixed(10)) * -1
                    }
                    return isPositive ? Number(num.toFixed(9)) : Number(num.toFixed(9)) * -1
                  }
                  return isPositive ? Number(num.toFixed(8)) : Number(num.toFixed(8)) * -1
                }
                return isPositive ? Number(num.toFixed(7)) : Number(num.toFixed(7)) * -1
              }
              return isPositive ? Number(num.toFixed(6)) : Number(num.toFixed(6)) * -1
            }
            return isPositive ? Number(num.toFixed(5)) : Number(num.toFixed(5)) * -1
          }
          return isPositive ? Number(num.toFixed(4)) : Number(num.toFixed(4)) * -1
        }
        return isPositive ? Number(num.toFixed(3)) : Number(num.toFixed(3)) * -1
      }
      return isPositive ? Number(num.toFixed(2)) : Number(num.toFixed(2)) * -1
    }
    return isPositive ? Number(num.toFixed(2)) : Number(num.toFixed(2)) * -1
  }
}
