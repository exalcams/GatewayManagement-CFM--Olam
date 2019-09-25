import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    // tslint:disable-next-line:max-line-length
    MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,
    // tslint:disable-next-line:max-line-length
    MatStepperModule, MatListModule, MatMenuModule, MatRadioModule, MatSidenavModule, MatToolbarModule, MatSpinner, MatProgressSpinner, MatProgressSpinnerModule, MatDialogModule, MatSortModule, MatTableModule, MatDatepickerModule, MatPaginatorModule, MatCheckboxModule, MatDividerModule, MatTooltipModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseWidgetModule } from '@fuse/components';
import { FileUploadModule } from 'ng2-file-upload';
import { StageWiseReportComponent } from './stagewise-report/stagewise-report.component';
import { TransactionReportComponent } from './transaction-report/transaction-report.component';
import { DatePipe } from '@angular/common';
import { ExcelExtractService } from 'app/services/excel-extract.service';

const menuRoutes: Routes = [
    {
        path: 'transactionReport',
        component: TransactionReportComponent,
    },
    {
        path: 'stageWiseReport',
        component: StageWiseReportComponent,
    }
];
@NgModule({
    declarations: [
       TransactionReportComponent,
       StageWiseReportComponent,
    ],
    imports: [
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatPaginatorModule ,
        MatIconModule,
        MatDatepickerModule,
        MatTableModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatMenuModule,
        MatTooltipModule,
        MatRadioModule,
        MatSidenavModule,
        MatDialogModule,
        MatDividerModule,
        MatToolbarModule,
        FuseSharedModule,
        FuseWidgetModule,
        FileUploadModule,
        RouterModule.forChild(menuRoutes)
    ],
    providers: [
        DatePipe,
        ExcelExtractService
    ]
})
export class ReportModule {
}

