import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { termAndPrivacyPage } from './termAndPrivacy';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    termAndPrivacyPage,
  ],
  imports: [
    IonicPageModule.forChild(termAndPrivacyPage),
    TranslateModule.forChild()

  ],
})
export class AllcoinPageModule {}
