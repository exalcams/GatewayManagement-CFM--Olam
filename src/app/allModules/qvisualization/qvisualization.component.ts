import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthenticationDetails } from 'app/models/authentication_details';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatIconRegistry, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { TransactionDetails, QueueDetails, StackDetails } from 'app/models/transaction-details';
import { TransactionDetailsService } from 'app/services/transaction-details.service';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { fuseAnimations } from '@fuse/animations';
import { GatewayService } from 'app/services/gateway.service';

@Component({
  selector: 'app-qvisualization',
  templateUrl: './qvisualization.component.html',
  styleUrls: ['./qvisualization.component.scss'],
  animations: fuseAnimations
})

export class QVisualizationComponent implements OnInit, OnDestroy {
  widgets: any;
  AllTransactionDetails: TransactionDetails[] = [];
  SelectedTransactionDeatils: TransactionDetails;
  AllStackDetails: StackDetails[] = [];
  AllQueueDetails: QueueDetails[] = [];
  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  SetIntervalID: any;
  firstQueue: any;
  secondQueue: any;
  thirdQueue: any;

  displayedColumns: string[] = ['VEHICLE_NO', 'TRANSACTION_ID', 'MATERIAL', 'TRANSPORTER_NAME', 'CUSTOMER_NAME', 'BAY', 'LINE_NUMBER', 'FG_DESCRIPTION', 'DRIVER_NO', 'TYPE', 'ACTION'];
  dataSource: MatTableDataSource<StackDetails>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _router: Router,
    public snackBar: MatSnackBar,
    private _transactionDetailsService: TransactionDetailsService,
    private _gatewayService: GatewayService,

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

    // this.GetAllTransactionDetails();
    this.GetAllQueues();
    this.GetAllStacks();
    this.SetIntervalID = setInterval(() => {
      // this.GetAllTransactionDetails();
      this.GetAllQueues();
      this.GetAllStacks();
    }, 3000);

  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    if (this.SetIntervalID) {
      clearInterval(this.SetIntervalID);
    }
  }

  // tslint:disable-next-line:typedef
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  publicReAnnouncement(queueData: QueueDetails): void {
    console.log(queueData);
    if (queueData) {
      this._gatewayService.PublicReAnnouncement(this.authenticationDetails.userID, queueData.TRANS_ID).subscribe(
        (data) => {
          //this.AllQueueDetails = data as QueueDetails[];
          this.notificationSnackBarComponent.openSnackBar('Reannouncement Sent Successfully', SnackBarStatus.success);
          // this.SaveSucceed.emit('success');
          // this._configurationService.TriggerNotification('Configuration created successfully');
          this.IsProgressBarVisibile = false;
        },
        (err) => {
          console.error(err);
          this.IsProgressBarVisibile = false;
          this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        }
      );
    } else {
      this.notificationSnackBarComponent.openSnackBar('Cannot Send because no Vehicle details', SnackBarStatus.danger);
    }

  }

  GetAllQueues(): void {
    this._gatewayService.GetAllQueues(this.authenticationDetails.userID).subscribe(
      (data) => {
        this.AllQueueDetails = data as QueueDetails[];
        console.log(this.AllQueueDetails);
        // this.dataSource = new MatTableDataSource(this.AllQueueDetails);
        // // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        if (this.AllQueueDetails.length > 0) {
          this.firstQueue = this.AllQueueDetails[0];
          this.secondQueue = this.AllQueueDetails[1];
          this.thirdQueue = this.AllQueueDetails[2];
          console.log(this.firstQueue);
        }

        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllStacks(): void {
    this._gatewayService.GetAllStacks(this.authenticationDetails.userID).subscribe(
      (data) => {
        this.AllStackDetails = data as StackDetails[];
        this.dataSource = new MatTableDataSource(this.AllStackDetails);
        console.log(this.AllStackDetails);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  loadSelectedTransactionDetails(row: TransactionDetails): void {
    this.SelectedTransactionDeatils = row;
    this._router.navigate(['/transactionDetails', this.SelectedTransactionDeatils.TRANS_ID]);
  }

  moveSelectedItemDetailsAbove(row: StackDetails): void {
    console.log(row);
    this._gatewayService.moveSelectedItemDetailsAbove(row).subscribe(
      (data) => {
        // this.AllStackDetails = data as StackDetails[];
        // this.dataSource = new MatTableDataSource(this.AllStackDetails);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        this.GetAllStacks();
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

}
