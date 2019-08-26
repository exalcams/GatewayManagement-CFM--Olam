import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule,
     MatProgressSpinnerModule, MatTableModule, MatSortModule, MatStepperModule, MatIconModule, MatCardModule, MatGridListModule, MatTooltipModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { TransactionDetailsComponent } from './transaction-details.component';

const authRoutes: Routes = [
    {
        path: ':ID',
        component: TransactionDetailsComponent
    },
    {
        path: '',
        redirectTo: 'auth/login'
    }
    
];

@NgModule({
    declarations: [
        TransactionDetailsComponent
    ],
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatGridListModule,
        MatCardModule,
        MatStepperModule,
        MatInputModule,
        MatIconModule,
        MatTooltipModule,
        FuseSharedModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        RouterModule.forChild(authRoutes),
        MatTableModule,
        MatSortModule
    ],
})
export class TransactionDeatilsModule {
}

