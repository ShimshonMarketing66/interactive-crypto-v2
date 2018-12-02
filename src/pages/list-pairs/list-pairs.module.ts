import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListPairsPage } from './list-pairs';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ListPairsPage,
  ],
  imports: [
    IonicPageModule.forChild(ListPairsPage),
    PipesModule
  ],
})
export class ListPairsPageModule {}
