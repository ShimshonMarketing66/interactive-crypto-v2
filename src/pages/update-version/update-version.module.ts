import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateVersionPage } from './update-version';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UpdateVersionPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateVersionPage),
    TranslateModule.forChild()

  ],
})
export class UpdateVersionPageModule {}
