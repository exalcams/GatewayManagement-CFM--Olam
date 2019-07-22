import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,
  MatStepperModule, MatListModule, MatMenuModule, MatRadioModule, MatSidenavModule, MatToolbarModule, MatSpinner, MatProgressSpinner, MatProgressSpinnerModule, MatTooltipModule
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationLeftBarComponent } from './configuration-left-bar/configuration-left-bar.component';
import { ConfigurationRightBarComponent } from './configuration-right-bar/configuration-right-bar.component';

const menuRoutes: Routes = [
  {
      path: '',
      component: ConfigurationComponent
  },
];
@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatMenuModule,
    MatRadioModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    FuseSharedModule,
    RouterModule.forChild(menuRoutes)
  ],
  declarations: [  ConfigurationComponent, ConfigurationLeftBarComponent, ConfigurationRightBarComponent]
})
export class ConfigurationModule { }
