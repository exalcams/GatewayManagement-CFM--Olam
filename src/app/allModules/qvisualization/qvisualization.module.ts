import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule,
  MatProgressSpinnerModule, MatTableModule, MatSortModule, MatCardModule, MatTooltipModule, MatListModule, MatDividerModule, MatPaginatorModule, MatIconModule, MatToolbarModule
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';

import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { QVisualizationComponent } from './qvisualization.component';
import { QvisualizationQtostackDialogComponent } from './qvisualization-qtostack-dialog/qvisualization-qtostack-dialog.component';


const authRoutes: Routes = [
  {
    path: '',
    component: QVisualizationComponent
  },

];


@NgModule({
  declarations: [
    QVisualizationComponent,
    QvisualizationQtostackDialogComponent
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
    MatToolbarModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    RouterModule.forChild(authRoutes),
    MatTableModule,
    MatSortModule,
    MatIconModule
  ],
  entryComponents: [QvisualizationQtostackDialogComponent]
})
export class QVisualizationModule { }
