import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ClassPage } from './class';

@NgModule({
  declarations: [
    ClassPage,
  ],
  imports: [
    IonicPageModule.forChild(ClassPage),
    TranslateModule.forChild()

  ],
})
export class ClassPageModule {}
