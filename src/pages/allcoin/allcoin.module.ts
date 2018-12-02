import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllcoinPage } from './allcoin';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    AllcoinPage,
  ],
  imports: [
    IonicPageModule.forChild(AllcoinPage),
    DirectivesModule,
    PipesModule],
})
export class AllcoinPageModule {}
