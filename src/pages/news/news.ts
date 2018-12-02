import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, IonicPage, Slides } from 'ionic-angular';
import { Http } from '@angular/http';
import { TrackEventProvider } from '../../providers/track-event/track-event';

@IonicPage({
  name:"news"
})

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {
  @ViewChild('mySlider') slider: Slides;
  private readonly NEWS: string = "NEWS";
  private readonly ACADEMY: string = "ACADEMY";
  private readonly REVIEWS: string = "REVIEWS";
  private readonly WALLET: string = "WALLET";
  private readonly BROKER: string = "BROKER";

  selectedSegment:string=this.NEWS;
  slides: string[];



  //news variable

  NewsTmp: any[];
  newsToSearch: any[];
  numPage3background: string;
  numPage2background: string;
  numPage1background: string;
  isOnLastPages: boolean = false;
  numPage1: number;
  numPage2: number;
  numPage3: number;
  NumOfPages: number;
  pageNum: number
  label: string;
  loading: any;
  url: string;
  News: any[];
  language: string;
  searchLabel:string="";
  //education variable
  blue: string;
  classes: Array<{
    classNum: number;
    texts: string[];
    background: string;
  }> = [];
  //crypto-review variable
  cryptoreviews: any;
  baseUrl: string = "http://afternoon-mountain-15657.herokuapp.com/cryptoReview";
    //wallet variable
    playStorLabel:string;
    items: any[];
 //broker variable
    brokers: any[];
  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public http: Http,
    public trackEvent: TrackEventProvider,
    public navParams: NavParams,
    public toastCtrl: ToastController
  ) {
    this.slides = [ this.NEWS, this.ACADEMY, this.REVIEWS, this.WALLET,this.BROKER];
//call all 
    this.getClasses();
this.getallcryptoreview();
this.getallwallet();
this.getallbroker();
//news strat
    this.language = this.navParams.get("language");
    if (typeof (this.navParams.get("pageNum")) == "undefined") {
      this.pageNum = 1
    } else {
      this.pageNum = this.navParams.get("pageNum")
    }

    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present()

    if (this.language == "fr") {
      this.url = "http://afternoon-mountain-15657.herokuapp.com/getNews/FR/" + this.pageNum
      this.label = "Lire l'article"
    } else {
      this.url = "https://afternoon-mountain-15657.herokuapp.com/getNews/EN/" + this.pageNum
      this.label = "Continue to read"
    }
    var url2 = "https://afternoon-mountain-15657.herokuapp.com/AllNews/" + this.language
    this.http.get(this.url).toPromise().then((data)=>{
      this.newsToSearch = data.json()
    })
    
    this.http.get(this.url)
      .toPromise()
      .then(data => {
        this.News = data.json();
        this.addvip(     this.News)

        this.NewsTmp = this.News
        this.loading.dismiss()
      }).catch(error => console.log(error))
    this.http.get("https://afternoon-mountain-15657.herokuapp.com/getNumOfNews/" + this.language)
      .toPromise()
      .then(numOfPage => {
        this.NumOfPages = numOfPage.json()

        if (this.pageNum == 1) {
          this.numPage1background = "#dedede"
          this.numPage1 = 1
          this.numPage2 = 2
          this.numPage3 = 3
        } else if (this.pageNum == this.NumOfPages) {
          console.log("this.pageNum == this.NumOfPages");
          
          this.numPage3background = "#dedede"
          this.numPage1 = this.NumOfPages - 2
          this.numPage2 = this.NumOfPages - 1
          this.numPage3 = this.NumOfPages
          this.isOnLastPages = true
        } else if (this.pageNum + 1 == this.NumOfPages) {
          this.numPage2background = "#dedede"
          this.isOnLastPages = true
          this.numPage1 = this.pageNum - 1
          this.numPage2 = this.pageNum
          this.numPage3 = this.pageNum + 1
        } 
        else {
          this.numPage2background = "#dedede"
          this.numPage1 = this.pageNum - 1
          this.numPage2 = this.pageNum
          this.numPage3 = this.pageNum + 1
        }
      }).catch(error => console.log(error))


  }

  ionViewDidLoad() {
    console.log("news page");
    this.trackEvent.trackView("news")

  }
  readMore(i) {
    console.log(i);
    
      this.navCtrl.push("read-review", {
        Article: this.News[i],
        language: this.language
      });
    }
  

  getItems(ev: any) {
    var val = (ev.target.value);
    if (val.length < 4 && this.searchLabel) {
      
    }else {
      this.News = this.newsToSearch.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    this.searchLabel = val
  }

  changePage(num) {
    if(num==this.pageNum||num==0)return
    console.log(num);
     this.navCtrl.setRoot(NewsPage, {
       language: this.language,
       pageNum:num
     })
  }
//news end

//education start
goToClass(num: number) {
  this.navCtrl.push("class",{classNum: num,language:this.language});
}

getClasses() {

  this.classes.push({
    classNum: 1,
    background: '#f6f2e6',
    texts: [
      'What You Need To Know About Cryptocurrency',
      'What Determines the Value of Cryptocurrency?'
    ]
  })

  this.classes.push({
    classNum: 2,
    background: '#dce2e2',
    texts: [
      'What Is Mining?',
      'Where Do Bitcoins Come From?',
      'Why Are Bitcoins Mined?',
      'How Are Bitcoins Mined?'
    ]
  })
  this.classes.push({
    classNum: 3,
    background: '#ecedef',
    texts: [
      'Choose Your Cryptocurrency and Exchange',
      'Choose Your Cryptocurrency',
      'Choose Your Exchange'

    ]
  })

  this.classes.push({
    classNum: 4,
    background: '#d9d9db',
    texts: [
      'Crypto Merchants',
      'Bitcoin-Friendly Popular Merchants',
      'Ethereum-Happy Companies',
      'Litecoin Hungry Enterprises'
    ]
  })

  this.classes.push({
    classNum: 5,
    background: '#eee3e1',
    texts: [
      'Best Places To Buy Cryptocurrency',
      'BTCC and BTCChina',
      'Markets.com',
      'Plus500',

    ]
  })



  this.classes.push({
    classNum: 6,
    background: '#cfdfd4',
    texts: [
      'The Best Cryptocurrencies Today',
      'Ethereum Classic',
      'Digital Currencies vs Tokens'
    ]
  })

  this.classes.push({
    classNum: 7,
    background: '#cab3e2',
    texts: [
      'How To Stay Updated: Cryptocurrency Resources'
    ]
  })
  this.classes.push({
    classNum: 8,
    background: '#e1eff0',
    texts: [
      'Regulation of Cryptocurrency',
      'Regulation Which Countries Are Doing It?'

    ]
  })

  this.classes.push({
    classNum: 9,
    background: '#eae2ed',
    texts: [
      'How To Keep Your Cryptocurrency Safe'


    ]
  })



  this.classes.push({

    classNum: 10,
    background: '#f4eeee',
    texts: [
      'Past Abuse',
      'Future Prediction',
      'Future Predictions'
    ]
  })
  this.classes[2]["isvip"]=true;
  this.classes[7]["isvip"]=true;

}
//education end
//crptoreview start
getallcryptoreview(){
  this.http.get(this.baseUrl)
  .toPromise()
  .then(Response => {
    this.cryptoreviews = Response.json();
    console.log( this.cryptoreviews);
    this.addvip(   this.cryptoreviews)

   })
}
gotovip(){
  this.navCtrl.push("vip");
}
gotoReview(item) {

  this.navCtrl.push("crypto-review-read-more", {
    cryptoPage: this.cryptoreviews[item]
    ,language: this.language
  });
}
//crptoreview end

//wallet start

getallwallet(){
  this.url="http://afternoon-mountain-15657.herokuapp.com/wallet";
  this.http.get(this.url)
        .toPromise()
        .then(Response => {
          this.items = Response.json();
          this.addvip( this.items)

        })
}

walletreadreview(item){
  console.log(this.language)
  this.navCtrl.push('wallet-read-review', {
    pagename:item,
    language:this.language
   
  
  
  });
}
//wallet end
//broker start

getallbroker(){
  this.http.get("http://afternoon-mountain-15657.herokuapp.com/NewBrokersEN")
        .toPromise()
        .then(Response => {
          console.log(Response,"broker");
          
          this.brokers = Response.json();
          this.addvip(this.brokers)
        })
        .catch(error => console.log('an error was happen with the response of the the server'))
}
readReview(pagename, language, link) {
  this.navCtrl.push("brokers-read-review", { language, pagename, link })
}
//broker end

  onSlideChanged(slider) {
    console.log(slider);
    
    if (slider.getActiveIndex() == 5) return;

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
    this.trackEvent.trackView("news "+segment)

  }
addvip(array){
for (let index = 0; index < array.length; index++){ 
var a= parseInt(((index%6 ).toString()))          
if(a >4)
array[index].isvip=true
}
}
}
