import { Component } from '@angular/core';
import { NavController, NavParams,App,ViewController, IonicPage  } from 'ionic-angular';
import { EducationReviewService } from '../../services/education-review.service';
import { TrackEventProvider } from '../../providers/track-event/track-event';

@IonicPage({
  name:"class"
})
@Component({
  selector: 'page-class',
  templateUrl: 'class.html'
})

export class ClassPage {
  num1: number;
  pushPage: any;
  params: Object;
  quiznum:number;
  language:string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public educationReviewService: EducationReviewService,
    public appCtrl: App,
    public trackEvent: TrackEventProvider,
    public viewCtrl:ViewController 
  ) {
    this.language=this.navParams.get("language");
    console.log(this.language);
    
    this.num1 = this.navParams.get("classNum");
this.quiznum=1;
  }
  ionViewDidEnter() {
    console.log("classPage ionViewDidLoad");
    document.getElementById("blog").innerHTML = this.educationReviewService.getClassReview(this.num1, this.language);
    this.trackEvent.trackView("classPage")

  }
  ionViewWillLeave() {

  }

  goToQuizz(num:number){
    if(num < 13){
      num= num+1;
    }
      else{
        num=1;
    }
    this.navCtrl.pop({animate:false});
    this.navCtrl.push(ClassPage,{classNum: num,language:this.language});
    
    }
    goToqusten(num:number,quiznum:number){
      console.log(quiznum);
     
      this.navCtrl.pop({animate:false});
      this.navCtrl.push("questionsPage",{ClassNum: num,quiznum: quiznum,language:this.language});
    }
  }
