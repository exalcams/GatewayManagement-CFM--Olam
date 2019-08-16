import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { BayQueueConfig } from 'app/models/GatewayModel';
import { MatSnackBar } from '@angular/material';
import { BayQueueConfigService } from 'app/services/bayQueueConfig.service';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { ResourceLoader } from '@angular/compiler';

@Component({
    selector: 'app-bay-queue-configuration-sidebar',
    templateUrl: './bay-queue-configuration-sidebar.component.html',
    styleUrls: ['./bay-queue-configuration-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class BayQueueConfigurationSidebarComponent implements OnInit, OnChanges {
    notificationSnackBarComponent: NotificationSnackBarComponent;
    @Output() configSelectionChanged: EventEmitter<BayQueueConfig> = new EventEmitter<BayQueueConfig>();
    @Input() reload: boolean;
    searchText: string;
    allBayConfigHeaders: BayQueueConfig[];
    selectedConfig: string;

    constructor(public snackBar: MatSnackBar, private _bayQConfigService: BayQueueConfigService) {
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    }

    ngOnInit(): void {
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
    }

    getAllBayConfigHeader(): void {
        this._bayQConfigService.getAllBayQueueConfigHeader().subscribe((result: BayQueueConfig[]) => {
            this.allBayConfigHeaders = result;
        });
    }

    loadSelectedConfiguration(selectedConfigHeader: BayQueueConfig): void {
        this.selectedConfig = selectedConfigHeader.BAY_GROUP;
        this.configSelectionChanged.emit(selectedConfigHeader);
    }

    resetConfigForm(): void {
        this.selectedConfig = '';
        this.configSelectionChanged.emit(null);
    }
}
