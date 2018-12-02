import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhoneNumberVerifiedPage } from './phone-number-verified';
import { TranslateModule } from '@ngx-translate/core';
import { Profile } from '../../models/profile-model';

@NgModule({
  declarations: [
    PhoneNumberVerifiedPage,
  ],
  imports: [
    IonicPageModule.forChild(PhoneNumberVerifiedPage),
    TranslateModule.forChild()

  ],  providers:[Profile]

})
export class PhoneNumberVerifiedPageModule {}
