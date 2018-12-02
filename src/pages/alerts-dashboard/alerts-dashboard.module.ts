import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlertsDashboardPage } from './alerts-dashboard';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AlertsDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(AlertsDashboardPage),
    TranslateModule.forChild()
],
})
export class AlertsPageModule {}
