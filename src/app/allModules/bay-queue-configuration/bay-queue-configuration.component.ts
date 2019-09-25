import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { BayQueueConfigDetails } from 'app/models/gateway-model';
import { AuthenticationDetails } from 'app/models/authentication-details';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { BayQueueConfigService } from 'app/services/bay-queue-config.service';
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
    allBayConfigHeaders: BayQueueConfigDetails[] = [];
    SelectedConfiguration: BayQueueConfigDetails;
    reloadConfigList: string;

    constructor(private _bayQConfigService: BayQueueConfigService, private _router: Router, public snackBar: MatSnackBar) {
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.IsProgressBarVisibile = true;
        this.authenticationDetails = new AuthenticationDetails();
        this.reloadConfigList = null;
    }

    ngOnInit(): void {
                // Retrive authorizationData
                const retrievedObject = localStorage.getItem('authorizationData');
                if (retrievedObject) {
                    this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
                } else {
                    // this._router.navigate(['/auth/login']);
                }
        this.IsProgressBarVisibile = false;
        this.getAllBayConfigHeader();
    }

    onConfigSelectionChanged(selectedConfiguration: BayQueueConfigDetails): void {
        this.SelectedConfiguration = selectedConfiguration;
        this.reloadConfigList = null;
    }

    getAllBayConfigHeader(): void {
        this._bayQConfigService.getAllBayQueueConfigHeader(this.authenticationDetails.userID).subscribe((result: BayQueueConfigDetails[]) => {
            this.allBayConfigHeaders = result;
        });
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
        this.getAllBayConfigHeader();
    }
}
