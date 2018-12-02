import { Component, ViewChild, HostListener, ElementRef, NgZone,trigger, transition, animate, keyframes, style } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Platform,Content, App ,ModalController,ModalOptions } from 'ionic-angular';
import * as io from "socket.io-client";
import { CryptoProvider } from '../../providers/crypto/crypto';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { Deeplinks } from '@ionic-native/deeplinks';
import { LoginPage } from '../login/login';
import { TrackEventProvider } from '../../providers/track-event/track-event';
import { AppRate } from '@ionic-native/app-rate';

@HostListener('scroll', ['$event'])
@HostListener("click", ["$event"])

@IonicPage({
  name:"allcoin"
})
@Component({
  selector: 'page-allcoin',
  templateUrl: 'allcoin.html',
  animations: [
    trigger("changeBackgroundColor", [
      transition("falling1 => falling, falling => falling1,raising => falling,raising => falling1,raising1 => falling,raising1 => falling1,none => falling,none => falling1",
        [
          animate("0.6s",
            keyframes([
              style({ color: "#e34c47", offset: 0 }),
              style({ backgroundColor: "#ef4364", offset: 0, opacity: 0.5 }),
              style({ backgroundColor: "#2b2b2b", offset: 1 })
            ])
          )]
      ),
      transition("raising1 => raising, raising => raising1,falling => raising,falling => raising1,falling1 => raising,falling1 => raising1,none => raising1,none => raising",
        [
          animate("0.6s",
            keyframes([
              style({ backgroundColor: "#05bd9b", opacity: 0.5 }),
              style({ backgroundColor: "#2b2b2b", })
            ])
          )]
      )
    ])
  ]
})
export class AllcoinPage {
    /*  DEFINITIONS CONSTANTS*/

  private readonly CRYPTO: string = "CRYPTO";
  private readonly WATCHLIST: string = "WATCHLIST";
  private readonly TRENDING: string = "TRENDING";
  /*  END DEFINITIONS CONSTANTS*/

  private readonly sizeOfLine: number = 45;
  sizeOfBody: number;
  numOfLines: number;
  @ViewChild('mySlider') slider: Slides;
  @ViewChild('containerSegment') containerSegment: ElementRef;
  @ViewChild('content') content: Content;
  /* CRYPTO */
  offsetRequested:number=0;
  cryptoConterSquares: number = 20;
  cryptoSquares: any[] = [];
  CoinConnectedWSCrypto: any[] = [];
  ScrollFromTopCrypto: number = 0;
  ScrollDoneCrypto: boolean = true;
  cryptos: any = [];
  cryptosWatchlist: any = [];
  cryptosTrending: any = [];
  allcryptos:any=[];
  socketCrypto: SocketIOClient.Socket;
  public selectedSegment: string = this.CRYPTO;
  public slides: Array<string>;

  icon: string = "md-create";
  edit: boolean = false;
  constructor(public navCtrl: NavController,
    public authData:AuthDataProvider, 
    public platform: Platform,
    public zone: NgZone,
    public app:App,
    public modalCtrl: ModalController,
    public trackEvent: TrackEventProvider,
    private deeplinks: Deeplinks,
    public cryptoProvider: CryptoProvider,
    private appRate: AppRate,
    public navParams: NavParams) {
      this.sizeOfBody = window.screen.height - (this.platform.is("ios") ? 180 : 199);
      this.numOfLines = Math.ceil(this.sizeOfBody / this.sizeOfLine);
  
      this.slides = [ this.CRYPTO, this.WATCHLIST, this.TRENDING];
      this.buildCrypto();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllcoinPage');
    this.trackEvent.trackView("AllcoinPage")

    if (!this.platform.is('cordova')) return
    this.deeplinks.routeWithNavController(this.navCtrl, {
     '/vip':"vip",
     '/settings':"settings",
     '/chart/:pair/':"chart",
     '/news/':"news",

    }).subscribe((match) => {
      // match.$route - the route we matched, which is the matched entry from the arguments to route()
      // match.$args - the args passed in the link
      // match.$link - the full link data
    console.log('Successfully matched route'+JSON.stringify( match) );
    }, (nomatch) => {
      // nomatch.$link - the full link data
      console.log('Got a deeplink that didn\'t match'+JSON.stringify(  nomatch) );
     });
     if(!this.authData.user._id)
     setTimeout(() => {
      const myModalOptions: ModalOptions = {
        cssClass: "settings-popup"
      };
      const myModal = this.modalCtrl.create("pop-up", null, myModalOptions)
      myModal.present();
    
  }, 10*1000);
  }
  buildCrypto() {
      this.CoinConnectedWSCrypto=[];
      this.cryptoProvider.getAllCrypto().then(data => {
        this.allcryptos = data;
        console.log( this.allcryptos);
        
        let arr = [];
        this.doInfinite().then(()=>{

      console.log( this.numOfLines," this.numOfLines");
      
        for (let index = 0; index < this.cryptos.length; index++) {
          if (index < this.numOfLines) {
            this.CoinConnectedWSCrypto.push(this.cryptos[index]);
            arr.push(this.cryptos[index].pair);
          }
        }
        if( this.content)
        this.content.scrollTop = this.ScrollFromTopCrypto;
          this.startWS(this.CRYPTO);
          this.addCoinWebsocketCrypto(arr);
            })
    
    })
    setTimeout(() => {
      console.log("appRate");
      
      this.appRate.preferences = {
        displayAppName: 'Interactiv-crypto App',
        usesUntilPrompt:8,
        promptAgainForEachNewVersion: false,
        simpleMode:true,
        storeAppURL : {
  ios: '1291765934',
  android: 'market://details?id=com.interactive_crypto.app'
},
customLocale: {
  title: 'Do you enjoy %@?',
  message: 'If you enjoy using %@, would you mind taking a moment to rate it? Thanks so much!',
  cancelButtonLabel: 'No, Thanks',
  laterButtonLabel: 'Remind Me Later',
  rateButtonLabel: 'Rate It Now'
},
callbacks: {
  onRateDialogShow: function(callback){
    console.log('rate dialog shown!');
  },
  onButtonClicked: function(buttonIndex){
    console.log('Selected index: -> ' + buttonIndex);
  }
} }
console.log("appRate2");

this.appRate.promptForRating(false);


    
  }, 1000*30);
  }
  
  addCoinWebsocketCrypto(arr: string[]) {
console.log(arr,"addCoinWebsocketCrypto");

    this.socketCrypto.emit("room", arr);
  }
  leaveCoinWebsocketCrypto(arr: string[]) {
    console.log(arr,"leaveCoinWebsocketCrypto");

    this.socketCrypto.emit("leave_room", arr);
  }
  checkWsCrypto(scrollPx: number) {
    console.log(scrollPx);
    
    var SuposedToBe = [];
    var Todisconect = [];
    var Toconect = [];
    let a = Math.ceil(scrollPx / this.sizeOfLine) - 2;
    for (let j = 0; j < this.numOfLines; j++) {
      if (a + j > -1 && this.cryptos[a + j] != undefined) {
        SuposedToBe.push(this.cryptos[a + j]);
      }
    }
    console.log("sad", SuposedToBe);

    for (let j1 = 0; j1 < SuposedToBe.length; j1++) {
      let flag1 = false;
      for (let j2 = 0; j2 < this.CoinConnectedWSCrypto.length; j2++) {
        if (this.CoinConnectedWSCrypto[j2].pair == SuposedToBe[j1].pair) {
          flag1 = true;
        }
      }
      if (!flag1) {
        Toconect.push(SuposedToBe[j1].pair);
      }
    }

    for (let j1 = 0; j1 < this.CoinConnectedWSCrypto.length; j1++) {
      let flag2 = false;
      for (let j2 = 0; j2 < SuposedToBe.length; j2++) {
        if (this.CoinConnectedWSCrypto[j1].pair == SuposedToBe[j2].pair) {
          flag2 = true;
        }
      }
      if (!flag2) {
        Todisconect.push(this.CoinConnectedWSCrypto[j1].pair);
      }
    }

    console.log(Toconect);
    console.log(Todisconect);



    this.addCoinWebsocketCrypto(Toconect);
    this.leaveCoinWebsocketCrypto(Todisconect);
    this.CoinConnectedWSCrypto = SuposedToBe;
  }

  scrolllll = 1500
  async onScroll(event) {

 
        if(this.selectedSegment == this.CRYPTO){
        if(event != undefined)
          this.ScrollFromTopCrypto = event.scrollTop;
          if (this.socketCrypto != undefined && !this.socketCrypto.disconnected) {
            this.checkWsCrypto(event.scrollTop);
          }
    
      
    }
  }
  stopWS(str: string) {
    console.log("stop ws", str);
    if (this.socketCrypto != undefined) {
      this.socketCrypto.disconnect();
    }
  }
  startWS(str: string) {
    
        this.socketCrypto = io.connect("https://crypto.tradingcompare.com/");

        this.socketCrypto.on("message", (data) => {
          
          let pair = data.pair;          
          for (let index = 0; index < this.CoinConnectedWSCrypto.length; index++) {
            let a = index;
            
            if (pair == (this.CoinConnectedWSCrypto[index].pair)) {
              if (this.CoinConnectedWSCrypto[a].price > Number(data.price)) {
                this.CoinConnectedWSCrypto[a].state = this.CoinConnectedWSCrypto[a].state == "falling" ? "falling1" : "falling";
                this.CoinConnectedWSCrypto[a].price = Number(data.price);
                
                // this.cryptos[a].high24 = Number(data.high24);
                // this.cryptos[a].low24 = Number(data.low24);
                this.CoinConnectedWSCrypto[a].change = Number(data.change24);
              } else if (this.CoinConnectedWSCrypto[a].price < Number(data.price)) {
                this.CoinConnectedWSCrypto[a].state = this.CoinConnectedWSCrypto[a].state == "raising" ? "raising1" : "raising";
                this.CoinConnectedWSCrypto[a].price = Number(data.price);
                // this.cryptos[a].high24 = Number(data.high24);
                // this.cryptos[a].low24 = Number(data.low24);
                this.CoinConnectedWSCrypto[a].change = Number(data.change24);
              }

              break;
            }
          }
        })

      
  }
 
  onSlideChanged(slider) {
    console.log(slider);
    
    if (slider.getActiveIndex() == 5) return;

    const currentSlide = this.slides[slider.getActiveIndex()];
    if (currentSlide == undefined) return;
    var prevIndex = this.slides.indexOf(this.selectedSegment)
    this.changeSegment(currentSlide);

    console.log(this.containerSegment);
    if (slider.getActiveIndex() > prevIndex) {
      this.containerSegment.nativeElement.scrollLeft += 80;
    } else {
      this.containerSegment.nativeElement.scrollLeft -= 80;
    }
  }

  changeSegment(segment) {
    console.log('changeSegment', segment);

    if (this.selectedSegment == segment){ 
      this.content.scrollToTop(1000)

      return;
    }
    this.content.scrollToTop(0)

    this.stopWS(this.selectedSegment);
    this.cryptoSquares = [];
    if(this.cryptoProvider.mywatchlist.length >0)
        this.cryptoProvider.isWatchlistEmpty=false;

    switch (segment) {
      case this.CRYPTO:
        this.selectedSegment = this.CRYPTO;
        let arr = [];
        this.CoinConnectedWSCrypto=[]
        for (let index = 0; index < this.cryptos.length; index++) {
          if (index < this.numOfLines) {
            this.CoinConnectedWSCrypto.push(this.cryptos[index]);
            arr.push(this.cryptos[index].pair);
          }
        }
        this.content.scrollTop = this.ScrollFromTopCrypto;
          this.startWS(this.CRYPTO);
          this.addCoinWebsocketCrypto(arr);
        break;
      case this.WATCHLIST:
        this.selectedSegment = this.WATCHLIST;
        this.buildWatchlist()
        break;
      case this.TRENDING:
        this.selectedSegment = this.TRENDING;
        this.buildTrending()
         
        break;
      default:
        break;
    }
    this.selectedSegment = segment;
    console.log(this.selectedSegment,"this.selectedSegment");
    
    // const selectedIndex = this.slides.findIndex((slide) => {
    //   return slide === segment;
    // });
    // this.slider.slideTo(selectedIndex);
  }


  sortByname() {

    this.cryptos.sort(function (b, a) {
      if (a.name < b.name)
        return 1
      if (a.name > b.name)
        return -1
      return 0

    })
  }

  sortByprice() {

    this.cryptos.sort(function (b, a) {
      if (a.price < b.price)
        return 1
      if (a.price > b.price)
        return -1
      return 0

    })
  }
  sortBychange() {

    this.cryptos.sort(function (b, a) {
      if (a.change < b.change)
        return 1
      if (a.change > b.change)
        return -1
      return 0

    })
  }
  addtoWhachlistT(pair,type,index){
    console.log(pair,type,index);
    if(this.authData.user._id){
    if(type){
      this.cryptosTrending[index].isWatchlist=false;
    for (let index2 = 0; index2 <   this.cryptosTrending.length; index2++) {
      if(pair ==  this.cryptoProvider.mywatchlist[index2].pair){ 
      this.cryptoProvider.mywatchlist.splice(index2, 1);
      this.authData.user.watchlist.splice(index2, 1);

            break
    }  }
    
    this.cryptoProvider.deleteToWhachList({
      pair:pair,_id:this.authData.user._id
    })
  }else{
    this.cryptosTrending[index].isWatchlist=true;
    this.cryptoProvider.mywatchlist.push(  this.cryptosTrending[index])
    this.authData.user.watchlist.push({pair:pair})
this.cryptoProvider.addToWhachList({
  pair:pair,_id:this.authData.user._id
})

  }
}else
this.app.getRootNav().push("connection")

}
  addtoWhachlist(pair,type,index){
    console.log(pair,type,index);
    if(this.authData.user._id){
    if(type){
      this.cryptos[index].isWatchlist=false;
    for (let index2 = 0; index2 <   this.cryptoProvider.mywatchlist.length; index2++) {
      if(pair ==  this.cryptoProvider.mywatchlist[index2].pair){ 
      this.cryptoProvider.mywatchlist.splice(index2, 1);
      this.authData.user.watchlist.splice(index2, 1);

            break
    }  }
    
    this.cryptoProvider.deleteToWhachList({
      pair:pair,_id:this.authData.user._id
    })
  }else{
    this.cryptos[index].isWatchlist=true;
    this.cryptoProvider.mywatchlist.push(  this.cryptos[index])
    this.authData.user.watchlist.push({pair:pair})
this.cryptoProvider.addToWhachList({
  pair:pair,_id:this.authData.user._id
})
  }
  if(this.cryptoProvider.mywatchlist.length > 0)
      this.cryptoProvider.isWatchlistEmpty = false;
      else
      this.cryptoProvider.isWatchlistEmpty = true;
    }else
    this.app.getRootNav().push("connection")
  }
  addtoWhachlistWATCHLIST(pair,type,index){
    console.log(pair,type,index);
    if(this.authData.user._id){
      this.cryptosWatchlist[index].isWatchlist=false;
    for (let index2 = 0; index2 <   this.cryptoProvider.mywatchlist.length; index2++) {
      if(pair ==  this.cryptoProvider.mywatchlist[index2].pair){ 
      this.cryptoProvider.mywatchlist.splice(index2, 1);
      this.authData.user.watchlist.splice(index2, 1);

            break
    }  } 
    this.cryptoProvider.deleteToWhachList({
      pair:pair,_id:this.authData.user._id
    })
  
  if(this.cryptoProvider.mywatchlist.length > 0)
      this.cryptoProvider.isWatchlistEmpty = false;
      else
      this.cryptoProvider.isWatchlistEmpty = true;
    }else
    this.app.getRootNav().push("connection")
  }
  buildWatchlist(): Promise<any> {
    return new Promise((resolve) => {
      this.CoinConnectedWSCrypto=[];

        this.cryptosWatchlist = this.cryptoProvider.mywatchlist;
        let arr = [];
        console.log(   this.cryptosWatchlist,"   this.cryptosWatchlist");
        
        for (let index = 0; index < this.cryptosWatchlist.length; index++) {
          if (index < this.numOfLines) {
            this.CoinConnectedWSCrypto.push( this.cryptosWatchlist[index]);
            arr.push(this.cryptosWatchlist[index].pair);
          }
        }
        if(this.content != undefined)
        this.content.scrollTop = this.ScrollFromTopCrypto;
        
          this.startWS(this.CRYPTO);
          this.addCoinWebsocketCrypto(arr);
        
        resolve()
    })
  }
  buildTrending(){
    return new Promise((resolve) => {
      this.CoinConnectedWSCrypto=[];

      this.cryptosTrending = this.cryptoProvider.trending;
      let arr = [];
      
      for (let index = 0; index < this.cryptosTrending.length; index++) {
        if (index < this.numOfLines) {
          this.CoinConnectedWSCrypto.push( this.cryptosTrending[index]);
          arr.push(this.cryptosTrending[index].pair);
        }
      }
      this.content.scrollTop = this.ScrollFromTopCrypto;
        this.startWS(this.CRYPTO);
        this.addCoinWebsocketCrypto(arr);
      
      resolve()
  })
  }
  goEdit() {

    if (this.edit) {
      this.icon = "md-create";
      this.edit = false;
      this.cryptoProvider.updateEditInServer( this.cryptosWatchlist)

    } else {
      this.icon = "md-checkmark";
      this.edit = true;

    }

  }
  reorderItems(indexes) {
    console.log(indexes);
    
    let element = this.cryptosWatchlist[indexes.from];
    this.cryptosWatchlist.splice(indexes.from, 1);
    this.cryptosWatchlist.splice(indexes.to, 0, element);
  }
  addcoin() {
    if (this.authData.user._id != undefined) {
      this.navCtrl.push("list-pairs")
    }
    else
      this.app.getRootNav().push("connection")
  }
  doInfinite() {
    console.log("do infinit", this.selectedSegment);
     
    return new Promise((resolve) => {

      let index = 0;
              for ( ;( this.offsetRequested+index) < this.allcryptos.length && index <20; index++) {
                this.cryptos.push(this.allcryptos[index+this.offsetRequested])
              }
              this.offsetRequested += index;

              resolve();
            })        }

            gotoChart(pair){
this.navCtrl.push("chart",{pair:pair})
            }
            gotovip(){
              this.navCtrl.push("vip")

            }
}
