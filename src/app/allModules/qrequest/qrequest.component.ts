import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MenuApp } from 'app/models/menu-app';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { AuthenticationDetails } from 'app/models/user-details';
import { QRequestDetails } from 'app/models/gateway-model';
import { QueueStackService } from 'app/services/queue-stack.service';

@Component({
  selector: 'app-qrequest',
  templateUrl: './qrequest.component.html',
  styleUrls: ['./qrequest.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class QRequestComponent implements OnInit, OnChanges {

  @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
  @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();
  QRequest: QRequestDetails;
  QRequestMainFormGroup: FormGroup;
  AllMenuApps: MenuApp[] = [];
  AppIDListAllID: number;
  // AllQRequestOptions: string[] = new Array('Vendor', 'Vehicle No'); 
  AllQRequestOptions: any;
  AllVendorsOrVehicleNos: any;

  notificationSnackBarComponent: NotificationSnackBarComponent;
  authenticationDetails: AuthenticationDetails;
  constructor(
    private _queueStackService: QueueStackService,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar) {
    this.QRequestMainFormGroup = this._formBuilder.group({
      REQUEST_ID: [''],
      REQUEST_COMMENT: ['', Validators.required],
      REQUEST_TYPE: ['', Validators.required],
      SELECTED_ITEM: ['', Validators.required]
      // CreatedOn: ['Date', Validators.required],
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.AppIDListAllID = 0;
    this.QRequest = new QRequestDetails();
    this.authenticationDetails = new AuthenticationDetails();
  }

  ngOnInit(): void {
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    }
    //  else {
    //   // this._router.navigate(['/auth/login']);
    // }
    this.GetAllVendors();
    //  this.ResetControl();
  }

  ResetControl(): void {
    this.QRequest = new QRequestDetails();
    this.QRequestMainFormGroup.reset();
    Object.keys(this.QRequestMainFormGroup.controls).forEach(key => {
      this.QRequestMainFormGroup.get(key).markAsUntouched();
    });
  }

  SaveClicked(): void {
    if (this.QRequestMainFormGroup.valid) {
      this.ShowProgressBarEvent.emit('show');
      if (this.QRequest.REQUEST_ID) {
        // this.QRequest.REQUEST_ID = this.QRequestMainFormGroup.get('REQUEST_ID').value;
        // this.QRequest.Type = this.QRequestMainFormGroup.get('Type').value;       
        this.QRequest.REQUEST_COMMENT = this.QRequestMainFormGroup.get('REQUEST_COMMENT').value;
        this.QRequest.REQUEST_TYPE = this.QRequestMainFormGroup.get('REQUEST_TYPE').value;
        this.QRequest.SELECTED_ITEM = this.QRequestMainFormGroup.get('SELECTED_ITEM').value;
        this.QRequest.USER = this.authenticationDetails.userID.toString();
        // this.QRequest.AppIDList = <number[]>this.QRequestMainFormGroup.get('appIDList').value;
        // this.QRequest.CreatedBy = this.authenticationDetails.userID.toString();

        this._queueStackService.PutQRequest(this.QRequest).subscribe(
          (data) => {
            // console.log(data);
            this.ResetControl();
            this.notificationSnackBarComponent.openSnackBar('QRequest updated successfully', SnackBarStatus.success);
            this.SaveSucceed.emit('success');
            this._queueStackService.TriggerNotification('QRequest updated successfully');
          },
          (err) => {
            console.error(err);
            this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            this.ShowProgressBarEvent.emit('hide');
          }
        );
      } else {
        // this.QRequest.REQUEST_ID = this.QRequestMainFormGroup.get('REQUEST_ID').value;
        // this.QRequest.Type = this.QRequestMainFormGroup.get('Type').value;
        this.QRequest.REQUEST_COMMENT = this.QRequestMainFormGroup.get('REQUEST_COMMENT').value;
        this.QRequest.REQUEST_TYPE = this.QRequestMainFormGroup.get('REQUEST_TYPE').value;
        this.QRequest.SELECTED_ITEM = this.QRequestMainFormGroup.get('SELECTED_ITEM').value;
        this.QRequest.USER = this.authenticationDetails.userID.toString();
        this._queueStackService.PostQRequest(this.QRequest).subscribe(
          (data) => {
            // console.log(data);
            this.ResetControl();
            this.notificationSnackBarComponent.openSnackBar('QRequest created successfully', SnackBarStatus.success);
            this.SaveSucceed.emit('success');
            this._queueStackService.TriggerNotification('QRequest created successfully');
          },
          (err) => {
            console.error(err);
            this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            this.ShowProgressBarEvent.emit('hide');
          }
        );
      }


    } else {
      Object.keys(this.QRequestMainFormGroup.controls).forEach(key => {
        this.QRequestMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedQRequest);
    //  this.QRequest = this.currentSelectedQRequest;

    if (this.QRequest) {
      // this.QRequestMainFormGroup.get('REQUEST_ID').patchValue(this.QRequest.REQUEST_ID);
      // this.QRequestMainFormGroup.get('Type').patchValue(this.QRequest.Type);
      this.QRequestMainFormGroup.get('REQUEST_COMMENT').patchValue(this.QRequest.REQUEST_COMMENT);
      this.QRequestMainFormGroup.get('REQUEST_TYPE').patchValue(this.QRequest.REQUEST_TYPE);
      this.QRequestMainFormGroup.get('SELECTED_ITEM').patchValue(this.QRequest.SELECTED_ITEM);
      // this.QRequestMainFormGroup.get('CreatedOn').patchValue(this.QRequest.CreatedOn);
      // const mapProp = {
      //   center: new google.maps.LatLng(Number(this.role.LAT), Number(this.role.LON) ),
      //   zoom: 15,
      //   mapTypeId: google.maps.MapTypeId.ROADMAP
      // };
      // this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    } else {
      // this.QRequestMainFormGroup.get('appName').patchValue('');
      this.ResetControl();
    }
  }

  OnRequestTypeChanged(): void {
    // console.log('changed' + value);
    const SelectedValues = this.QRequestMainFormGroup.get('REQUEST_TYPE').value as string;
    if (SelectedValues) {
      this._queueStackService.GetAllVendorsOrVehicleNos(SelectedValues, this.authenticationDetails.userID).subscribe(
        (data) => {
          this.AllVendorsOrVehicleNos = <any[]>data;
          if (this.AllVendorsOrVehicleNos && this.AllVendorsOrVehicleNos.length > 0) {
            // const xy = this.AllVendorsOrVehicleNos.filter(x => x.AppName === 'All')[0];
            // if (xy) {
            //   this.AppIDListAllID = xy.AppID;
            // }
          }
          // console.log(this.AllVendorsOrVehicleNos);
        },
        (err) => {
          console.log(err);
        }
      );
    }
    else {
      this._queueStackService.GetAllVendorsOrVehicleNos(SelectedValues, this.authenticationDetails.userID).subscribe(
        (data) => {
          this.AllVendorsOrVehicleNos = <any[]>data;
          if (this.AllVendorsOrVehicleNos && this.AllVendorsOrVehicleNos.length > 0) {
            // const xy = this.AllVendorsOrVehicleNos.filter(x => x.AppName === 'All')[0];
            // if (xy) {
            //   this.AppIDListAllID = xy.AppID;
            // }
          }
          // console.log(this.AllVendorsOrVehicleNos);
        },
        (err) => {
          console.log(err);
        }
      );
    }
    // if (SelectedValues.includes(this.AppIDListAllID)) {
    //   this.QRequestMainFormGroup.get('appIDList').patchValue([this.AppIDListAllID]);
    //   this.notificationSnackBarComponent.openSnackBar('All have all the menu items, please uncheck All if you want to select specific menu', SnackBarStatus.info, 4000);

    // }
    // console.log(this.QRequestMainFormGroup.get('appIDList').value);
  }

  GetAllVendors(): void {
    this._queueStackService.GetAllVendors(this.authenticationDetails.userID).subscribe(
      (data) => {
        const v = <any[]>data;
        const filtered = v.filter(x => x !== '');
        filtered.push('Others');
        this.AllQRequestOptions = new Set(filtered);
        // this.AllQRequestOptions  = this.filter_array(this.AllQRequestOptions);
        // tslint:disable-next-line:typedef
        if (this.AllQRequestOptions && this.AllQRequestOptions.length > 0) {
          // const xy = this.AllVendorsOrVehicleNos.filter(x => x.AppName === 'All')[0];
          // if (xy) {
          //   this.AppIDListAllID = xy.AppID;
          // }
        }
        // console.log(this.AllVendorsOrVehicleNos);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  filter_array(test_array): any {
    let index = -1;
    const arr_length = test_array ? test_array.length : 0;
    let resIndex = -1;
    const result = [];

    while (++index < arr_length) {
      const value = test_array[index];

      if (value) {
        result[++resIndex] = value;
      }
    }

    return result;
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
