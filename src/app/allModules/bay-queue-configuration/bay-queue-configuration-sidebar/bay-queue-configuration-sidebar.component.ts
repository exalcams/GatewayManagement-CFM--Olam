import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { BayQueueConfigDetails } from 'app/models/gateway-model';
import { MatSnackBar } from '@angular/material';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { ResourceLoader } from '@angular/compiler';
import { AuthenticationDetails } from 'app/models/authentication-details';
import { Guid } from 'guid-typescript';
import { BayQueueConfigService } from 'app/services/bay-queue-config.service';

@Component({
    selector: 'app-bay-queue-configuration-sidebar',
    templateUrl: './bay-queue-configuration-sidebar.component.html',
    styleUrls: ['./bay-queue-configuration-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class BayQueueConfigurationSidebarComponent implements OnInit, OnChanges {
    notificationSnackBarComponent: NotificationSnackBarComponent;
    @Output() configSelectionChanged: EventEmitter<BayQueueConfigDetails> = new EventEmitter<BayQueueConfigDetails>();
    @Input() reload: boolean;
    @Input() AllConfigurations: BayQueueConfigDetails[] = [];
    searchText: string;
    allBayConfigHeaders: BayQueueConfigDetails[];
    selectedConfig: string;
    authenticationDetails: AuthenticationDetails;

    constructor(public snackBar: MatSnackBar, private _bayQConfigService: BayQueueConfigService) {
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    }

    ngOnInit(): void {
        const retrievedObject = localStorage.getItem('authorizationData');
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
        } else {
            // this._router.navigate(['/auth/login']);
        }
        this.selectedConfig = '';
        this.searchText = '';
        this.allBayConfigHeaders = [];
        this.getAllBayConfigHeader();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.reload) {
            this.getAllBayConfigHeader();
            this.selectedConfig = '';
        }
        //this.getAllBayConfigHeader();
        // if (this.allBayConfigHeaders.length > 0) {
        //     this.selectedConfig = this.allBayConfigHeaders[0].BAY_NAME;
        //     this.loadSelectedConfiguration(this.allBayConfigHeaders[0]);
        // }
    }

    getAllBayConfigHeader(): void {
        this._bayQConfigService.getAllBayQueueConfigHeader(this.authenticationDetails.userID).subscribe((result: BayQueueConfigDetails[]) => {
            this.allBayConfigHeaders = result;
        });
    }

    loadSelectedConfiguration(selectedConfigHeader: BayQueueConfigDetails): void {
        this.selectedConfig = selectedConfigHeader.BAY_NAME;
        this.configSelectionChanged.emit(selectedConfigHeader);
    }

    resetConfigForm(): void {
        this.selectedConfig = '';
        this.configSelectionChanged.emit(null);
    }
}
