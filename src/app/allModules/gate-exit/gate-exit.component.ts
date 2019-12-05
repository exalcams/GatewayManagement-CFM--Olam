import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { AuthenticationDetails } from 'app/models/user-details';
import { GateExitDetails } from 'app/models/gate-exit';
import { GateExitService } from 'app/services/gate-exit.service';

@Component({
  selector: 'app-gate-exit',
  templateUrl: './gate-exit.component.html',
  styleUrls: ['./gate-exit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class GateExitComponent implements OnInit, OnChanges {

  @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
  @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();
  GateExit: GateExitDetails;
  GateExitMainFormGroup: FormGroup;
  IsProgressBarVisibile: boolean;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  authenticationDetails: AuthenticationDetails;
  constructor(
    private _gateExistService: GateExitService,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar) {
    this.GateExitMainFormGroup = this._formBuilder.group({
      VEHICLE_NO: ['', Validators.required],
      TRUCK_ID: ['', Validators.required],
      //STATUS: ['', Validators.required],
      REASON_GEXIT: ['', Validators.required]

    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.GateExit = new GateExitDetails();
    this.IsProgressBarVisibile = false;
    this.authenticationDetails = new AuthenticationDetails();
  }

  ngOnInit(): void {
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    }
  }

  ResetControl(): void {
    this.GateExit = new GateExitDetails();
    this.GateExitMainFormGroup.reset();
    Object.keys(this.GateExitMainFormGroup.controls).forEach(key => {
      this.GateExitMainFormGroup.get(key).markAsUntouched();
    });
  }

  SaveClicked(): void {
    this.IsProgressBarVisibile = true;
    if (this.GateExitMainFormGroup.valid) {
      this.ShowProgressBarEvent.emit('show');
      this.GateExit.VEHICLE_NO = this.GateExitMainFormGroup.get('VEHICLE_NO').value;
      this.GateExit.TRUCK_ID = this.GateExitMainFormGroup.get('TRUCK_ID').value;
      //this.GateExit.STATUS = this.GateExitMainFormGroup.get('STATUS').value;
      this.GateExit.REASON_GEXIT = this.GateExitMainFormGroup.get('REASON_GEXIT').value;
      this.GateExit.USER_ID = this.authenticationDetails.userID;

      this._gateExistService.ManualGateExit(this.GateExit).subscribe(
        (data) => {
          this.ResetControl();
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar('Gate Exit done successfully', SnackBarStatus.success);
          this.SaveSucceed.emit('success');
          this._gateExistService.TriggerNotification('Gate Exit done successfully');
        },
        (err) => {
          console.error(err);
          this.ResetControl();
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? err.error ? err.error : 'Something went wrong' : err, SnackBarStatus.danger);
          this.ShowProgressBarEvent.emit('hide');
        }
      );
    } else {
      Object.keys(this.GateExitMainFormGroup.controls).forEach(key => {
        this.GateExitMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.GateExit) {
      this.GateExitMainFormGroup.get('VEHICLE_NO').patchValue(this.GateExit.VEHICLE_NO);
      this.GateExitMainFormGroup.get('TRUCK_ID').patchValue(this.GateExit.TRUCK_ID);
      //this.GateExitMainFormGroup.get('STATUS').patchValue(this.GateExit.STATUS);
      this.GateExitMainFormGroup.get('REASON_GEXIT').patchValue(this.GateExit.REASON_GEXIT);
      this.GateExitMainFormGroup.get('USER_ID').patchValue(this.GateExit.USER_ID);
    } else {
      this.ResetControl();
    }
  }

}
