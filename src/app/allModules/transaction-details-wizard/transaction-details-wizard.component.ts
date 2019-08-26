import { Component, OnInit } from '@angular/core';
import { AuthenticationDetails } from 'app/models/authentication_details';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { Router } from '@angular/router';
import { MatSnackBar} from '@angular/material';
import { TransactionDetailsService } from 'app/services/transaction-details.service';
import { TransactionDetails } from 'app/models/transaction-details';
import { } from '@angular/cdk/stepper';

@Component({
  selector: 'app-transaction-details-wizard',
  templateUrl: './transaction-details-wizard.component.html',
  styleUrls: ['./transaction-details-wizard.component.scss'],

})
export class TransactionDetailsWizardComponent implements OnInit {

  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  SelectedTransactionDetails: TransactionDetails;

  constructor(
    private _router: Router,
    public snackBar: MatSnackBar,
    private _transactionDetailsService: TransactionDetailsService,

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
    // this.GetSelectedTransactionDetails();
  }

  GetSelectedTransactionDetails(): void {
    const data = this._transactionDetailsService.GetSelectedTransactionDetails();
    if (data) {
      this.SelectedTransactionDetails = data;
      console.log(data as TransactionDetails);
      this.IsProgressBarVisibile = false;

    } else {
      this._router.navigate(['/transaction']);
    }

  }

}
