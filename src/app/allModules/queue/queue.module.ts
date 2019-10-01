import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule,
  MatProgressSpinnerModule, MatTableModule, MatSortModule, MatCardModule, MatTooltipModule, MatListModule, MatDividerModule, MatPaginatorModule, MatIconModule
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';

import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { QueueComponent } from './queue.component';


const authRoutes: Routes = [
  {
    path: '',
    component: QueueComponent
  },

];


@NgModule({
  declarations: [
    QueueComponent
  ],
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatCardModule,
    MatTooltipModule,
    MatInputModule,
    FuseSharedModule,
    FuseWidgetModule,
    MatDialogModule,
    MatPaginatorModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    RouterModule.forChild(authRoutes),
    MatTableModule,
    MatSortModule,
    MatIconModule
  ],
})
export class QueueModule { }
