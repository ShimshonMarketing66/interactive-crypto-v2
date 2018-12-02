import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReadReviewPage } from './read-review';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ReadReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(ReadReviewPage),
    TranslateModule.forChild()

  ],
})
export class SettingsPageModule {}
