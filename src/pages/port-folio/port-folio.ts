import { Component, ChangeDetectionStrategy, NgZone, Pipe, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, MenuController,App, Slides } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import * as io from "socket.io-client";
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { Screenshot } from '@ionic-native/screenshot';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TrackEventProvider } from '../../providers/track-event/track-event';
// import { ToFixeNumberPipe } from '../../pipes/to-fixe-number/to-fixe-number';


declare var CCC;

@Pipe({ name: 'toFixeNumber' })
@IonicPage({
  name:"port-folio"
})

@Component({
  selector: 'page-port-folio',
  templateUrl: 'port-folio.html',
})


export class PortFolioPage {
  @ViewChild('mySlider') slider: Slides;
  private readonly Portfolio: string = "PORTFOLIO";
  private readonly HISTORY: string = "HISTORY";
  selectedSegment:string=this.Portfolio;
  slides: string[];
//histori
TransactionsClosed:any []
SignToSignSymbol: string = "$"

  counterInterval: number = 0;
  socket: any
  PortfolioValue: number = 0
  GainValue: number = 0
  IsProfitShowChange: boolean = false;
  BTC_USD: any;
  priceBTC: number = 0;
  ToSignSymbol: string = "USD"
  TotalCost: number = 0;
  TotalProfit: number = 0;
  intervalForValues: any

  Transactions: Array<{
    Price: number;
    UserId: string;
    _id: string
    AlertID: string;
    Note: string;
    Exchange: string;
    From: string;
    To: string;
    CostInUSD: number;
    CostInBTC: number;
    Amount: number;
    Date: string;
    Cost: number
    GainValue: number
    AmountMultCost: number
    Gain: any;
    CurrentPrice: number
    BackgroundColor: string
    CurrentChange24H: number
  }> = [];
  ionViewDidLoad() {
  }
constructor(
  public app:App,
  public trackEvent: TrackEventProvider,
      public menu: MenuController,
    public zone: NgZone,
    public alertCtrl: AlertController,
    public socialSharing: SocialSharing,
    public screenshot: Screenshot,
    public AuthData: AuthDataProvider,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public http: Http,
    public navParams: NavParams) {
      this.slides = [ this.Portfolio, this.HISTORY];

      if (!this.AuthData.user._id) {
        this.app.getRootNav().push("connection")
      }
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
    this.IsProfitShowChange = false;
    this.ToSignSymbol = "USD";
    this.SignToSignSymbol = "$";
    this.menu.swipeEnable(true);
    if ( this.socket != undefined) {
      this.socket.disconnect()
    }
    this.zone.run(() => {
      clearInterval(this.intervalForValues);
    })
  }

  ionViewDidEnter() {

    this.menu.swipeEnable(false)

    this.initializeTransactions().then(() => {
      for (let index = 0; index < this.Transactions.length; index++) {
        this.Transactions[index].Cost = this.Transactions[index].CostInUSD
      }

      this.intervalForValues = setInterval(() => {
        console.log("sdfjk");
        
        for (let index = 0; index < this.Transactions.length; index++) {
          this.getPrice(this.Transactions[index].From, this.ToSignSymbol, this.Transactions[index].Exchange, index).then((PriceData) => {
            let a = {
              From: this.Transactions[PriceData.i].From,
              Exchange: this.Transactions[PriceData.i].Exchange,
              Price: PriceData.price,
              Change: PriceData.change
            }
            this.gotNewPrice(a, "api");
          })
        }
      }, 7000)

      this.ValuesTransactions()
    })
    this.trackEvent.trackView("port folio")

  }

  getPrice(from, to, exchange, i): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      var a

      if (from == to) {
        a = {
          price: 1,
          change: 0,
          i: i
        }
        resolve(a)
      } else {
        var url = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + from + "&tsyms=" + to 
        this.http.get(url).toPromise().then((data) => {
          if (data.json().Response != undefined) {
            var toTmp = to == "USD" ? "BTC" : "USD"
            this.convertion(from, toTmp, to, exchange, i).then(PriceData => {
              resolve(PriceData)
            })
              .catch(i => {
                reject(i)
              })
          } else {
            var price = data.json().RAW[from][to].PRICE
            var change = data.json().RAW[from][to].CHANGEPCT24HOUR
            a = {
              price: price,
              change: change,
              i: i
            }
            resolve(a)
          }
        })
      }
    })
  }

  getOnPercent(OldPrice, NewPrice): number {
    if (OldPrice == 0 && NewPrice==0) {
      return 0
    }
    
    var result = 0
    result = ((NewPrice - OldPrice) / OldPrice) * 100

    return result
  }

  initializeTransactions(): Promise<any> {  /// function that return all transactions of this user from the server...... now for example we use our array 
    return new Promise((resolve, reject) => {
      let header = new Headers({
        'Content-Type': 'application/json'
      });
      let loading = this.loadingCtrl.create({duration:10000})
      loading.present()
      let dataFoServer = {
        UserUid: this.AuthData.user._id
      }
      this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/getTransaction", JSON.stringify(dataFoServer), { headers: header }).toPromise()
        .then((res) => {
          this.Transactions = res.json()
          console.log(res.json());
          
          loading.dismiss()
          resolve(res)
        })
        .catch(err => {
          reject(err)
          loading.dismiss()
          console.log(err);
        })
    })
  }

  //TODO
  CloseTransaction(i, slidingItem) {
    let header = new Headers({
      'Content-Type': 'application/json'
    });

    if (this.Transactions[i].AlertID) {
      let a = {
        _id: this.Transactions[i].AlertID
      }  
      this.http.post("https://afternoon-mountain-15657.herokuapp.com/api/DeleteAlert", a, { headers: header })
      .toPromise()
      .then(()=>{})
    }
    
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/closeTransaction",JSON.stringify(this.Transactions[i]), { headers: header }).toPromise()
    .then(()=>{})
    slidingItem.close()
    this.Transactions.splice(i, 1);
    this.calculateTotals()
  }

  AddTransaction(i, slidingItem) {
    this.Transactions.push(i)

  }

  DeleteTransaction(i, slidingItem) {

    slidingItem.close()
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    let loading = this.loadingCtrl.create({duration:10000})
    let dataToServer = {
      _id: this.Transactions[i]._id
    }
    if (this.Transactions[i].AlertID) {
      let a = {
        _id: this.Transactions[i].AlertID
      }  
      this.http.post("https://afternoon-mountain-15657.herokuapp.com/api/DeleteAlert", a, { headers: header })
      .toPromise()
      .then(()=>{})
    }
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/DeleteTransaction", JSON.stringify(dataToServer), { headers: header }).toPromise()
      .catch(err => {
        let alert = this.alertCtrl.create({
          title: 'Sorry!',
          subTitle: "Unable to delete your transaction right now - Please try again later ",
          buttons: ['Ok']
        })
        alert.present()
      }).then(()=>{
        this.trackEvent.trackEvent("port-folio","delete transaction")
      })
    this.Transactions.splice(i, 1);
    this.calculateTotals()
  }



  convertion(fromRequire, toTmp, toRequire, exchange, i): Promise<any> {
    console.log(fromRequire + "/" + toRequire + " is called by asking to convert it with " + toTmp);

    return new Promise<any>((resolve, reject) => {
      var url1 = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + fromRequire + "&tsyms=" + toTmp
      //console.log(url1);

      //call cvc/btc
      this.http.get(url1).toPromise().then((data1) => {
        if (data1.json().Response != undefined) {//si renvoie qq chose il ya une erreure
          //error... we need to think what todo
          reject(i)
        } else {

          var fromRequire_ToTmp_Value = data1.json().RAW[fromRequire][toTmp].PRICE
          var fromRequire_ToTmp_Change = data1.json().RAW[fromRequire][toTmp].CHANGEPCT24HOUR

          //call btc/usd
          var url = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + toTmp + "&tsyms=" + toRequire 
          this.http.get(url).toPromise().then((data) => {
            if (data.json().Response != undefined) {
              //error... low chance that happens.... beacause every time the call of btc/usd or usd btc exist for every exchange
              reject(i)
            } else {
              var toTmptoRequireValue = data.json().RAW[toTmp][toRequire].PRICE
              var toTmptoRequireValueChange = data.json().RAW[toTmp][toRequire].CHANGEPCT24HOUR
              var fromRequiretoRequireValue = toTmptoRequireValue * fromRequire_ToTmp_Value
              var fromRequiretoRequireChange = toTmptoRequireValueChange * fromRequire_ToTmp_Change
              console.log(fromRequiretoRequireValue);
              
              var a = {
                price: fromRequiretoRequireValue,
                change: toTmptoRequireValueChange,
                i: i
              }
              resolve(a)
            }
          })
        }
      })

      var url = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + toTmp + "&tsyms=" + toRequire 

    })
  }

  calculateTotals() {

    var tmpTotalProfit = 0
    let PortfolioValuetmp = 0
    let TotalCosttmp = 0

    for (let index = 0; index < this.Transactions.length; index++) {
      PortfolioValuetmp += Number(this.Transactions[index].GainValue)
      TotalCosttmp += this.Transactions[index].Amount * this.Transactions[index].Cost
    }
    this.TotalCost = TotalCosttmp
    this.PortfolioValue = PortfolioValuetmp

    this.TotalProfit = (Number(Number(this.PortfolioValue) - Number(this.TotalCost)))

  }

  changeTotalProfitShow() {
    if (this.IsProfitShowChange) {
      this.IsProfitShowChange = false

      this.TotalProfit = this.PortfolioValue - this.TotalCost//ne rend pas bonne valeur
      //console.log( this.TotalProfit,'(this.PortfolioValue - this.TotalCost).toString()');

      for (let index = 0; index < this.Transactions.length; index++) {
        let a = (this.Transactions[index].GainValue - this.Transactions[index].AmountMultCost)
        this.Transactions[index].Gain = (Number(a))
      }
    } else {
      this.IsProfitShowChange = true

      this.TotalProfit = this.getOnPercent(this.TotalCost, this.PortfolioValue)
      //console.log(this.TotalProfit,'(this.getOnPercent(this.TotalCost, this.PortfolioValue).toString())');
      for (let index = 0; index < this.Transactions.length; index++) {
        this.Transactions[index].Gain = this.getOnPercent(this.Transactions[index].AmountMultCost, this.Transactions[index].GainValue)
      }
    }
  }

  getOnValue(Price, CurrentPrice): Number {
    var result = 0
    result = ((CurrentPrice - Price) / Price) * 100
    return result
  }

  ValuesTransactions() { //called only at first time
    var promise_i = 0
    for (let index = 0; index < this.Transactions.length; index++) {
      this.Transactions[index]["AmountMultCost"] = this.Transactions[index]["Cost"] * this.Transactions[index]["Amount"]

      this.getPrice(this.Transactions[index].From, this.ToSignSymbol, this.Transactions[index].Exchange, index).then((PriceData) => {

        this.Transactions[PriceData.i]["CurrentPrice"] = Number(PriceData.price)

        this.Transactions[PriceData.i]["CurrentChange24H"] = Number(PriceData.change)

        this.Transactions[PriceData.i]["GainValue"] = this.Transactions[PriceData.i].Amount * this.Transactions[PriceData.i].CurrentPrice

      //  this.Transactions[PriceData.i]["GainValue"] = Number(this.Transactions[PriceData.i]["GainValue"])

        this.Transactions[PriceData.i]["Gain"] = this.Transactions[PriceData.i]["GainValue"]  - this.Transactions[PriceData.i]["AmountMultCost"]

        promise_i++
        if (promise_i == this.Transactions.length) {
          this.calculateTotals()
          this.connectToSocket("https://streamer.cryptocompare.com/")

        }
      })
    }
  }

 

  changeShowMode() {
    if (this.ToSignSymbol != "USD") {
    this.socket.disconnect()
    this.ToSignSymbol = "USD"
    this.SignToSignSymbol = "$"
    for (let index = 0; index < this.Transactions.length; index++) {
      this.Transactions[index].Cost = this.Transactions[index].CostInUSD
    }
    this.ValuesTransactions()
  }else{
    this.socket.disconnect()
    this.ToSignSymbol = "BTC"
    this.SignToSignSymbol = "Ƀ"
    for (let index = 0; index < this.Transactions.length; index++) {
      this.Transactions[index].Cost = this.Transactions[index].CostInBTC
    }
    this.ValuesTransactions()
  }
  }

  clearBackground(i?) {
    if (i != null) {
      setTimeout(() => {
        this.Transactions[i].BackgroundColor = "none"
      }, 2000)
      return
    }
    for (let index = 0; index < this.Transactions.length; index++) {
      this.Transactions[index].BackgroundColor = "none"
    }
  }


  connectToSocket(url) {
    console.log(this.Transactions);

    var all_pairs = []
    var flag = true
    for (let index = 0; index < this.Transactions.length; index++) {
      for (let j_index = 0; j_index < index; j_index++) {
        if (((this.Transactions[j_index].From == this.Transactions[index].From) && (this.Transactions[j_index].Exchange == this.Transactions[index].Exchange)) || this.Transactions[index].From != this.ToSignSymbol) {
          flag = false
          break
        }
      }
      if (flag) {
        all_pairs.push({
          From: this.Transactions[index].From,
          Exchange: this.Transactions[index].Exchange
        })
      }
      flag = true
    }
    var TOSYM = this.ToSignSymbol
    var arr = []
    for (var i = 0; i < all_pairs.length; i++) {
      let channel = "2~" + all_pairs[i].Exchange
      arr.push(all_pairs[i].From + "_" + TOSYM)
    }

    this.socket = io.connect("https://crypto.tradingcompare.com/");

    this.socket.emit("room", arr);
    var that = this
    this.socket.on("message", function (message) {
      console.log(message);
      
      var res={
        FROMSYMBOL:message.pair.split("_")[0],
        TOSYMBOL:message.pair.split("_")[1],
        PRICE:message.price,
        MARKET:message.marketcap
      }
        that.dataUnpack(res);
      
    });
  }

  dataUnpack(data) {

    var from = data['FROMSYMBOL'];
    var to = data['TOSYMBOL'];
    if (data['PRICE'] != undefined) {
      let a = {
        Price: data['PRICE'],
        From: from,
        Exchange: data['MARKET']
      }
      this.gotNewPrice(a, "socket")
    }
  };

  gotNewPrice(PriceData, str) {

    console.log(str,PriceData);


    if (isNaN(PriceData.Price) || PriceData.From == this.ToSignSymbol || PriceData.change == NaN) {
      return
    }
    let PortfolioValueTMP = this.PortfolioValue
    for (let index = 0; index < this.Transactions.length; index++) {
      //get price. check if this transaction match the price that arrived
      if ((PriceData.Exchange == this.Transactions[index].Exchange) && (PriceData.From == this.Transactions[index].From)) {

        if (this.toFixeNumber(Number(this.Transactions[index]["CurrentPrice"])) > this.toFixeNumber(Number(Number(PriceData.Price)))) {
          this.Transactions[index]["BackgroundColor"] = "#ff0000"
          this.clearBackground(index);
        } else if (this.toFixeNumber(Number(this.Transactions[index]["CurrentPrice"])) < this.toFixeNumber(Number(Number(PriceData.Price)))) {
          this.Transactions[index]["BackgroundColor"] = "#00c500"
          this.clearBackground(index);
        }

        let k = this.Transactions[index]["CurrentPrice"]

        this.Transactions[index]["CurrentPrice"] = (Number(PriceData.Price))

        let b = Number(Number(100 * k) / Number(Number(this.Transactions[index].CurrentChange24H) + 100))

        this.Transactions[index]["CurrentChange24H"] = Number((PriceData.Price - b) / b) * 100

        let a = this.Transactions[index]["GainValue"]


        this.Transactions[index]["GainValue"] = this.Transactions[index].Amount * PriceData.Price



        if (this.IsProfitShowChange) {
          this.Transactions[index]["Gain"] = (this.getOnPercent(this.Transactions[index].AmountMultCost, this.Transactions[index]["GainValue"]))
        } else {
          this.Transactions[index]["Gain"] = this.Transactions[index]["GainValue"] - this.Transactions[index]["AmountMultCost"]
        }


        this.Transactions[index]["Gain"] = Number(this.Transactions[index]["Gain"])
        //console.log(this.Transactions[index]["Gain"]);

        if (this.IsProfitShowChange) {
          this.Transactions[index]["Gain"]
        } else {
          this.Transactions[index]["Gain"]
        }

        PortfolioValueTMP += Number(Number(this.Transactions[index]["GainValue"])) - a
        //console.log( this.PortfolioValue,'Number(Number(this.Transactions[index]["GainValue"])');


        if (this.IsProfitShowChange) {
          this.TotalProfit = Number(this.getOnPercent(this.TotalCost, PortfolioValueTMP))
        } else {
          this.TotalProfit = Number((Number(PortfolioValueTMP) - Number(this.TotalCost)))
        }

      }

    }

    this.PortfolioValue = PortfolioValueTMP
  }
  addTransaction() {
    if(this.AuthData.user._id)
    this.navCtrl.push("port-folio-transaction")
    else{
      this.app.getRootNav().setRoot("connection")
    }
  }

  toFixeNumber(num?: number): number {
    if (num == undefined) return 0
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

  share() {
    let loading = this.loadingCtrl.create()
    loading.present()
    loading.dismiss()
    this.screenshot.URI(80).then((res) => {
      this.socialSharing.share('Check out my portfolio !', 'Check out my portfolio !', res.URI, null).then(()=>loading.dismiss(), (err) => {
       
        let alert = this.alertCtrl.create({
          title: 'Ooops!',
          subTitle: err,
          buttons: ['OK']
        })
      });
    }, (err) => {
      loading.dismiss()
      let alert = this.alertCtrl.create({
        title: 'Ooops!',
        subTitle: err,
        buttons: ['OK']
      });
      console.log(err);
    });
  }

  EditTransaction(i, slidingItem) {
    slidingItem.close()
    this.navCtrl.push('port-folio-transaction', {
      transaction: this.Transactions[i]
    })
  }

  gotoHistory(){
    this.navCtrl.push("port_folio-historic")
  }
  onSlideChanged(slider) {
    console.log(slider);
    
    if (slider.getActiveIndex() == 3) return;

    const currentSlide = this.slides[slider.getActiveIndex()];
    if (currentSlide == undefined) return;
    var prevIndex = this.slides.indexOf(this.selectedSegment)
    this.changeSegment(currentSlide);

  }

  changeSegment(segment) {

    this.selectedSegment=segment;
    console.log('changeSegment', segment,this.selectedSegment);

    const selectedIndex = this.slides.findIndex((slide) => {
      return slide === segment;
    });
    this.slider.slideTo(selectedIndex);
    if(this.selectedSegment=="HISTORY")
    this.gethistory()
  }
  gethistory(){

   let header = new Headers();
    let loading = this.loadingCtrl.create({duration:10000})
    loading.present()
    header.append('Content-Type', 'application/json');
    console.log(this.AuthData.user._id);
    let dataFoServer = {
      UserUid: this.AuthData.user._id
    }
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/getClosedTransaction",  JSON.stringify(dataFoServer), { headers: header })
    .toPromise()
    .then(transition=>{
      console.log(transition.json());
      this.TransactionsClosed = transition.json()
      for (let index = 0; index <  this.TransactionsClosed.length; index++) {
        this.TransactionsClosed[index]["GainPrricePercent"] = this.getOnPercent(this.TransactionsClosed[index].CostInUSD,this.TransactionsClosed[index].ClosedPrice)
      }
      loading.dismiss()
    })
    .catch((err)=>{
      console.log(err);
      loading.dismiss()
    })
  }

}
