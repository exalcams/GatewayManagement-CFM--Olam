import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { GPSTrackingService } from 'app/services/gpstracking.service';
import { GPSTrackingObj } from 'app/models/GatewayModel';

@Component({
  selector: 'app-gpstracking',
  templateUrl: './gpstracking.component.html',
  styleUrls: ['./gpstracking.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class GPSTrackingComponent implements OnInit {

  AllRoles: GPSTrackingObj[] = [];
  SelectedRole: GPSTrackingObj;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  constructor(private _masterService: GPSTrackingService, private _router: Router, public snackBar: MatSnackBar) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = true;
  }

  ngOnInit(): void {
      this.GetAllRoles();
  }
  GetAllRoles(): void {
    this._masterService.GetAllRoles().subscribe(
      (data) => {
        this.AllRoles = <GPSTrackingObj[]>data;
        this.IsProgressBarVisibile = false;
        // console.log(this.AllMenuApps);
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }
  OnRoleSelectionChanged(selectedRole: GPSTrackingObj): void {
    // console.log(selectedMenuApp);
    this.SelectedRole = selectedRole;
  }

  OnShowProgressBarEvent(status: string): void {
    if (status === 'show') {
      this.IsProgressBarVisibile = true;
    } else {
      this.IsProgressBarVisibile = false;
    }

  }

  RefreshAllRoles(msg: string): void {
    // console.log(msg);
    this.GetAllRoles();
  }

}
