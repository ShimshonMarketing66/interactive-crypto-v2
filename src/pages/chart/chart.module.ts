import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartPage } from './chart';
import { ChartUI } from '../../app/ui_component/ui.component';
import { StudyDialog } from '../../app/study_dialog_component/study.dialog.component';
import { DirectivesModule } from '../../directives/directives.module';
import { ChartComponent } from '../../app/chart_component/chart.component';
import { Colorpicker } from '../../app/colorpicker_component/colorpicker';
import { FilterByPropertyPipe } from '../../app/pipes/property.filter.pipe';
import { ThemeDialog } from '../../app/theme_dialog_component/theme.dialog.component';
import { TimezoneDialog } from '../../app/timezone_dialog_component/timezone.dialog.component';
import { OverlayMenu } from '../../app/overlay_menu_component/overlay.menu';
import { DrawingToolbar } from '../../app/drawing_toolbar_component/drawing.toolbar.component';
import { TitlecasePipe } from '../../app/pipes/title.case.pipe';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ChartPage,
    ChartUI,
    DrawingToolbar,
    ChartComponent,
    Colorpicker,
    FilterByPropertyPipe,
    StudyDialog,
    ThemeDialog,
    TimezoneDialog,
    OverlayMenu,
    TitlecasePipe,
  ],
  imports: [
    IonicPageModule.forChild(ChartPage),
    DirectivesModule,
    PipesModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ,
    NO_ERRORS_SCHEMA]
})
export class ChartPageModule {}
