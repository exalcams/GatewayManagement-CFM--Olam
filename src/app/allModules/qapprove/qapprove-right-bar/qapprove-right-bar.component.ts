import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MenuApp } from 'app/models/menu-app';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { AuthenticationDetails } from 'app/models/user-details';
import { QApproveObj } from 'app/models/GatewayModel';
import { GatewayService } from 'app/services/gateway.service';


@Component({
  selector: 'app-qapprove-right-bar',
  templateUrl: './qapprove-right-bar.component.html',
  styleUrls: ['./qapprove-right-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class QApproveRightBarComponent implements OnInit, OnChanges {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  @Input() currentSelectedQApprove: QApproveObj = new QApproveObj();
  @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
  @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();
  QApprove: QApproveObj;
  QApproveMainFormGroup: FormGroup;
  AllMenuApps: MenuApp[] = [];
  AppIDListAllID: number;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  authenticationDetails: AuthenticationDetails;
  constructor(
    private _masterService: GatewayService,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar) {
    this.QApproveMainFormGroup = this._formBuilder.group({
      REQUEST_ID: [''],
      REQUEST_COMMENT: [{ value: '', disabled: true }, Validators.required],
      REQUEST_TYPE: [{ value: '', disabled: true }, Validators.required],
      SELECTED_ITEM: [{ value: '', disabled: true }, Validators.required],
      APPROVE_COMMENT: ['', Validators.required]

      // CreatedOn: ['Date', Validators.required],
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.AppIDListAllID = 0;
    this.QApprove = new QApproveObj();
    this.authenticationDetails = new AuthenticationDetails();
  }

  ngOnInit(): void {
    // Retrive authorizationData
    // const retrievedObject = localStorage.getItem('authorizationData');
    // if (retrievedObject) {
    //   this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    // } else {
    //   // this._router.navigate(['/auth/login']);
    // }
    // this.GetAllMenuApps();
    //  this.ResetControl();
  }

  ResetControl(): void {
    this.QApprove = new QApproveObj();
    this.QApproveMainFormGroup.reset();
    Object.keys(this.QApproveMainFormGroup.controls).forEach(key => {
      this.QApproveMainFormGroup.get(key).markAsUntouched();
    });
  }

  RejectQRequest(): void {
    if (this.QApproveMainFormGroup.valid) {
      this.ShowProgressBarEvent.emit('show');
      if (this.QApprove.REQUEST_ID) {
        // this.QApprove.REQUEST_ID = this.QApproveMainFormGroup.get('REQUEST_ID').value;
        this.QApprove.REQUEST_TYPE = this.QApproveMainFormGroup.get('REQUEST_TYPE').value;
        this.QApprove.SELECTED_ITEM = this.QApproveMainFormGroup.get('SELECTED_ITEM').value;
        this.QApprove.REQUEST_COMMENT = this.QApproveMainFormGroup.get('REQUEST_COMMENT').value;
        this.QApprove.APPROVE_COMMENT = this.QApproveMainFormGroup.get('APPROVE_COMMENT').value;
        this.QApprove.STATUS = 'Rejected';
        // this.QApprove.AppIDList = <number[]>this.QApproveMainFormGroup.get('appIDList').value;
        // this.QApprove.CreatedBy = this.authenticationDetails.userID.toString();

        this._masterService.PutQApprove(this.QApprove).subscribe(
          (data) => {
            // console.log(data);
            this.ResetControl();
            this.notificationSnackBarComponent.openSnackBar('QApprove updated successfully', SnackBarStatus.success);
            this.SaveSucceed.emit('success');
            this._masterService.TriggerNotification('QApprove updated successfully');
          },
          (err) => {
            console.error(err);
            this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            this.ShowProgressBarEvent.emit('hide');
          }
        );
      }
      // else {
      //  // this.QApprove.Id = this.QApproveMainFormGroup.get('Id').value;
      //   this.QApprove.REQUEST_TYPE = this.QApproveMainFormGroup.get('REQUEST_TYPE').value;
      //   this.QApprove.SELECTED_ITEM = this.QApproveMainFormGroup.get('SELECTED_ITEM').value;
      //   this.QApprove.REQUEST_COMMENT = this.QApproveMainFormGroup.get('REQUEST_COMMENT').value;
      //   this.QApprove.APPROVE_COMMENT = this.QApproveMainFormGroup.get('APPROVE_COMMENT').value;
      //   // this.QApprove.CreatedBy = this.authenticationDetails.userID.toString();
      //   this._masterService.PostQApprove(this.QApprove).subscribe(
      //     (data) => {
      //       // console.log(data);
      //       this.ResetControl();
      //       this.notificationSnackBarComponent.openSnackBar('QApprove created successfully', SnackBarStatus.success);
      //       this.SaveSucceed.emit('success');
      //       this._masterService.TriggerNotification('QApprove created successfully');
      //     },
      //     (err) => {
      //       console.error(err);
      //       this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      //       this.ShowProgressBarEvent.emit('hide');
      //     }
      //   );
      // }


    } else {
      Object.keys(this.QApproveMainFormGroup.controls).forEach(key => {
        this.QApproveMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  AcceptQRequest(): void {
    if (this.QApproveMainFormGroup.valid) {
      this.ShowProgressBarEvent.emit('show');
      if (this.QApprove.REQUEST_ID) {
        // this.QApprove.REQUEST_ID = this.QApproveMainFormGroup.get('REQUEST_ID').value;
        this.QApprove.REQUEST_TYPE = this.QApproveMainFormGroup.get('REQUEST_TYPE').value;
        this.QApprove.SELECTED_ITEM = this.QApproveMainFormGroup.get('SELECTED_ITEM').value;
        this.QApprove.REQUEST_COMMENT = this.QApproveMainFormGroup.get('REQUEST_COMMENT').value;
        this.QApprove.APPROVE_COMMENT = this.QApproveMainFormGroup.get('APPROVE_COMMENT').value;
        this.QApprove.STATUS = 'Approved';
        // this.QApprove.AppIDList = <number[]>this.QApproveMainFormGroup.get('appIDList').value;
        // this.QApprove.CreatedBy = this.authenticationDetails.userID.toString();

        this._masterService.PutQApprove(this.QApprove).subscribe(
          (data) => {
            // console.log(data);
            this.ResetControl();
            this.notificationSnackBarComponent.openSnackBar('QApprove updated successfully', SnackBarStatus.success);
            this.SaveSucceed.emit('success');
            this._masterService.TriggerNotification('QApprove updated successfully');
          },
          (err) => {
            console.error(err);
            this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            this.ShowProgressBarEvent.emit('hide');
          }
        );
      }
      // else {
      //  // this.QApprove.Id = this.QApproveMainFormGroup.get('Id').value;
      //   this.QApprove.REQUEST_TYPE = this.QApproveMainFormGroup.get('REQUEST_TYPE').value;
      //   this.QApprove.SELECTED_ITEM = this.QApproveMainFormGroup.get('SELECTED_ITEM').value;
      //   this.QApprove.REQUEST_COMMENT = this.QApproveMainFormGroup.get('REQUEST_COMMENT').value;
      //   this.QApprove.APPROVE_COMMENT = this.QApproveMainFormGroup.get('APPROVE_COMMENT').value;
      //   // this.QApprove.CreatedBy = this.authenticationDetails.userID.toString();
      //   this._masterService.PostQApprove(this.QApprove).subscribe(
      //     (data) => {
      //       // console.log(data);
      //       this.ResetControl();
      //       this.notificationSnackBarComponent.openSnackBar('QApprove created successfully', SnackBarStatus.success);
      //       this.SaveSucceed.emit('success');
      //       this._masterService.TriggerNotification('QApprove created successfully');
      //     },
      //     (err) => {
      //       console.error(err);
      //       this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      //       this.ShowProgressBarEvent.emit('hide');
      //     }
      //   );
      // }


    } else {
      Object.keys(this.QApproveMainFormGroup.controls).forEach(key => {
        this.QApproveMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedQApprove);
    this.QApprove = this.currentSelectedQApprove;

    if (this.QApprove) {
      // this.QApproveMainFormGroup.get('Id').patchValue(this.QApprove.Id);
      this.QApproveMainFormGroup.get('REQUEST_TYPE').patchValue(this.QApprove.REQUEST_TYPE);
      this.QApproveMainFormGroup.get('SELECTED_ITEM').patchValue(this.QApprove.SELECTED_ITEM);
      this.QApproveMainFormGroup.get('REQUEST_COMMENT').patchValue(this.QApprove.REQUEST_COMMENT);
      this.QApproveMainFormGroup.get('APPROVE_COMMENT').patchValue(this.QApprove.APPROVE_COMMENT);
      // this.QApproveMainFormGroup.get('CreatedOn').patchValue(this.QApprove.CreatedOn);
      // const mapProp = {
      //   center: new google.maps.LatLng(Number(this.role.LAT), Number(this.role.LON) ),
      //   zoom: 15,
      //   mapREQUEST_TYPEId: google.maps.MapREQUEST_TYPEId.ROADMAP
      // };
      // this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    } else {
      // this.QApproveMainFormGroup.get('appName').patchValue('');
      this.ResetControl();
    }
  }

  // OnAppNameChanged(): void {
  //   // console.log('changed');
  //   const SelectedValues = this.QApproveMainFormGroup.get('appIDList').value as number[];
  //   if (SelectedValues.includes(this.AppIDListAllID)) {
  //     this.QApproveMainFormGroup.get('appIDList').patchValue([this.AppIDListAllID]);
  //     this.notificationSnackBarComponent.openSnackBar('All have all the menu items, please uncheck All if you want to select specific menu', SnackBarStatus.info, 4000);

  //   }
  //   console.log(this.QApproveMainFormGroup.get('appIDList').value);
  // }

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
