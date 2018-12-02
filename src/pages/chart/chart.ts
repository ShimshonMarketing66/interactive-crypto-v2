import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { CryptoProvider } from '../../providers/crypto/crypto';
import { SocialDataProvider } from '../../providers/social-data/social-data';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { App } from 'ionic-angular/components/app/app';
import { HttpClient } from '@angular/common/http';
import { ResponseType } from '@angular/http/src/enums';
import { ChartUI } from '../../app/ui_component/ui.component';
import { StudyDialog } from '../../app/study_dialog_component/study.dialog.component';
import { TrackEventProvider } from '../../providers/track-event/track-event';



@IonicPage({ name: "chart" })
@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html'
})
export class ChartPage {
  NEWS: string = "NEWS";
  CHART: string = "CHART";
  REVIEW: string = "REVIEW";
  CHAT: string = "CHAT";
public coin:any;
textreview:any;
date:string=new Date().toLocaleTimeString();
  public selectedSegment: string = this.CHART;
  public allSegments: Array<string>;

  newsarry:any=[];
anyNews:boolean = true;
anyReview:boolean = true;

//chat
GotAllComment:boolean=false;
comments:any=[];
SubcommentText: any;
ImgProfile: string="http://xosignals.herokuapp.com/api2/sendImgCountryByName/";
Article: any;
commentText: any;
EditcommentText: any;
isSubEdit: any;
Reply: boolean;
Edit: boolean;
indexToReply: any;
Commrnt_id: any;
subComment_id: any;
@ViewChild("myInput") myInput: any;
@ViewChild("myInput2") myInput2: any;
@ViewChild("chartpage") chartpage: any;
  constructor(
    public trackEvent: TrackEventProvider,
   public http: HttpClient,
    public app:App,
    public authData:AuthDataProvider,
    public navCtrl: NavController,
    public cryptoProvider:CryptoProvider,
    public alertCtrl:AlertController,
    public socialprovider:SocialDataProvider,
    public AuthData:AuthDataProvider,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
    this.allSegments = [this.CHART, this.REVIEW, this.NEWS, this.CHAT];
for (let index = 0; index < this.cryptoProvider.arrAllCrypto.length; index++) {
  if(this.navParams.get("pair") == this.cryptoProvider.arrAllCrypto[index].pair){
this.coin=this.cryptoProvider.arrAllCrypto[index];
break;
  }
}
this.GetAllComment()
this.getCoinNews()
if(this.authData.user._id)
this.ImgProfile+=this.authData.user.countryData.country;
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ChartPage');
    this.trackEvent.trackView("ChartPage")

    if(this.authData.user._id){
    this.socialprovider.checkunLike(this.coin)
    this.socialprovider.checkLike(this.coin)
    this.getreview()

    }
  }
  changeSegment(segment) {

    this.selectedSegment = segment;
    this.chartpage.scrollToTop(0)
    this.trackEvent.trackView("ChartPage"+segment)

  }
  updateLike(type) {
    if(this.authData.user._id){
    var a=[]
    a.push(this.coin);
 this.socialprovider.updateLike(a,this.coin._id, type, 0, 'allcrypto')
  }else{
    this.app.getRootNav().push("connection")
  }
}
addtoWhachlist(pair,type){
  if(this.authData.user._id){
  
  if(type){
    this.coin.isWatchlist=false;
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
    this.coin.isWatchlist=true;
    this.cryptoProvider.mywatchlist.push(  this.coin)
    this.authData.user.watchlist.push({pair:pair})
this.cryptoProvider.addToWhachList({
  pair:pair,_id:this.authData.user._id
})
  }
  if(this.cryptoProvider.mywatchlist.length > 0)
      this.cryptoProvider.isWatchlistEmpty = false;
      else
      this.cryptoProvider.isWatchlistEmpty = true;
  }
  else{
    this.app.getRootNav().push("connection")
  }
}
addTransaction() {
  if(this.authData.user._id)
  this.navCtrl.push("port-folio-transaction",{pair:this.coin.pair})
  else{
    this.app.getRootNav().setRoot("connection")
  }
}
gotoalert(){
  if (!this.authData.user._id) 
    this.app.getRootNav().setRoot("connection")
  else
  this.navCtrl.push("alert",{
    FROMSYMBOL: this.coin.pair.split("_")[0],
    TOSYMBOL:this.coin.pair.split("_")[1]
  })
}
getreview(){

      this.http.get( "https://afternoon-mountain-15657.herokuapp.com/cryptoReview/" + this.coin.name + "/En",{responseType:'text'})
      .toPromise()
      .then(response => {        
          this.textreview = response;
       })
      .catch(err => {
        console.log("No news available for this coin");
        this.anyReview=false;
      })
}
//news
getCoinNews(){
  this.http.get("http://afternoon-mountain-15657.herokuapp.com/getCoinNews/"+this.coin.name).toPromise().then((allnews)=>{
    
this.newsarry=allnews;
if(this.newsarry.length < 1){
console.log("No news available for this coin");
this.anyNews=false;
}
  })

}
readMore(i) {
  console.log(i);
  
    this.navCtrl.push("read-review", {
      Article: this.newsarry[i],
      language: "en"
    });
  }
//chat
GetAllComment() {
  this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/GetAllComment", { "_id": this.coin._id })
    .toPromise()
    .then((data) => {
      this.GotAllComment = true
      this.comments = data;
    }).catch((err) => {
      let alert = this.alertCtrl.create({
        title: 'Sorry!',
        subTitle: "unable to get comments right now - try later ",
        buttons: ['Ok']
      })
      alert.present()
    })
}

clickeditComment(EditcommentText, i, Commrnt_id, isSubEditval,subComment_id) {
  if (!this.authData.user._id) {
    this.app.getRootNav().setRoot("connection")
    return
  }
   this.subComment_id=subComment_id
   this.Commrnt_id = Commrnt_id
   this.indexToReply = i
   this.Edit = true
   this.Reply = false
   this.isSubEdit = isSubEditval
   setTimeout(() => {
     this.myInput2.setFocus();
   }, 150);
   setTimeout(() => {
     this.EditcommentText = EditcommentText
   }, 500);
 }
 reply(i) {
   if (!this.authData.user._id) {
    this.app.getRootNav().setRoot("connection")
     return
   }
   this.Edit = false
   this.indexToReply = i
   this.Reply = true
   setTimeout(() => {
     this.myInput.setFocus();
   }, 150);
 }

 clickChat() {
   
   if (!this.authData.user._id) {
    this.app.getRootNav().setRoot("connection")
     return
   }
   this.Edit = false
   this.Reply= false
   setTimeout(() => {
     this.myInput.setFocus();
   }, 150);
   setTimeout(() => {
    if(this.chartpage ){
      this.chartpage.scrollToBottom()
     }
  }, 500);
 }

 clickContent(){
   this.Edit = false
   this.Reply= false
 }

 openLogin(){
  this.app.getRootNav().setRoot("connection")
}


AddComment() {
  var loading = this.loadingCtrl.create()
  loading.present()
  if (this.commentText.length < 2) {
    loading.dismiss()
    let alert = this.alertCtrl.create({
      title: 'error!',
      subTitle: "plese enter more then 3 leters ",
      buttons: ['Ok']
    })
    alert.present()
    return
  }
  
  this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/AddComment", { "_id": this.coin._id, "UserUid": this.authData.user._id, "name":this.authData.user.first_name+" "+this.authData.user.last_name, "photoUrl": this.ImgProfile, "comment": this.commentText })
    .toPromise()
    .then((data:any) => {
     this.comments.unshift({
      "_id": data._id,
      "ArticleId":this.coin._id, 
      "UserUid":this.authData.user._id, 
      "name":this.authData.user.first_name+" "+this.authData.user.last_name, 
      "photoUrl": this.ImgProfile, 
      "comment": this.commentText,
      "subComment":[]
     })
     this.commentText = ""
     loading.dismiss()
    }).catch((err) => {
      loading.dismiss()
      let alert = this.alertCtrl.create({
        title: 'Sorry!',
        subTitle: "unable to post comment right now - try later ",
        buttons: ['Ok']
      })
      alert.present()
    })
}

DeleteComment(Commrnt_id,i) {
  var loading = this.loadingCtrl.create()
  loading.present()
  this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/DeleteComment", { "_id": Commrnt_id })
    .toPromise()
    .then((data) => {
      this.comments.splice(i, 1);
      loading.dismiss()
    }).catch((err) => {
      loading.dismiss()
      let alert = this.alertCtrl.create({
        title: 'Sorry!',
        subTitle: "unable to post comment right now - try later ",
        buttons: ['Ok']
      })
      alert.present()
    })
}

UpdateComment(i) {
  var loading = this.loadingCtrl.create()
  loading.present()
  this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/UpdateComment", { "_id": this.Commrnt_id, "UserUid":  this.authData.user._id, "comment": this.EditcommentText })
    .toPromise()
    .then((data) => {
      loading.dismiss()
     this.comments[this.indexToReply].comment = this.EditcommentText
     this.EditcommentText = ""
     this.Edit = false
     this.Reply= false
    }).catch((err) => {
      loading.dismiss()
      let alert = this.alertCtrl.create({
        title: 'Sorry!',
        subTitle: "unable to post comment right now - try later ",
        buttons: ['Ok']
      })
      alert.present()
    })
}

AddSubComment(Commrnt_id,i) {
  var loading = this.loadingCtrl.create()
  loading.present()
  
  this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/AddSubComment", { "_id": Commrnt_id, "UserUid": this.authData.user._id, "name": this.authData.user.first_name+" "+this.authData.user.last_name, "photoUrl": this.ImgProfile, "comment": this.SubcommentText })
    .toPromise()
    .then((data) => {
      loading.dismiss()
        this.comments[i].subComment.push({
          "_id": Commrnt_id,
          "UserUid":  this.authData.user._id,
          "name": this.authData.user.first_name+" "+this.authData.user.last_name,
          "photoUrl": this.ImgProfile,
          "comment": this.SubcommentText
        })
      this.Edit = false
      this.Reply = false
      this.SubcommentText = ""
    }).catch((err) => {
      loading.dismiss()
      let alert = this.alertCtrl.create({
        title: 'Sorry!',
        subTitle: "unable to post comment right now - try later ",
        buttons: ['Ok']
      })
      alert.present()
    })
}

deleteSubComment(Commrnt_id, SubcommentID,i) {
  var loading = this.loadingCtrl.create()
  loading.present()
  this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/DeleteSubComment", { "SubcommentID": SubcommentID, "_id": Commrnt_id})
    .toPromise()
    .then((data) => {
    for (let index = 0; index < (this.comments[i].subComment).length; index++) {
      if (this.comments[i].subComment[index]._id == SubcommentID) {
        this.comments[i].subComment.splice(index, 1);
        break;
      }
    }
    this.Edit = false
    this.Reply= false
    loading.dismiss()
    }).catch((err) => {
      loading.dismiss()
      let alert = this.alertCtrl.create({
        title: 'Sorry!',
        subTitle: "unable to remove comment right now - try later ",
        buttons: ['Ok']
      })
      alert.present()
    })

}
UpdateSubComment() {
  var loading = this.loadingCtrl.create()
  loading.present()

  this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/UpdateSubComment", { "_id": this.Commrnt_id, "SubcommentID": this.indexToReply, "comment": this.EditcommentText })
    .toPromise()
    .then((data) => {
      for (let index = 0; index < (this.comments[this.indexToReply].subComment).length; index++) {
        if (this.comments[this.indexToReply].subComment[index]._id == this.subComment_id) {
          this.comments[this.indexToReply].subComment[index].comment = this.EditcommentText
          break;
        }
      }
      this.EditcommentText = ""
      this.Edit = false
      this.Reply = false
      loading.dismiss()
    }).catch((err) => {
      loading.dismiss()
      let alert = this.alertCtrl.create({
        title: 'Sorry!',
        subTitle: "unable to edit comment right now - try later ",
        buttons: ['Ok']
      })
      alert.present()

    })

}
addcoin() {
  if (this.authData.user._id != undefined) {
    this.navCtrl.push("list-pairs")
  }
  else
    this.app.getRootNav().push("connection")
}

onScroll(event) {
  if(this.selectedSegment == "CHAT"){
  var header = document.getElementById("mychat");
        header.classList.add("sticky");
  }
}
}
