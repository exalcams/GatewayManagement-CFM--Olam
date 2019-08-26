import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDialogModule,
     MatProgressSpinnerModule, MatTableModule, MatSortModule, MatStepperModule, MatIconModule, MatCardModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { TransactionDetailsWizardComponent } from './transaction-details-wizard.component';

const authRoutes: Routes = [
    {
        path: '',
        component: TransactionDetailsWizardComponent
    },
    
];

@NgModule({
    declarations: [
     TransactionDetailsWizardComponent
    ],
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatCardModule,
        MatStepperModule,
        MatInputModule,
        MatIconModule,
        FuseSharedModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        RouterModule.forChild(authRoutes),
        MatTableModule,
        MatSortModule
    ],
})
export class TransactionDeatilsWizardModule {
}
