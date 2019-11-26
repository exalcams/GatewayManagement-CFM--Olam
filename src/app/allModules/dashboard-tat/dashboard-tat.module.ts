import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,
  MatStepperModule, MatListModule, MatMenuModule, MatRadioModule, MatSidenavModule,
  MatToolbarModule, MatSpinner, MatProgressSpinnerModule, MatDividerModule, MatTableModule,
  MatTabsModule, MatPaginator, MatPaginatorModule, MatDialogModule, MatDatepickerModule, MatTooltipModule,
  MatSortModule
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { DashboardTATComponent } from './dashboard-tat.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSidebarModule, FuseWidgetModule } from '@fuse/components';
import { DatePipe } from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NgxDonutChartModule } from 'ngx-doughnut-chart';
import { DashboardTatWithatlComponent } from './dashboard-tat-withatl/dashboard-tat-withatl.component';
import { DashboardTatWithoutatlComponent } from './dashboard-tat-withoutatl/dashboard-tat-withoutatl.component';
import { DashboardTatAllComponent } from './dashboard-tat-all/dashboard-tat-all.component';
export const menuRoutes: Routes = [
  {
    path: 'withatl',
    component: DashboardTatWithatlComponent
  },
  {
    path: 'withoutatl',
    component: DashboardTatWithoutatlComponent
  },
  {
    path: 'all',
    component: DashboardTatAllComponent
  }
  
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
    MatProgressSpinnerModule,
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
    FuseWidgetModule,
    ChartsModule,
    NgxDonutChartModule
  ],
  declarations: [DashboardTATComponent, DashboardTatWithatlComponent, DashboardTatWithoutatlComponent, DashboardTatAllComponent],
  providers: [
    DatePipe
  ]
})

export class DashboardTATModule { }
