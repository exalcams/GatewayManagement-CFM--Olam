import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { BayQueueConfig } from 'app/models/GatewayModel';
import { AuthenticationDetails } from 'app/models/authentication_details';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { BayQueueConfigService } from 'app/services/bayQueueConfig.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-bay-queue-configuration',
    templateUrl: './bay-queue-configuration.component.html',
    styleUrls: ['./bay-queue-configuration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class BayQueueConfigurationComponent implements OnInit {
    authenticationDetails: AuthenticationDetails;
    notificationSnackBarComponent: NotificationSnackBarComponent;

    IsProgressBarVisibile: boolean;
    SelectedConfiguration: BayQueueConfig;
    reloadConfigList: string;

    constructor(private _bayQConfigService: BayQueueConfigService, private _router: Router, public snackBar: MatSnackBar) {
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.IsProgressBarVisibile = true;
        this.authenticationDetails = new AuthenticationDetails();
        this.reloadConfigList = null;
    }

    ngOnInit(): void {
        this.IsProgressBarVisibile = false;
    }

    onConfigSelectionChanged(selectedConfiguration: BayQueueConfig): void {
        this.SelectedConfiguration = selectedConfiguration;
        this.reloadConfigList = null;
    }

    OnShowProgressBarEvent(status: string): void {
        if (status === 'show') {
            this.IsProgressBarVisibile = true;
        } else {
            this.IsProgressBarVisibile = false;
        }
    }

    RefreshAllConfigurations(msg: string): void {
        if (msg) {
            this.reloadConfigList = msg;
        }
        // this.GetAllConfigurations(this.authenticationDetails.userID);
    }
}
