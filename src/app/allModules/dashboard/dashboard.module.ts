import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,
  // tslint:disable-next-line:max-line-length
  MatStepperModule, MatListModule, MatMenuModule, MatRadioModule, MatSidenavModule, MatToolbarModule, MatSpinner, MatProgressSpinnerModule, MatDividerModule, MatTableModule, MatTabsModule, MatPaginator, MatPaginatorModule, MatDialogModule, MatDatepickerModule, MatTooltipModule, MatSortModule
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { DashboardComponent } from './dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSidebarModule, FuseWidgetModule } from '@fuse/components';
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { DatePipe } from '@angular/common';
export const menuRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'dashboard-detail',
    component: DashboardDetailComponent
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
    MatSortModule,
    RouterModule.forChild(menuRoutes),
    FuseSharedModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatDialogModule,
    MatTableModule,
    MatDatepickerModule,
    MatTabsModule,
    MatPaginatorModule,
    MatTooltipModule,

    NgxChartsModule,

    FuseSharedModule,
    FuseSidebarModule,
    FuseWidgetModule
  ],
  declarations: [DashboardComponent, DashboardDetailComponent],
  providers: [
    DatePipe
  ]
})

export class DashboardModule { }
