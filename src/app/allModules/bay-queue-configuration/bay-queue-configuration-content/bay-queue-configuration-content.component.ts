import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { BayQueueConfig } from 'app/models/GatewayModel';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { AuthenticationDetails } from 'app/models/authentication_details';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { BayQueueConfigService } from 'app/services/bayQueueConfig.service';
import { fuseAnimations } from '@fuse/animations';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';

@Component({
    selector: 'app-bay-queue-configuration-content',
    templateUrl: './bay-queue-configuration-content.component.html',
    styleUrls: ['./bay-queue-configuration-content.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class BayQueueConfigurationContentComponent implements OnInit, OnChanges {
    @Input() currentSelectedConfiguration: BayQueueConfig;
    @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
    @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();

    bayQConfigData: BayQueueConfig;
    bayQConfigForm: FormGroup;
    isLoading: boolean;
    IsProgressBarVisibile: boolean;
    notificationSnackBarComponent: NotificationSnackBarComponent;
    authenticationDetails: AuthenticationDetails;
    No_TrucksData = ['1', '2', '3'];
    allPlantsData: string[];
    allBayGrp: string[] = [];
    allBayName: string[] = [];
    allBayType: string[] = [];

    constructor(
        private _formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private _bayQService: BayQueueConfigService,
        private dialog: MatDialog
    ) {
        this.isLoading = true;
        this.IsProgressBarVisibile = true;
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    }

    ngOnInit(): void {
        // Retrive authorizationData
        const retrievedObject = localStorage.getItem('authorizationData');
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
        } else {
            // this._router.navigate(['/auth/login']);
        }
        this.initForm();
        this.getAllBayGrp();
        this.getAllBayType();
        this.getAllBayPlant();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.currentSelectedConfiguration) {
            this.allBayName.push(this.currentSelectedConfiguration.BAY_NAME);
            this.bayQConfigForm.setValue({
                BAY_GROUP: this.currentSelectedConfiguration.BAY_GROUP,
                BAY_NAME: this.currentSelectedConfiguration.BAY_NAME,
                BAY_TYPE: this.currentSelectedConfiguration.BAY_TYPE,
                PLANT: this.currentSelectedConfiguration.PLANT,
                NO_OF_TRUCKS: this.currentSelectedConfiguration.NO_OF_TRUCKS
            });
        } else {
            this.resetForm();
        }
    }

    initForm(): void {
        this.bayQConfigForm = this._formBuilder.group({
            BAY_GROUP: ['', Validators.required],
            BAY_NAME: ['', Validators.required],
            BAY_TYPE: ['', Validators.required],
            PLANT: ['', Validators.required],
            NO_OF_TRUCKS: ['', Validators.required]
        });
    }

    resetForm(): void {
        this.initForm();
        this.bayQConfigForm.reset();
    }

    getAllBayGrp(): void {
        this._bayQService.getAllBayGroup().subscribe((result: string[]) => {
            this.allBayGrp = result;
        });
    }

    getThisBayName(bayGrp: string): void {
        this._bayQService.getBayNameByGrp(bayGrp).subscribe((result: string[]) => {
            this.allBayName = result;
        });
    }

    getAllBayType(): void {
        this._bayQService.getAllBayType().subscribe((result: string[]) => {
            this.allBayType = result;
        });
    }

    getAllBayPlant(): void {
        this._bayQService.getAllBayPlant().subscribe((result: string[]) => {
            this.allPlantsData = result;
        });
    }

    OnGrpChanged(value): void {
        this.getThisBayName(value);
    }

    SaveClicked(action: string): void {
        this.bayQConfigData = new BayQueueConfig();
        this.bayQConfigData.BAY_GROUP = this.bayQConfigForm.get('BAY_GROUP').value;
        this.bayQConfigData.BAY_NAME = this.bayQConfigForm.get('BAY_NAME').value;
        this.bayQConfigData.BAY_TYPE = this.bayQConfigForm.get('BAY_TYPE').value;
        this.bayQConfigData.PLANT = this.bayQConfigForm.get('PLANT').value;
        this.bayQConfigData.NO_OF_TRUCKS = this.bayQConfigForm.get('NO_OF_TRUCKS').value;
        this.bayQConfigData.CREATED_BY = this.authenticationDetails.userName;

        if (action === 'Create') {
            const dialogConfig: MatDialogConfig = {
                data: {
                    Actiontype: 'Create',
                    Catagory: 'Bay Queue Configuration'
                }
            };
            const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.ShowProgressBarEvent.emit('show');
                    this.CreateConfig(this.bayQConfigData);
                }
            });
        } else if (action === 'Delete') {
            const dialogConfig: MatDialogConfig = {
                data: {
                    Actiontype: 'Delete',
                    Catagory: 'Bay Queue Configuration'
                }
            };
            const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.ShowProgressBarEvent.emit('show');
                    this.DeleteConfig(this.bayQConfigData);
                }
            });
        } else {
            const dialogConfig: MatDialogConfig = {
                data: {
                    Actiontype: 'Update',
                    Catagory: 'Bay Queue Configuration'
                }
            };
            const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.ShowProgressBarEvent.emit('show');
                    this.UpdateConfig(this.bayQConfigData);
                }
            });
        }
    }

    CreateConfig(data: BayQueueConfig): void {
        this._bayQService.createBayQueueConfig(data).subscribe(
            result => {
                this.resetForm();
                this.notificationSnackBarComponent.openSnackBar('Bay configuration added successfully', SnackBarStatus.success);
                this.SaveSucceed.emit('success');
                this.ShowProgressBarEvent.emit('hide');
            },
            err => {
                this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                this.ShowProgressBarEvent.emit('hide');
            }
        );
    }

    UpdateConfig(data: BayQueueConfig): void {
        data.ID = this.currentSelectedConfiguration.ID;
        this._bayQService.updateBayQueueConfig(data).subscribe(
            result => {
                this.resetForm();
                this.notificationSnackBarComponent.openSnackBar('Bay configuration updated successfully', SnackBarStatus.success);
                this.SaveSucceed.emit('success');
                this.ShowProgressBarEvent.emit('hide');
            },
            err => {
                this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                this.ShowProgressBarEvent.emit('hide');
            }
        );
    }

    DeleteConfig(data: BayQueueConfig): void {
        data.ID = this.currentSelectedConfiguration.ID;
        this._bayQService.deleteBayQueueConfig(data).subscribe(
            result => {
                this.resetForm();
                this.notificationSnackBarComponent.openSnackBar('Bay configuration deleted successfully', SnackBarStatus.success);
                this.SaveSucceed.emit('updated');
                this.ShowProgressBarEvent.emit('hide');
            },
            err => {
                this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                this.ShowProgressBarEvent.emit('hide');
            }
        );
    }
}
