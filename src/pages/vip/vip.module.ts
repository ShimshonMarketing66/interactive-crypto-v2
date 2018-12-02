import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VipPage } from './vip';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';
import { Firebase } from '@ionic-native/firebase';


@NgModule({
  declarations: [
    VipPage,
  ],
  imports: [
    IonicPageModule.forChild(VipPage),
    TranslateModule.forChild()

    ],providers:[Firebase]
})
export class VipPageModule {}
