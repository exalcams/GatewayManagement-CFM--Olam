import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MenuApp } from 'app/models/menu-app';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { AuthenticationDetails } from 'app/models/user-details';
import { ConfigurationDetails, StationConfigurationDetails } from 'app/models/gateway-model';
import { ConfigurationService } from 'app/services/configuration.service';
import { Guid } from 'guid-typescript';

@Component({
    selector: 'app-configuration-right-bar',
    templateUrl: './configuration-right-bar.component.html',
    styleUrls: ['./configuration-right-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ConfigurationRightBarComponent implements OnInit, OnChanges {
    @ViewChild('gmap') gmapElement: any;
    map: google.maps.Map;

    @Input() currentSelectedConfiguration: ConfigurationDetails = new ConfigurationDetails();
    @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
    @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();
    configuration: ConfigurationDetails;
    configurationMainFormGroup: FormGroup;
    AllMenuApps: MenuApp[] = [];
    isLoading: boolean;
    IsProgressBarVisibile: boolean;
    AllStationOptions: StationConfigurationDetails[] = [];
    // AllStationOptions = ['A1FLOUR', 'A2FLOUR', 'D1FLOUR', 'D2FLOUR', 'B1FLOUR', 'B2FLOUR', 'C1FLOUR', 'C2FLOUR', 'E1FLOUR', 'E2FLOUR', 'S1FLOUR', 'S2FLOUR', 'A1BRAN', 'B1BRAN','B0BRAN', 'W1', 'W2', 'W3', 'P1','P2','ULB'];
    AllTypeOptions = [
        {
            'key': 'L',
            'value': 'Loading'
        },
        {
            'key': 'UL',
            'value': 'UnLoading'
        },
        {
            'key': 'W',
            'value': 'Weighment'
        },
        {
            'key': 'P',
            'value': 'Parking'
        },
        {
            'key': 'O',
            'value': 'Others'
        }
    ];
    notificationSnackBarComponent: NotificationSnackBarComponent;
    authenticationDetails: AuthenticationDetails;
    constructor(private _configurationService: ConfigurationService, private _formBuilder: FormBuilder, public snackBar: MatSnackBar) {
        this.configurationMainFormGroup = this._formBuilder.group({
            ID: [''],
            TYPE: ['', Validators.required],
            STATION: ['', Validators.required],
            ENTRY_ID: ['', Validators.required],
            EXIT_ID: [''],
            PLANT: ['', Validators.required]
            // CreatedOn: ['Date', Validators.required],
        });
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
        this.configuration = new ConfigurationDetails();
        this.authenticationDetails = new AuthenticationDetails();
        this.isLoading = true;
        this.IsProgressBarVisibile = true;
    }

    ngOnInit(): void {
        // Retrive authorizationData
        const retrievedObject = localStorage.getItem('authorizationData');
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
        } else {
            // this._router.navigate(['/auth/login']);
        }
        this.GetAllStationConfigurations();
        //  this.ResetControl();
    }

    ResetControl(): void {
        this.configuration = new ConfigurationDetails();
        this.configurationMainFormGroup.reset();
        Object.keys(this.configurationMainFormGroup.controls).forEach(key => {
            this.configurationMainFormGroup.get(key).markAsUntouched();
        });
    }

    SaveClicked(): void {
        if (this.configurationMainFormGroup.valid) {
            this.ShowProgressBarEvent.emit('show');
            if (this.configuration.ID) {
                // this.configuration.Id = this.configurationMainFormGroup.get('Id').value;
                this.configuration.TYPE = this.configurationMainFormGroup.get('TYPE').value;
                this.configuration.STATION = this.configurationMainFormGroup.get('STATION').value;
                this.configuration.ENTRY_ID = this.configurationMainFormGroup.get('ENTRY_ID').value;
                this.configuration.EXIT_ID = this.configurationMainFormGroup.get('EXIT_ID').value;
                this.configuration.PLANT = this.configurationMainFormGroup.get('PLANT').value;
                // this.configuration.AppIDList = <number[]>this.configurationMainFormGroup.get('appIDList').value;
                // this.configuration.CreatedBy = this.authenticationDetails.userID.toString();

                this._configurationService.PutConfiguration(this.configuration).subscribe(
                    data => {
                        // console.log(data);
                        this.ResetControl();
                        this.notificationSnackBarComponent.openSnackBar('Configuration updated successfully', SnackBarStatus.success);
                        this.SaveSucceed.emit('success');
                        this._configurationService.TriggerNotification('Configuration updated successfully');
                    },
                    err => {
                        console.error(err);
                        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                        this.ShowProgressBarEvent.emit('hide');
                    }
                );
            } else {
                // this.configuration.Id = this.configurationMainFormGroup.get('Id').value;
                this.configuration.TYPE = this.configurationMainFormGroup.get('TYPE').value;
                this.configuration.STATION = this.configurationMainFormGroup.get('STATION').value;
                this.configuration.ENTRY_ID = this.configurationMainFormGroup.get('ENTRY_ID').value;
                this.configuration.EXIT_ID = this.configurationMainFormGroup.get('EXIT_ID').value;
                this.configuration.PLANT = this.configurationMainFormGroup.get('PLANT').value;
                // this.configuration.CreatedBy = this.authenticationDetails.userID.toString();
                this._configurationService.PostConfiguration(this.configuration).subscribe(
                    data => {
                        // console.log(data);
                        this.ResetControl();
                        this.notificationSnackBarComponent.openSnackBar('Configuration created successfully', SnackBarStatus.success);
                        this.SaveSucceed.emit('success');
                        this._configurationService.TriggerNotification('Configuration created successfully');
                    },
                    err => {
                        // console.error(err);
                        console.log(err.error);
                        this.notificationSnackBarComponent.openSnackBar(
                            err.error instanceof Object ? 'Something went wrong because ' + err.error : err.error,
                            SnackBarStatus.danger
                        );
                        this.ShowProgressBarEvent.emit('hide');
                    }
                );
            }
        } else {
            Object.keys(this.configurationMainFormGroup.controls).forEach(key => {
                this.configurationMainFormGroup.get(key).markAsDirty();
            });
        }
    }

    OnTypeChanged(): void {
        const SelectedValues = this.configurationMainFormGroup.get('TYPE').value as string;
        if (SelectedValues) {
            if (SelectedValues === 'W') {
                this.isLoading = true;
                this.GetStationConfigurationsBasedOnType(SelectedValues);
                // this.AllStationOptions = ['W1', 'W2', 'W3'];
            } else if (SelectedValues === 'L') {
                this.isLoading = false;
                this.GetStationConfigurationsBasedOnType(SelectedValues);
                // tslint:disable-next-line:max-line-length
                // this.AllStationOptions = ['A1FLOUR', 'A2FLOUR', 'D1FLOUR', 'D2FLOUR', 'B1FLOUR', 'B2FLOUR', 'C1FLOUR', 'C2FLOUR', 'E1FLOUR', 'E2FLOUR', 'S1FLOUR', 'S2FLOUR', 'A1BRAN', 'B1BRAN', 'B0BRAN'];
            } else if (SelectedValues === 'UL') {
                this.isLoading = true;
                this.GetStationConfigurationsBasedOnType(SelectedValues);
                // this.AllStationOptions = ['ULB'];
            } else if (SelectedValues === 'P') {
                this.isLoading = true;
                this.GetStationConfigurationsBasedOnType(SelectedValues);
                // this.AllStationOptions = ['P1', 'P2'];
            }
            else if (SelectedValues === 'O') {
                this.isLoading = true;
                this.GetStationConfigurationsBasedOnType(SelectedValues);
                // this.AllStationOptions = ['P1', 'P2'];
            }
        } else {
        }
    }

    GetAllStationConfigurations(): void {
        this._configurationService.GetAllStationConfigurations(this.authenticationDetails.userID).subscribe(
            data => {
                this.AllStationOptions = data as StationConfigurationDetails[];
                // this.parkingCount = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'PENTRY').length;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            }
        );
    }

    GetStationConfigurationsBasedOnType(Type: string): void {
        this._configurationService.GetStationConfigurationsBasedOnType(this.authenticationDetails.userID, Type).subscribe(
            data => {
                this.AllStationOptions = data as StationConfigurationDetails[];
                // this.parkingCount = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'PENTRY').length;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            }
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        //console.log(this.currentSelectedConfiguration);
        this.configuration = this.currentSelectedConfiguration;

        if (this.configuration) {
            // this.configurationMainFormGroup.get('Id').patchValue(this.configuration.Id);
            this.configurationMainFormGroup.get('TYPE').patchValue(this.configuration.TYPE);
            this.configurationMainFormGroup.get('STATION').patchValue(this.configuration.STATION);
            this.configurationMainFormGroup.get('ENTRY_ID').patchValue(this.configuration.ENTRY_ID);
            this.configurationMainFormGroup.get('EXIT_ID').patchValue(this.configuration.EXIT_ID);
            this.configurationMainFormGroup.get('PLANT').patchValue(this.configuration.PLANT);
            // this.configurationMainFormGroup.get('CreatedOn').patchValue(this.configuration.CreatedOn);
            // const mapProp = {
            //   center: new google.maps.LatLng(Number(this.role.LAT), Number(this.role.LON) ),
            //   zoom: 15,
            //   mapTYPEId: google.maps.MapEXIT_IDId.ROADMAP
            // };
            // this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
            if (this.configuration.EXIT_ID && this.configuration.EXIT_ID !== 'null') {
                this.isLoading = true;
            } else {
                this.isLoading = false;
            }
        } else {
            // this.configurationMainFormGroup.get('appName').patchValue('');
            this.ResetControl();
            this.isLoading = true;
        }
    }
}

// function multiSelectRequired(control: AbstractControl): { [key: string]: any } | null {
//   const email: string[] = control.value;
//   if (email) {
//     if (email.length > 0) {
//       return null;
//     } else {
//       return { 'multiSelectRequired': true };
//     }
//   } else {
//     return { 'multiSelectRequired': true };
//   }

//   // const domain = email.substring(email.lastIndexOf('@') + 1);
//   // if (email === '' || domain.toLowerCase() === 'pragimtech.com') {
//   //   return null;
//   // } else {
//   //   return { 'emailDomain': true };
//   // }
// }
