import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController,AlertController, IonicPage, App, Content } from 'ionic-angular';
import { Http,Headers } from "@angular/http";
import { SocialSharing } from '@ionic-native/social-sharing';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { Profile } from '../../models/profile-model';
import { SocialDataProvider } from '../../providers/social-data/social-data';
import { TrackEventProvider } from '../../providers/track-event/track-event';

@IonicPage({
  name:"crypto-review-read-more"
})
@Component({
  selector: 'page-crypto-review-read-more',
  templateUrl: 'crypto-review-read-more.html',
})
export class CryptoReviewReadMorePage {
  SubcommentText: any;
  ImgProfile: string="http://xosignals.herokuapp.com/api2/sendImgCountryByName/"
  Article: any;
  commentText: any;
  @ViewChild("myInput") myInput: any;
  @ViewChild("myInput2") myInput2: any;
  @ViewChild("contentcryptoreview") contentcryptoreview: Content;
  EditcommentText: any;
  isSubEdit: any;
  Reply: boolean;
  Edit: boolean;
  indexToReply: any;
  Commrnt_id: any;
  subComment_id: any;
  comments: any[];
  GotAllComment: boolean;
  isLike:boolean=false;
  page: string;
  blog:any;
  url:any;
  pageName:any;
  language:string;
  user:Profile;
  LikesNumer:number=100;
  constructor(
    public alertCtrl:AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public app:App,
    public trackEvent: TrackEventProvider,
    public socialprovider:SocialDataProvider,
    public AuthData:AuthDataProvider,
    private socialSharing: SocialSharing,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController) {
     this.pageName= this.navParams.get("cryptoPage")
     this.language= this.navParams.get("language")
    this.user=this.AuthData.user;
    console.log(this.user);
    
 if(this.user)
 this.ImgProfile+=this.user.countryData.country;
      this.GetAllComment();

      this.url = "https://afternoon-mountain-15657.herokuapp.com/cryptoReview/" + this.pageName.name + "/" + this.language


      
      this.http.get(this.url)
      .toPromise()
      .then(response => {
        do {
          document.getElementById("blog").innerHTML = response.text();
        }
        while (document.getElementById("blog").innerHTML === "")
      })
      .catch(err => {
        console.log('error in server')
      })
      var x=[]
      x.push(this.pageName)
      
      this.socialprovider.checkUnlike2( x)
      this.socialprovider.checkLike2( x)

    }

  ionViewDidEnter(){
  

  }
  ionViewDidLeave(){
    

  }
  ionViewDidLoad() {

    console.log('ionViewDidLoad CryptoReviewReadMorePage');
    this.trackEvent.trackView("CryptoReviewReadMorePage")

      
  }

  shareViaAll() {
    
    this.socialSharing.share(null, null, null, this.url)
      .then(() => {
        console.log("All")
      }).catch(() => {     
        console.log("Sharing via All is not possible")
      });
  }
  

  goBack() {
    this.navCtrl.pop();
  }

  
  
  GetAllComment() {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/GetAllComment", { "_id": this.pageName._id }, { headers: header })
      .toPromise()
      .then((data) => {
        this.GotAllComment = true
        this.comments = data.json()
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
    if (!this.user) {
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
     if (!this.user) {
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
     console.log(this.user);
     
     if (!this.user) {
      this.app.getRootNav().setRoot("connection")
       return
     }
     this.Edit = false
     this.Reply= false
     setTimeout(() => {
       this.myInput.setFocus();
     }, 150);
     setTimeout(() => {
      if(this.contentcryptoreview ){
        this.contentcryptoreview.scrollToBottom()
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
    if(!this.AuthData.user._id){
    this.openLogin()
    return
    }
    var loading = this.loadingCtrl.create()
    loading.present()
    if (this.commentText.length < 3) {
      loading.dismiss()
      let alert = this.alertCtrl.create({
        title: 'error!',
        subTitle: "plese enter more then 4 leters ",
        buttons: ['Ok']
      })
      alert.present()
      return
    }
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/AddComment", { "_id": this.pageName._id, "UserUid": this.user._id, "name":this.user.first_name+" "+this.user.last_name, "photoUrl": this.ImgProfile, "comment": this.commentText }, { headers: header })
      .toPromise()
      .then((data) => {
       this.comments.unshift({
        "_id": data.json()._id,
        "ArticleId":this.pageName._id, 
        "UserUid":this.user._id, 
        "name":this.user.first_name+" "+this.user.last_name, 
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
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/DeleteComment", { "_id": Commrnt_id }, { headers: header })
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
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/UpdateComment", { "_id": this.Commrnt_id, "UserUid":  this.user._id, "comment": this.EditcommentText }, { headers: header })
      .toPromise()
      .then((data) => {
        loading.dismiss()
       this.comments[this.indexToReply].comment = this.EditcommentText
       this.EditcommentText = ""
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
    
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/AddSubComment", { "_id": Commrnt_id, "UserUid": this.user._id, "name": this.user.first_name+" "+this.user.last_name, "photoUrl": this.ImgProfile, "comment": this.SubcommentText }, { headers: header })
      .toPromise()
      .then((data) => {
        loading.dismiss()
          this.comments[i].subComment.push({
            "_id": Commrnt_id,
            "UserUid":  this.user._id,
            "name": this.user.first_name+" "+this.user.last_name,
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

    let header = new Headers();
    header.append('Content-Type', 'application/json');
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/DeleteSubComment", { "SubcommentID": SubcommentID, "_id": Commrnt_id}, { headers: header })
      .toPromise()
      .then((data) => {
      for (let index = 0; index < (this.comments[i].subComment).length; index++) {
        if (this.comments[i].subComment[index]._id == SubcommentID) {
          this.comments[i].subComment.splice(index, 1);
          break;
        }
      }
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

    let header = new Headers();
    header.append('Content-Type', 'application/json');
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/UpdateSubComment", { "_id": this.Commrnt_id, "SubcommentID": this.indexToReply, "comment": this.EditcommentText }, { headers: header })
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
  updateLike2(type) {
    console.log(this.pageName);
    
 var a=[]
a.push(this.pageName)
 this.socialprovider.updateLike(a,this.pageName._id, type, 0, 'cryptoReview')
  }
}
