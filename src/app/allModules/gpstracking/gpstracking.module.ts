import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,
  MatStepperModule, MatListModule, MatMenuModule, MatRadioModule, MatSidenavModule, MatToolbarModule, MatSpinner, MatProgressSpinner, MatProgressSpinnerModule
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { GPSTrackingComponent } from './gpstracking.component';
import { GPSTrackingLeftBarComponent } from './gpstracking-left-bar/gpstracking-left-bar.component';
import { GPSTrackingRightBarComponent } from './gpstracking-right-bar/gpstracking-right-bar.component';

const menuRoutes: Routes = [
  {
      path: '',
      component: GPSTrackingComponent
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
    FuseSharedModule,
    RouterModule.forChild(menuRoutes)
  ],
  declarations: [GPSTrackingComponent, GPSTrackingLeftBarComponent, GPSTrackingRightBarComponent]
})
export class GPSTrackingModule { }
