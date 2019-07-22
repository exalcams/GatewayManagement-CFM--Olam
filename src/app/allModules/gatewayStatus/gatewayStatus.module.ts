

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatPaginatorModule, MatIconModule, MatDatepickerModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatStepperModule, MatProgressSpinnerModule, MatListModule, MatMenuModule, MatTooltipModule, MatRadioModule, MatSidenavModule, MatDialogModule, MatDividerModule, MatToolbarModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components';
import { FileUploadModule } from 'ng2-file-upload';
import { DatePipe } from '@angular/common';
import { GatewayStatusComponent } from './gatewayStatus.component';

const menuRoutes: Routes = [
    {
        path: '',
        component: GatewayStatusComponent,
    }
];
@NgModule({
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
    declarations: [
        GatewayStatusComponent,
    ],
    providers: [
        DatePipe
    ]
})
export class GatewayStatusModule {
}

