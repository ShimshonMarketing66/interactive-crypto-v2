import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PortFolioHistoricPage } from './port_folio-historic';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PortFolioHistoricPage,
  ],
  imports: [
    IonicPageModule.forChild(PortFolioHistoricPage),
    TranslateModule.forChild(),
    PipesModule

  ],
})
export class AllcoinPageModule {}
