import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MenuApp } from 'app/models/menu-app';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { AuthenticationDetails } from 'app/models/user-details';
import { GPSTrackingService } from 'app/services/gpstracking.service';
import { GPSTrackingObj } from 'app/models/GatewayModel';

@Component({
  selector: 'app-gpstracking-right-bar',
  templateUrl: './gpstracking-right-bar.component.html',
  styleUrls: ['./gpstracking-right-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class GPSTrackingRightBarComponent implements OnInit, OnChanges {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  @Input() currentSelectedRole: GPSTrackingObj = new GPSTrackingObj();
  @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
  @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();
  role: GPSTrackingObj;
  roleMainFormGroup: FormGroup;
  AllMenuApps: MenuApp[] = [];
  AppIDListAllID: number;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  authenticationDetails: AuthenticationDetails;
  constructor(
    private _masterService: GPSTrackingService,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar) {
    this.roleMainFormGroup = this._formBuilder.group({
      TRUCK_ID: ['', Validators.required],
      LAT: ['', Validators.required],
      LON: ['', Validators.required],
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.AppIDListAllID = 0;
    this.role = new GPSTrackingObj();
    this.authenticationDetails = new AuthenticationDetails();
  }

  // GetAllMenuApps(): void {
  //   this._masterService.GetAllMenuApp().subscribe(
  //     (data) => {
  //       this.AllMenuApps = <MenuApp[]>data;
  //       if (this.AllMenuApps && this.AllMenuApps.length > 0) {
  //         const xy = this.AllMenuApps.filter(x => x.AppName === 'All')[0];
  //         if (xy) {
  //           this.AppIDListAllID = xy.AppID;
  //         }
  //       }
  //       // console.log(this.AllMenuApps);
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

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
    this.role = new GPSTrackingObj();
    this.roleMainFormGroup.reset();
    Object.keys(this.roleMainFormGroup.controls).forEach(key => {
      this.roleMainFormGroup.get(key).markAsUntouched();
    });
  }

  // SaveClicked(): void {
  //   if (this.roleMainFormGroup.valid) {
  //     this.ShowProgressBarEvent.emit('show');
  //     if (this.role.RoleID) {
  //       this.role.RoleName = this.roleMainFormGroup.get('roleName').value;
  //       this.role.AppIDList = <number[]>this.roleMainFormGroup.get('appIDList').value;
  //       this.role.ModifiedBy = this.authenticationDetails.userID.toString();

  //       this._masterService.UpdateRole(this.role).subscribe(
  //         (data) => {
  //           // console.log(data);
  //           this.ResetControl();
  //           this.notificationSnackBarComponent.openSnackBar('Role updated successfully', SnackBarStatus.success);
  //           this.SaveSucceed.emit('success');
  //           this._masterService.TriggerNotification('Role updated successfully');
  //         },
  //         (err) => {
  //           console.error(err);
  //           this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //           this.ShowProgressBarEvent.emit('hide');
  //         }
  //       );
  //     } else {
  //       this.role.RoleName = this.roleMainFormGroup.get('roleName').value;
  //       this.role.AppIDList = this.roleMainFormGroup.get('appIDList').value;
  //       this.role.CreatedBy = this.authenticationDetails.userID.toString();
  //       this._masterService.CreateRole(this.role).subscribe(
  //         (data) => {
  //           // console.log(data);
  //           this.ResetControl();
  //           this.notificationSnackBarComponent.openSnackBar('Role created successfully', SnackBarStatus.success);
  //           this.SaveSucceed.emit('success');
  //           this._masterService.TriggerNotification('Role created successfully');
  //         },
  //         (err) => {
  //           console.error(err);
  //           this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //           this.ShowProgressBarEvent.emit('hide');
  //         }
  //       );
  //     }


  //   } else {
  //     Object.keys(this.roleMainFormGroup.controls).forEach(key => {
  //       this.roleMainFormGroup.get(key).markAsDirty();
  //     });
  //   }
  // }


  ngOnChanges(changes: SimpleChanges): void {
  console.log(this.currentSelectedRole);
   this.role = this.currentSelectedRole;
 
    if (this.role) {
      this.roleMainFormGroup.get('TRUCK_ID').patchValue(this.role.TRUCK_ID);
      this.roleMainFormGroup.get('LAT').patchValue(this.role.LAT);
      this.roleMainFormGroup.get('LON').patchValue(this.role.LON);
      const mapProp = {
        center: new google.maps.LatLng(Number(this.role.LAT), Number(this.role.LON) ),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    } else {
      // this.roleMainFormGroup.get('appName').patchValue('');
      this.ResetControl();
    }
  }

  // OnAppNameChanged(): void {
  //   // console.log('changed');
  //   const SelectedValues = this.roleMainFormGroup.get('appIDList').value as number[];
  //   if (SelectedValues.includes(this.AppIDListAllID)) {
  //     this.roleMainFormGroup.get('appIDList').patchValue([this.AppIDListAllID]);
  //     this.notificationSnackBarComponent.openSnackBar('All have all the menu items, please uncheck All if you want to select specific menu', SnackBarStatus.info, 4000);

  //   }
  //   console.log(this.roleMainFormGroup.get('appIDList').value);
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
