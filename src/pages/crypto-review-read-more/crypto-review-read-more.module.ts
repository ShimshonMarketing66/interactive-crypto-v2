import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CryptoReviewReadMorePage } from './crypto-review-read-more';

@NgModule({
  declarations: [
    CryptoReviewReadMorePage,
  ],
  imports: [
    IonicPageModule.forChild(CryptoReviewReadMorePage),
    TranslateModule.forChild()

  ]
})
export class CryptoReviewReadMorePageModule {}
