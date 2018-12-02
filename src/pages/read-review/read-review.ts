import { Component, ViewChild } from '@angular/core';
import { NavController, ActionSheetController, NavParams, LoadingController, AlertController, Content, IonicPage, App } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { SocialSharing } from '@ionic-native/social-sharing';
// import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { Type } from '@angular/core/src/type';
import firebase from 'firebase';
import { SocialDataProvider } from '../../providers/social-data/social-data';
import { AuthDataProvider } from '../../providers/auth-data/auth-data';
import { Profile } from '../../models/profile-model';
import { TrackEventProvider } from '../../providers/track-event/track-event';


@IonicPage({
  name:"read-review"
})
@Component({
  selector: 'page-read-review',
  templateUrl: 'read-review.html'
})
export class ReadReviewPage {
  GotAllComment: boolean = false;
  @ViewChild("scrollcomment") scrollcomment: Content;
  subComment_id: string;
  indexToReply: number
  photoUrl: string;
  comments: any[];
  Reply: boolean = false
  @ViewChild("myInput") myInput: any
  @ViewChild("myInput2") myInput2: any
  commentsNumber: number = 100
  isLike: boolean = false
  Article: any;
  loading: any;
  toast: any;
  label: string;
  language: string;
  NewsToShow: any[]
  user: Profile;
  ImgProfile: string="http://xosignals.herokuapp.com/api2/sendImgCountryByName/"
  commentText: string = "";
  SubcommentText: string = "";
  EditcommentText: string = "";
  Edit: boolean = false
  Commrnt_id: string = "";
  isSubEdit: Boolean = false
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private socialSharing: SocialSharing,
    public actionSheetCtrl: ActionSheetController,
    public http: Http,
    public app:App,
    public socialprovider:SocialDataProvider,
    public AuthData:AuthDataProvider,
        private alertCtrl: AlertController,
    // public firebaseAuth: AngularFireAuth,
    public loadingConfig: LoadingController,
    public trackEvent: TrackEventProvider  ) {
   this.user=this.AuthData.user;
   if(this.user)
 this.ImgProfile+=this.user.countryData.country;
    this.language = (this.navParams.get("language"))
    this.Article = this.navParams.get("Article")
    this.loading = loadingConfig.create({
      content: 'Please wait...'
    });
    this.loading.present()
    if (this.language == "fr") {
      this.label = "Lire l'article";
    } else {
      this.label = "Continue to read";
    }
  }

  ionViewDidLoad() {
    // this.ga.trackView("News -> " + this.Article.name + " (" + this.language + ")");
    this.updateShareCounter("viewcounter")
    this.commentsNumber += this.Article.userslikes.length
    if (this.user) {
      for (let i in this.Article.userslikes) {
        if (this.Article.userslikes[i] == this.user)
          this.isLike = true
      }
      this.trackEvent.trackView("news read more")

    }
    this.GetAllComment();

  }
 
  ngAfterViewInit() {
    this.http.get("https://afternoon-mountain-15657.herokuapp.com/getRandomNews/" + this.language)
      .toPromise()
      .then(data => {
        this.NewsToShow = data.json()
      })
    if (this.language == "FR") {
      document.getElementById("Popularnews").innerText = "A voir aussi :";
    }
    let url = "http://afternoon-mountain-15657.herokuapp.com/news/" + this.Article.name + "/" + this.language
    this.http.get(url)
      .toPromise()
      .then(response => {

        document.getElementById(this.Article.name).innerHTML = response.text();
        this.loading.dismiss()
      })
      .catch(err => {
        this.loading.dismiss()
        console.log('error in server')
      })

  }

  shareViaFacebook() {
    this.loading = this.loadingConfig.create();
    this.loading.present()
    this.socialSharing.shareViaFacebook(null, null, this.Article.urlShare)
      .then(() => {
        this.loading.dismiss()
        console.log("Facebook share successful");
      }).catch((err) => {
        this.loading.dismiss()
        console.log("An error occurred ", err);
      });
    console.log("Facebook")
    this.updateShareCounter("sharecounter")
  }

  shareViaWhatsApp() {
    this.loading = this.loadingConfig.create();
    this.loading.present()
    this.socialSharing.shareViaWhatsApp("interactivecrypto.com", null, this.Article.urlShare)
      .then(() => {
        this.loading.dismiss()
        console.log("WhatsApp share successful");
      }).catch((err) => {
        this.loading.dismiss()
        console.log("An error occurred ", err);
      });
    console.log("What")
    this.updateShareCounter("sharecounter")
  }

  shareViaAll() {
    this.loading = this.loadingConfig.create();
    this.loading.present()
    this.socialSharing.share("interactivecrypto.com", null, null, this.Article.urlShare)
      .then(() => {
        this.updateShareCounter("sharecounter")
        this.loading.dismiss()
        console.log("All")
      }).catch(() => {
        this.loading.dismiss()
        console.log("Sharing via All is not possible")
      });
  }

  updateShareCounter(tochange) {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    this.http.post('https://afternoon-mountain-15657.herokuapp.com/updatecounters', { "_id": this.Article._id, "language": this.language, "tochange": tochange }, { headers: header })
      .toPromise()
      .then((data) => {
        console.log(data);
      })
      .catch(err => {
        console.log("error");
      })
  }

  readMore(New) {
    // this.ga.trackEvent("Click", "readMore News", this.Article.name, 0, false)
    this.navCtrl.push(ReadReviewPage, {
      language: this.language,
      Article: New
    });
  }



  updateLike() {
    var type
    if (!this.user) {
      this.navCtrl.push(LoginPage)
      return
    } else {
      if (this.isLike) {
        for (let i in this.Article.userslikes) {
          if (this.Article.userslikes[i] == this.user) {
            type = "unlike"
            this.isLike = false
            this.commentsNumber--
            delete this.Article.userslikes[i]
          }
        }
      }
      else {
        this.commentsNumber++
        this.isLike = true
        this.Article.userslikes.push(this.user)
        type = "like"
      }
      var data = {
        userId: this.user,
        articleId: this.Article._id,
        language: this.language.toUpperCase(),
        category: "news",
        type: type
      }
      let header = new Headers();
      header.append('Content-Type', 'application/json');
      this.http.post("http://afternoon-mountain-15657.herokuapp.com/setlikes", JSON.stringify(data), { headers: header })
        .toPromise()
        .then((data) => {
          console.log(data);

        }).catch((err) => {
          console.log(err);

        })
    }

  }



  AddComment() {
    var loading = this.loadingConfig.create()
    loading.present()
    if (this.commentText.length < 3) {
      loading.dismiss()
      let alert = this.alertCtrl.create({
        title: 'Oh oh!',
        subTitle: "Please enter more than 4 letters",
        buttons: ['Ok']
      })
      alert.present()
      return
    }
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/AddComment", { "_id": this.Article._id, "UserUid": this.user, "name": this.user.first_name+" "+this.user.last_name, "photoUrl": this.ImgProfile, "comment": this.commentText }, { headers: header })
      .toPromise()
      .then((data) => {
        this.comments.unshift({
          "_id": data.json().ops[0]._id,
          "ArticleId": this.Article._id,
          "UserUid": this.user,
          "name": this.user.first_name+" "+this.user.last_name,
          "photoUrl": this.ImgProfile,
          "comment": this.commentText,
          "subComment":[]
        })
        // this.ga.trackEvent("Click", "submit_comment", this.Article.name, 0, false)
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

  DeleteComment(Commrnt_id, i) {
    var loading = this.loadingConfig.create()
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
    var loading = this.loadingConfig.create()
    loading.present()
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/UpdateComment", { "_id": this.Commrnt_id, "UserUid": this.user, "comment": this.EditcommentText }, { headers: header })
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

  AddSubComment(Commrnt_id, i) {
    var loading = this.loadingConfig.create()
    loading.present()
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/AddSubComment", { "_id": Commrnt_id, "UserUid": this.user, "name": this.user.first_name+" "+this.user.last_name, "photoUrl": this.ImgProfile, "comment": this.SubcommentText }, { headers: header })
      .toPromise()
      .then((data) => {
        loading.dismiss()
        console.log(data);
          this.comments[i].subComment.push({
            "_id": Commrnt_id,
            "UserUid": this.user,
            "name": this.user.first_name+" "+this.user.last_name,
            "photoUrl": this.ImgProfile,
            "comment": this.SubcommentText
          })
          // this.ga.trackEvent("Click", "submit_sub_comment", this.Article.name, 0, false)
          this.Edit = false
        this.Reply = false
        this.SubcommentText = ""
      }).catch((err) => {
        console.log(err);

        loading.dismiss()
        let alert = this.alertCtrl.create({
          title: 'Sorry!',
          subTitle: "unable to post comment right now - try later ",
          buttons: ['Ok']
        })
        alert.present()
      })

  }

  deleteSubComment(Commrnt_id, SubcommentID, i) {
    var loading = this.loadingConfig.create()
    loading.present()

    let header = new Headers();
    header.append('Content-Type', 'application/json');
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/DeleteSubComment", { "SubcommentID": SubcommentID, "_id": Commrnt_id }, { headers: header })
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
    var loading = this.loadingConfig.create()
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
  GetAllComment() {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/GetAllComment", { "_id": this.Article._id }, { headers: header })
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

  clickeditComment(EditcommentText, i, Commrnt_id, isSubEditval, subComment_id) {
    if (!this.user._id) {
      this.app.getRootNav().setRoot("connection")
      return
    }
    this.subComment_id = subComment_id
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
    if (!this.user._id) {
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

    if (!this.user._id) {
      this.app.getRootNav().setRoot("connection")
      return
    }
    this.Edit = false
    this.Reply = false
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);
    setTimeout(() => {
      if(this.scrollcomment ){
        this.scrollcomment.scrollToBottom
       }
    }, 500);
  }

  clickContent() {
    console.log("clickContent");
    console.log(this.Edit, "this.Edit");
    console.log(this.Reply, "this.Reply");
    this.Edit = false
    this.Reply = false
  }

  openLogin() {
    this.app.getRootNav().setRoot("connection")
  }
  updateLike2(type) {
    console.log(this.Article);
    
 var a=[]
a.push(this.Article)
 this.socialprovider.updateLike(a,this.Article._id, type, 0, 'news')
  }
}
