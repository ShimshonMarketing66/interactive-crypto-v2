import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, App } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { TrackEventProvider } from '../../providers/track-event/track-event';

@IonicPage({
  name:"onboarding"
})
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html'
})
export class OnboardingPage {
  currentIndex: number=0;
  @ViewChild(Slides) slides: Slides;
  
  constructor(public trackEvent: TrackEventProvider,public navCtrl: NavController,public app:App) {

  }
  slideChanged() {
    console.log(this.slides.getActiveIndex());
    
    this.currentIndex = this.slides.getActiveIndex();
    
  }
  clickNext() {
    console.log( this.slides.slideNext());
    this.slides.slideNext();
  }
  ionViewDidEnter(){
    console.log("ionViewDidEnter onboarding");
    this.trackEvent.trackView("onboarding")

  }
  ionViewWillLeave(){
  }

  gotoLogIn(){
    this.navCtrl.setRoot("connection",{ selectedTab: 1 },{direction:"forward"})
  }
  skipToDashboard(){
    this.navCtrl.setRoot("tabs")
  }
  gotoSignIn(){
    this.navCtrl.setRoot("connection")
  }
}
