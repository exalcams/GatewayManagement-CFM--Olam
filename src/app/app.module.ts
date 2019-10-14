import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule, MatSnackBarModule, MatDialogModule, MatToolbarModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { NotificationSnackBarComponent } from './notifications/notification-snack-bar/notification-snack-bar.component';
import { DatePipe } from '@angular/common';
import { NotificationDialogComponent } from './notifications/notification-dialog/notification-dialog.component';

const appRoutes: Routes = [
    {
        path: 'auth',
        loadChildren: './allModules/authentication/authentication.module#AuthenticationModule'
    },
    {
        path: 'transaction',
        loadChildren: './allModules/transaction/transaction.module#TransactionModule'
    },
    {
        path: 'transactionDetails',
        loadChildren: './allModules/transaction-details/transaction-details.module#TransactionDeatilsModule'
    },
    {
        path: 'dashboard',
        loadChildren: './allModules/dashboard/dashboard.module#DashboardModule'
    },
    {
        path: 'dashboard-tat',
        loadChildren: './allModules/dashboard-tat/dashboard-tat.module#DashboardTATModule'
    },
    {
        path: 'configuration',
        loadChildren: './allModules/configuration/configuration.module#ConfigurationModule'
    },
    {
        path: 'bayqueueconfiguration',
        loadChildren: './allModules/bay-queue-configuration/bay-queue-configuration.module#BayQueueConfigurationModule'
    },
    {
        path: 'qrequest',
        loadChildren: './allModules/qrequest/qrequest.module#QRequestModule'
    },
    {
        path: 'qapprove',
        loadChildren: './allModules/qapprove/qapprove.module#QApproveModule'
    },
    {
        path: 'qvisualization',
        loadChildren: './allModules/qvisualization/qvisualization.module#QVisualizationModule'
    },
    {
        path: 'master',
        loadChildren: './allModules/master/master.module#MasterModule'
    },
    {
        path: 'report',
        loadChildren: './allModules/report/report.module#ReportModule'
    },
    {
        path: 'gateway-status',
        loadChildren: './allModules/gateway-status/gateway-status.module#GatewayStatusModule'
    },
    {
        path: 'queue',
        loadChildren: './allModules/queue/queue.module#QueueModule'
    },
    {
        path: '**',
        redirectTo: 'auth/login'
    }
];

@NgModule({
    declarations: [AppComponent, NotificationSnackBarComponent, NotificationDialogComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { useHash: true }),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        MatToolbarModule,
        MatDialogModule,
        // App modules
        LayoutModule
    ],
    bootstrap: [AppComponent],
    entryComponents: [NotificationDialogComponent]
})
export class AppModule { }
