import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { TranslateModule } from '@ngx-translate/core';
import { Profile } from '../../models/profile-model';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    TranslateModule.forChild()

  ],  providers:[Profile]

})
export class LoginPageModule {}
