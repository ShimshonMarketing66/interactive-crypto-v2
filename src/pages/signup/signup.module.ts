import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { SignupPage } from './signup';
import { Profile } from '../../models/profile-model';

@NgModule({
  declarations: [
    SignupPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupPage),
    TranslateModule.forChild()

  ],
  providers:[Profile]
})
export class SigninPageModule {}
