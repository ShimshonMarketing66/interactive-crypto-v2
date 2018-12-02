import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopUpRateUsPage } from './pop-up-rate-us';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PopUpRateUsPage,
  ],
  imports: [
    IonicPageModule.forChild(PopUpRateUsPage),
    TranslateModule.forChild()

  ],
})
export class PopUpRateUsPageModule {}
