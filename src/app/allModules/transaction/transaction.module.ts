import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSnackBarModule, MatSortModule,
    MatTableModule, MatTabsModule, MatCheckboxModule, MatCardModule, MatDialogModule, MatTooltipModule, MatProgressSpinnerModule, MatDatepickerModule
} from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { TransactionComponent } from './transaction.component';
import { TransactionService } from 'app/services/transaction.service';
import { DatePipe } from '@angular/common';

const authRoutes: Routes = [
    {
        path: '',
        component: TransactionComponent,
    },
    {
        path: ':ID',
        component: TransactionComponent,
        resolve  : {
            data: TransactionService
        }     
    },
];

@NgModule({
    declarations: [
        TransactionComponent
    ],
    imports: [
        RouterModule.forChild(authRoutes),

        MatButtonModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,

        MatCheckboxModule,
        MatCardModule,
        MatTooltipModule,
        MatDialogModule,
        MatDatepickerModule,
        MatProgressSpinnerModule,
        NgxChartsModule,

        FuseSharedModule,
        FuseWidgetModule
    ],
    providers   : [
        DatePipe,
        TransactionService
    ]
})
export class TransactionModule {
}
