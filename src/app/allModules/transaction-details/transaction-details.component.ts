import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationDetails } from 'app/models/authentication-details';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { TransactionDetailsService } from 'app/services/transaction-details.service';
import { TransactionDetails, TransDetailsByID } from 'app/models/transaction-details';
import { } from '@angular/cdk/stepper';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
  animations: fuseAnimations
})
export class TransactionDetailsComponent implements OnInit, OnDestroy {

  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  SelectedTransactionDetails: TransDetailsByID;
  SelectedID: number;
  SetIntervalID: any;

  constructor(
    private _router: Router,
    public snackBar: MatSnackBar,
    private _transactionDetailsService: TransactionDetailsService,
    private _route: ActivatedRoute
  ) {
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = true;
  }

  ngOnInit(): void {
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    } else {
      this._router.navigate(['/auth/login']);
    }
    this._route.params.subscribe(x => {
      if (x['ID']) {
        this.SelectedID = +x['ID'];
      }
    });
    if (this.SelectedID) {
      this.GetSelectedTransactionDetails();
      this.SetIntervalID = setInterval(() => {
        this.GetSelectedTransactionDetails();
      }, 3000);

    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    if (this.SetIntervalID) {
      clearInterval(this.SetIntervalID);
    }
  }

  GetSelectedTransactionDetails(): void {
    this._transactionDetailsService.GetTransactionDetailsByID(this.SelectedID, this.authenticationDetails.userID).subscribe(
      (data) => {
        if (data) {
          this.SelectedTransactionDetails = data as TransDetailsByID;
          this.IsProgressBarVisibile = false;
        } else {
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar(`No Details found for ID ${this.SelectedID}`, SnackBarStatus.danger);
        }
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  // getDate(exitDate: string, entryDate: string): any {
  //   if (exitDate !== '' && entryDate !== '' && exitDate !== null && entryDate !== null) {
  //     const diff = new Date(exitDate).getTime() - new Date(entryDate).getTime();
  //     const day = 1000 * 60 * 60 * 24;
  //     const diffDays = Math.floor(diff / 86400000); // days
  //     const diffHrs = Math.floor((diff % 86400000) / 3600000); // hours
  //     const diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); // minutes
  //     const days = Math.floor(diff / day);
  //     const months = Math.floor(days / 31);
  //     const years = Math.floor(months / 12);
  //     if (diffDays !== 0 && diffMins !== 0 && diffHrs !== 0) {
  //       return diffDays + ' dy ' + diffHrs + ' hr ' + diffMins + ' min';
  //     }
  //     else if (diffDays === 0 && diffMins !== 0 && diffHrs !== 0) {
  //       return diffHrs + ' hr ' + diffMins + ' min';
  //     }
  //     else if (diffDays !== 0 && diffMins === 0 && diffHrs !== 0) {
  //       return diffDays + ' dy ' + diffHrs + ' hr ';
  //     }
  //     else if (diffDays !== 0 && diffMins !== 0 && diffHrs === 0) {
  //       return diffDays + ' dy ' + diffMins + ' min';
  //     }
  //     else if (diffDays === 0 && diffMins !== 0 && diffHrs === 0) {
  //       return diffMins + ' min';
  //     }
  //     else if (diffDays === 0 && diffMins === 0 && diffHrs !== 0) {
  //       return diffHrs + ' hr ';
  //     }
  //     else if (diffDays !== 0 && diffMins === 0 && diffHrs === 0) {
  //       return diffDays + ' dy ';
  //     }
  //     else if (diffDays === 0 && diffMins === 0 && diffHrs === 0) {
  //       return ' - ';
  //     }
  //     else {
  //       return ' - ';
  //     }
  //   }
  //   else {
  //     return '-';
  //   }

  // }
}



