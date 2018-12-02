import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Countries } from './countries';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    Countries,
  ],
  imports: [
    IonicPageModule.forChild(Countries),
    TranslateModule.forChild(),
    PipesModule
  ],
})
export class AboutUsPageModule {}
