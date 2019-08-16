import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {
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
    MatTooltipModule
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';

import { BayQueueConfigurationComponent } from './bay-queue-configuration.component';
import { BayQueueConfigurationContentComponent } from './bay-queue-configuration-content/bay-queue-configuration-content.component';
import { BayQueueConfigurationSidebarComponent } from './bay-queue-configuration-sidebar/bay-queue-configuration-sidebar.component';

const menuRoutes: Routes = [
    {
        path: '',
        component: BayQueueConfigurationComponent
    }
];
@NgModule({
    imports: [
        CommonModule,
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
        MatTooltipModule,
        FuseSharedModule,
        RouterModule.forChild(menuRoutes)
    ],
    declarations: [BayQueueConfigurationComponent, BayQueueConfigurationSidebarComponent, BayQueueConfigurationContentComponent]
})
export class BayQueueConfigurationModule {}
