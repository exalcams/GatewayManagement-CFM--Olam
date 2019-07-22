import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,
  MatStepperModule, MatListModule, MatMenuModule, MatRadioModule, MatSidenavModule, MatToolbarModule, MatSpinner, MatProgressSpinner, MatProgressSpinnerModule
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { QApproveComponent } from './qapprove.component';
import { QApproveRightBarComponent } from './qapprove-right-bar/qapprove-right-bar.component';
import { QApproveLeftBarComponent } from './qapprove-left-bar/qapprove-left-bar.component';
const menuRoutes: Routes = [
  {
      path: '',
      component: QApproveComponent
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
  declarations: [  QApproveComponent, QApproveRightBarComponent, QApproveLeftBarComponent]
})
export class QApproveModule { }
