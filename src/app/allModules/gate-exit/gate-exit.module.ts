import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,
  MatStepperModule, MatListModule, MatMenuModule, MatRadioModule, MatSidenavModule, MatToolbarModule, MatSpinner, MatProgressSpinner, MatProgressSpinnerModule
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { GateExitComponent } from './gate-exit.component';

const menuRoutes: Routes = [
  {
    path: '',
    component: GateExitComponent
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
  declarations: [GateExitComponent]
})
export class GateExitModule { }
