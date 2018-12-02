import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PortFolioTransactionPage } from './port-folio-transaction';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';
import { Firebase } from '@ionic-native/firebase';

@NgModule({
  declarations: [
    PortFolioTransactionPage,
  ],
  imports: [
    IonicPageModule.forChild(PortFolioTransactionPage),
    TranslateModule.forChild(),
PipesModule
  ],providers:[Firebase]
})
export class AllcoinPageModule {}
