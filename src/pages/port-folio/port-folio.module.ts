import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PortFolioPage } from './port-folio';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';
import { Firebase } from '@ionic-native/firebase';

@NgModule({
  declarations: [
    PortFolioPage,
  ],
  imports: [
    IonicPageModule.forChild(PortFolioPage),
    TranslateModule.forChild(),
    PipesModule
  ],providers:[Firebase]
})
export class AllcoinPageModule {}
