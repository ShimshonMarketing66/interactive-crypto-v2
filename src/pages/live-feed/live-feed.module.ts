import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LiveFeedPage } from './live-feed';

@NgModule({
  declarations: [
    LiveFeedPage,
  ],
  imports: [
    IonicPageModule.forChild(LiveFeedPage),
  ],
})
export class LiveFeedPageModule {}
