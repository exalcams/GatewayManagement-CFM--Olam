import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { QApproveObj } from 'app/models/GatewayModel';
import { GatewayService } from 'app/services/gateway.service';
import { AuthenticationDetails } from 'app/models/authentication_details';

@Component({
  selector: 'app-qapprove',
  templateUrl: './qapprove.component.html',
  styleUrls: ['./qapprove.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class QApproveComponent implements OnInit {

  AllQApproves: QApproveObj[] = [];
  SelectedQApprove: QApproveObj;
  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  constructor(private _masterService: GatewayService, private _router: Router, public snackBar: MatSnackBar) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = true;
  }

  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    }
      this.GetAllQApproves();
  }
  GetAllQApproves(): void {
    this._masterService.GetAllQApproves(this.authenticationDetails.userID).subscribe(
      (data) => {
        this.AllQApproves = <QApproveObj[]>data;
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
  OnQApproveSelectionChanged(selectedQApprove: QApproveObj): void {
    // console.log(selectedMenuApp);
    this.SelectedQApprove = selectedQApprove;
  }

  OnShowProgressBarEvent(status: string): void {
    if (status === 'show') {
      this.IsProgressBarVisibile = true;
    } else {
      this.IsProgressBarVisibile = false;
    }

  }

  RefreshAllQApproves(msg: string): void {
    // console.log(msg);
    this.GetAllQApproves();
  }

}
