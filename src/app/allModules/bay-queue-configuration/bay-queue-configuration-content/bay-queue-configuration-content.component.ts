import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { BayQueueConfigDetails } from 'app/models/gateway-model';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { AuthenticationDetails } from 'app/models/authentication-details';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { BayQueueConfigService } from 'app/services/bay-queue-config.service';
import { fuseAnimations } from '@fuse/animations';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { Guid } from 'guid-typescript';

@Component({
    selector: 'app-bay-queue-configuration-content',
    templateUrl: './bay-queue-configuration-content.component.html',
    styleUrls: ['./bay-queue-configuration-content.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class BayQueueConfigurationContentComponent implements OnInit, OnChanges {
    @Input() currentSelectedConfiguration: BayQueueConfigDetails;
    @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
    @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();

    bayQConfigData: BayQueueConfigDetails;
    configuration: BayQueueConfigDetails;
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
        this.bayQConfigData = new BayQueueConfigDetails();
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
        this.getAllBayGrp(this.authenticationDetails.userID);
        this.getAllBays(this.authenticationDetails.userID);
        this.getAllBayType(this.authenticationDetails.userID);
        this.getAllBayPlant();
    }

    ngOnChanges(changes: SimpleChanges): void {
        //console.log(this.currentSelectedConfiguration);
        this.bayQConfigData = this.currentSelectedConfiguration;
        if (this.bayQConfigData) {
            this.allBayName.push(this.bayQConfigData.BAY_NAME);
            this.bayQConfigForm.setValue({
                BAY_GROUP: this.bayQConfigData.BAY_GROUP,
                BAY_NAME: this.bayQConfigData.BAY_NAME,
                BAY_TYPE: this.bayQConfigData.BAY_TYPE,
                PLANT: this.bayQConfigData.PLANT,
                NO_OF_TRUCKS: this.bayQConfigData.NO_OF_TRUCKS
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

    getAllBayGrp(ID: Guid): void {
        this._bayQService.getAllBayGroup(ID).subscribe((result: string[]) => {
            this.allBayGrp = result;
        });
    }

    getAllBays(ID: Guid): void {
        this._bayQService.getAllBays(ID).subscribe((result: string[]) => {
            this.allBayName = result;
        });
    }

    getThisBayName(bayGrp: string, ID: Guid): void {
        this._bayQService.getBayNameByGrp(bayGrp, ID).subscribe((result: string[]) => {
            this.allBayName = result;
        });
    }

    getThisBayType(bayName: string, ID: Guid): void {
        this._bayQService.getBayTypeByBayName(bayName, ID).subscribe((result: string[]) => {
            this.allBayType = result;
        });
    }


    getAllBayType(ID: Guid): void {
        this._bayQService.getAllBayType(ID).subscribe((result: string[]) => {
            this.allBayType = result;
        });
    }

    getAllBayPlant(): void {
        this._bayQService.getAllBayPlant().subscribe((result: string[]) => {
            this.allPlantsData = result;
        });
    }

    OnGrpChanged(value): void {
        this.getThisBayName(value, this.authenticationDetails.userID);
    }

    OnBayNameChanged(value): void {
        this.getThisBayType(value, this.authenticationDetails.userID);
    }

    OnBayTypeChanged(value): void {
        this.AssignNumberTrucks(value);
    }

    AssignNumberTrucks(bayType: string) {
        console.log(bayType);
        if (bayType == 'Only one vehicle') {
            //this.bayQConfigForm.controls['NO_OF_TRUCKS'].setValue('1');
            this.No_TrucksData = ['1'];
        }
        else if (bayType == 'Stand by multiple') {
            //this.bayQConfigForm.controls['NO_OF_TRUCKS'].setValue('1');
            this.No_TrucksData = ['1'];
        }
        else {
            this.No_TrucksData = ['1', '2', '3'];
        }
    }

    SaveClicked(action: string): void {
        this.bayQConfigData = new BayQueueConfigDetails();
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

    CreateConfig(data: BayQueueConfigDetails): void {
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

    UpdateConfig(data: BayQueueConfigDetails): void {
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

    DeleteConfig(data: BayQueueConfigDetails): void {
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
