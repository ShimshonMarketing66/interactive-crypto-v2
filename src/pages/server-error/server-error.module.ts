import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServerErrorPage } from './server-error';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';

@NgModule({
  declarations: [
    ServerErrorPage,
  ],
  imports: [
    IonicPageModule.forChild(ServerErrorPage),
    TranslateModule.forChild()
  ],
})
export class ServerErrorPageModule {}
