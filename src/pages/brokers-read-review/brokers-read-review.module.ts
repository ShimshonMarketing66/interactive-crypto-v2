import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrokersReadReviewPage } from './brokers-read-review';
import { Firebase } from '@ionic-native/firebase';

@NgModule({
  declarations: [
    BrokersReadReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(BrokersReadReviewPage),
  ],providers:[Firebase]
})
export class BrokersReadReviewPageModule {}
