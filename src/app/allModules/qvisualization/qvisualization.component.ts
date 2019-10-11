import { Component, OnInit, ViewChild, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { AuthenticationDetails } from 'app/models/authentication-details';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatIconRegistry, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { QueueDetails, StackDetails } from 'app/models/transaction-details';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { fuseAnimations } from '@fuse/animations';
import { QueueStackService } from 'app/services/queue-stack.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-qvisualization',
  templateUrl: './qvisualization.component.html',
  styleUrls: ['./qvisualization.component.scss'],
  animations: fuseAnimations
})

export class QVisualizationComponent implements OnInit, OnDestroy {
  widgets: any;
  AllStackDetails: StackDetails[] = [];
  AllQueueDetails: QueueDetails[] = [];
  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  SetIntervalID: any;
  firstQueue: any;
  secondQueue: any;
  thirdQueue: any;

  displayedColumnsQueue: string[] = ['VEHICLE_NO', 'REANNOUNCE_ACTION','REMOVE_ACTION', 'STATUS_DESCRIPTION', 'BAY', 'BAY_GROUP', 'TYPE',
    'TRANSACTION_ID', 'CREATED_ON', 'TRANSPORTER_NAME', 'CUSTOMER_NAME', 'FG_DESCRIPTION'];
  dataSourceQueue: MatTableDataSource<QueueDetails>;
  displayedColumnsStack: string[] = ['VEHICLE_NO', 'ACTION', 'STATUS_DESCRIPTION', 'BAY', 'BAY_GROUP', 'TYPE',
    'TRANSACTION_ID', 'CREATED_ON', 'TRANSPORTER_NAME', 'CUSTOMER_NAME',
    'FG_DESCRIPTION', 'DRIVER_NO'];
  dataSourceStack: MatTableDataSource<StackDetails>;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  private updateSubscription: Subscription;
  constructor(
    private _router: Router,
    public snackBar: MatSnackBar,
    private _queueStackService: QueueStackService,

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
    // this.SetIntervalID = setInterval(() => {
    //   // this.GetAllTransactionDetails();
    //   this.GetAllQueues();
    //   this.GetAllStacks();
    // }, 10000);
    this.updateSubscription = interval(10000).subscribe(
      (val) => {
        this.GetAllQueues();
        this.GetAllStacks();
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.updateSubscription.unsubscribe();
    // if (this.SetIntervalID) {
    //   clearInterval(this.SetIntervalID);
    // }
  }

  // tslint:disable-next-line:typedef
  applyFilterStack(filterValue: string) {
    this.dataSourceStack.filter = filterValue.trim().toLowerCase();
  }

  applyFilterQueue(filterValue: string) {
    this.dataSourceQueue.filter = filterValue.trim().toLowerCase();
  }

  publicReAnnouncement(queueData: QueueDetails): void {
    console.log(queueData);
    if (queueData) {
      this._queueStackService.PublicReAnnouncement(this.authenticationDetails.userID, queueData.TRANS_ID).subscribe(
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

  removeFromQueueAddToStack(queueData: QueueDetails): void {
    console.log(queueData);
    if (queueData) {
      this._queueStackService.RemoveFromQueueAddToStack(this.authenticationDetails.userID, queueData.TRANS_ID).subscribe(
        (data) => {
          //this.AllQueueDetails = data as QueueDetails[];
          this.notificationSnackBarComponent.openSnackBar('Removed From Q Successfully', SnackBarStatus.success);
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
    console.log("Iam Calling every 10 Seconds");
    this._queueStackService.GetAllQueues(this.authenticationDetails.userID).subscribe(
      (data) => {
        this.AllQueueDetails = data as QueueDetails[];
        console.log("QueueCount:" + this.AllQueueDetails.length);
        // console.log(this.AllQueueDetails.length)
        //console.log(this.AllQueueDetails);
        this.AllQueueDetails.forEach(element => {
          //element.GENTRY_DATE = element.GENTRY_TIME;
          element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
          //element.TAT_TIME = this.getTAT(element.GENTRY_TIME.toString());
        });
        this.dataSourceQueue = new MatTableDataSource(this.AllQueueDetails);
        this.dataSourceQueue.paginator = this.paginator.toArray()[0];
        this.dataSourceQueue.sort = this.sort.toArray()[0];
        // this.dataSourceQueue.paginator = this.paginatorQueue;
        // this.dataSourceQueue.sort = this.sortQueue;
        this.IsProgressBarVisibile = false;
        // if (this.AllQueueDetails.length > 0) {
        //   this.firstQueue = this.AllQueueDetails[0];
        //   this.secondQueue = this.AllQueueDetails[1];
        //   this.thirdQueue = this.AllQueueDetails[2];
        //   console.log(this.firstQueue);
        // }
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllStacks(): void {
    console.log("Iam Calling every 10 Seconds");
    this._queueStackService.GetAllStacks(this.authenticationDetails.userID).subscribe(
      (data) => {
        this.AllStackDetails = data as StackDetails[];
        console.log("StackCount:" + this.AllStackDetails.length);
        //console.log(this.AllStackDetails.length)
        this.AllStackDetails.forEach(element => {
          //element.GENTRY_DATE = element.GENTRY_TIME;
          element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
          //element.TAT_TIME = this.getTAT(element.GENTRY_TIME.toString());
        });
        this.dataSourceStack = new MatTableDataSource(this.AllStackDetails);
        this.dataSourceStack.paginator = this.paginator.toArray()[1];
        this.dataSourceStack.sort = this.sort.toArray()[1];
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  moveSelectedItemDetailsAbove(row: StackDetails): void {
    console.log(row);
    this._queueStackService.moveSelectedItemDetailsAbove(row).subscribe(
      (data) => {
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
