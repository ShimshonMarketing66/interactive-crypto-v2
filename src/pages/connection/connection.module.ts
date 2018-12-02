import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConnectionPage } from './connection';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ConnectionPage,
  ],
  imports: [
    IonicPageModule.forChild(ConnectionPage),
    TranslateModule.forChild()

  ]
})
export class ConnectionPageModule {}
