import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatSnackBar, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { takeUntil } from 'rxjs/internal/operators';
import { TransactionService } from 'app/services/transaction.service';
import { TransactionDetails, TransDetailsByID, CommonFilters } from 'app/models/transaction-details';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { Router } from '@angular/router';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { AuthenticationDetails } from 'app/models/authentication-details';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  animations: fuseAnimations
})
export class TransactionComponent implements OnInit {
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  SetIntervalID: any;
  SelectedTransactionDetails: TransDetailsByID;
  SelectedID: string;
  commonFilterFormGroup: FormGroup;
  AllVehicleNos: string[] = [];
  commonFilters: CommonFilters;
  authenticationDetails: AuthenticationDetails;
  AllTransactionDetails: TransactionDetails[] = [];
  SelectedTransactionDeatils: TransactionDetails;
  dataSource: MatTableDataSource<TransactionDetails> | null;
  displayedColumns = ['VEHICLE_NO', 'GENTRY_DATE', 'GENTRY_TIME','TAT_TIME', 'STATUS_DESCRIPTION', 'CUR_STATUS',
    'TRUCK_ID', 'TRANSACTION_ID', 'TYPE', 'BAY', 'DRIVER_DETAILS', 'DRIVER_NO', 'TRANSPORTER_NAME',
    'CUSTOMER_NAME', 'FG_DESCRIPTION'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild('filter')
  filter: ElementRef;

  constructor(
    private _transactionService: TransactionService,
    private _router: Router,
    public snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = true;
    this.commonFilterFormGroup = this._formBuilder.group({
      VEHICLE_NO: [''],
      FROMDATE: [''],
      TODATE: ['']
      // FROMDATE: ['', Validators.required],
      // TODATE: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    }
    this.GetAllTransactions();
    //this.GetAllVehicleNos();
    this.SetIntervalID = setInterval(() => {
      this.GetAllTransactions();
    }, 10000);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getDate(exitDate: string, entryDate: string): any {
    if (exitDate !== '' && entryDate !== '' && exitDate !== null && entryDate !== null) {
      const diff = new Date(exitDate).getTime() - new Date(entryDate).getTime();
      const day = 1000 * 60 * 60 * 24;
      const diffDays = Math.floor(diff / 86400000); // days
      const diffHrs = Math.floor((diff % 86400000) / 3600000); // hours
      const diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); // minutes
      const days = Math.floor(diff / day);
      const months = Math.floor(days / 31);
      const years = Math.floor(months / 12);
      if (diffDays !== 0 && diffMins !== 0 && diffHrs !== 0) {
        return diffDays + ' dy ' + diffHrs + ' hr ' + diffMins + ' min';
      }
      else if (diffDays === 0 && diffMins !== 0 && diffHrs !== 0) {
        return diffHrs + ' hr ' + diffMins + ' min';
      }
      else if (diffDays !== 0 && diffMins === 0 && diffHrs !== 0) {
        return diffDays + ' dy ' + diffHrs + ' hr ';
      }
      else if (diffDays !== 0 && diffMins !== 0 && diffHrs === 0) {
        return diffDays + ' dy ' + diffMins + ' min';
      }
      else if (diffDays === 0 && diffMins !== 0 && diffHrs === 0) {
        return diffMins + ' min';
      }
      else if (diffDays === 0 && diffMins === 0 && diffHrs !== 0) {
        return diffHrs + ' hr ';
      }
      else if (diffDays !== 0 && diffMins === 0 && diffHrs === 0) {
        return diffDays + ' dy ';
      }
      else if (diffDays === 0 && diffMins === 0 && diffHrs === 0) {
        return ' - ';
      }
      else {
        return ' - ';
      }
    }
    else {
      return '-';
    }

  }

  getTAT(entryDate: string): any {
    if (entryDate !== '' && entryDate !== null) {
      var aestTime = new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" });
      var aestTime1 = new Date(aestTime);
      const diff = aestTime1.getTime() - new Date(entryDate).getTime();
      const day = 1000 * 60 * 60 * 24;
      const diffDays = Math.floor(diff / 86400000); // days
      const diffHrs = Math.floor((diff % 86400000) / 3600000); // hours
      const diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); // minutes
      const days = Math.floor(diff / day);
      const months = Math.floor(days / 31);
      const years = Math.floor(months / 12);
      if (diffDays !== 0 && diffMins !== 0 && diffHrs !== 0) {
        return diffDays + ' dy ' + diffHrs + ' hr ' + diffMins + ' min';
      }
      else if (diffDays === 0 && diffMins !== 0 && diffHrs !== 0) {
        return diffHrs + ' hr ' + diffMins + ' min';
      }
      else if (diffDays !== 0 && diffMins === 0 && diffHrs !== 0) {
        return diffDays + ' dy ' + diffHrs + ' hr ';
      }
      else if (diffDays !== 0 && diffMins !== 0 && diffHrs === 0) {
        return diffDays + ' dy ' + diffMins + ' min';
      }
      else if (diffDays === 0 && diffMins !== 0 && diffHrs === 0) {
        return diffMins + ' min';
      }
      else if (diffDays === 0 && diffMins === 0 && diffHrs !== 0) {
        return diffHrs + ' hr ';
      }
      else if (diffDays !== 0 && diffMins === 0 && diffHrs === 0) {
        return diffDays + ' dy ';
      }
      else if (diffDays === 0 && diffMins === 0 && diffHrs === 0) {
        return ' - ';
      }
      else {
        return ' - ';
      }
    }
    else {
      return '-';
    }

  }

  GetAllTransactions(): void {
    this._transactionService.GetAllTransactionDetailsWithOutGateExit(this.authenticationDetails.userID).subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        if (this.AllTransactionDetails.length > 0) {
          this.AllTransactionDetails.forEach(element => {
            element.GENTRY_DATE = element.GENTRY_TIME;
            element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
            element.TAT_TIME = this.getTAT(element.GENTRY_TIME.toString());

          });
          this.dataSource = new MatTableDataSource(this.AllTransactionDetails);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.log(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  loadSelectedTransactionDetails(row: TransactionDetails): void {
    this.SelectedTransactionDeatils = row;
    this._router.navigate(['/transactionDetails', this.SelectedTransactionDeatils.TRANS_ID]);
  }

  GetAllTransactionsBasedOnFilter(): void {
    if (this.commonFilterFormGroup.valid) {
      const VEHICLE_NO: string = this.commonFilterFormGroup.get('VEHICLE_NO').value;
      const FROMDATE = this.datePipe.transform(this.commonFilterFormGroup.get('FROMDATE').value as Date, 'yyyy-MM-dd');
      const TODATE = this.datePipe.transform(this.commonFilterFormGroup.get('TODATE').value as Date, 'yyyy-MM-dd');
      const USERID: Guid = this.authenticationDetails.userID;
      this.commonFilters = new CommonFilters();
      this.commonFilters.UserID = USERID;
      this.commonFilters.VEHICLE_NO = VEHICLE_NO;
      this.commonFilters.FROMDATE = FROMDATE;
      this.commonFilters.TODATE = TODATE;
      // tslint:disable-next-line:max-line-length
      if (this.commonFilters.VEHICLE_NO !== '' && this.commonFilters.VEHICLE_NO !== null && this.commonFilters.FROMDATE === '' && this.commonFilters.TODATE === '' || this.commonFilters.FROMDATE === null && this.commonFilters.TODATE === null) {
        // this.authenticationDetails.userID, VEHICLE_NO, FROMDATE, TODATE
        this._transactionService.GetAllTransactionsBasedOnVehicleNoFilter(this.commonFilters)
          .subscribe((data) => {
            this.AllTransactionDetails = data as TransactionDetails[];
            if (this.AllTransactionDetails.length > 0) {
              this.AllTransactionDetails.forEach(element => {
                element.GENTRY_DATE = element.GENTRY_TIME;
                element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                element.TAT_TIME = this.getTAT(element.GENTRY_TIME.toString());
              });
              this.dataSource = new MatTableDataSource(this.AllTransactionDetails);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
            this.IsProgressBarVisibile = false;
          },
            (err) => {
              console.log(err);
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            });
      }
      // tslint:disable-next-line:max-line-length
      else if (this.commonFilters.FROMDATE !== '' && this.commonFilters.TODATE !== '' && this.commonFilters.FROMDATE !== null && this.commonFilters.TODATE !== null && this.commonFilters.VEHICLE_NO === '' || this.commonFilters.VEHICLE_NO === null) {
        // this.authenticationDetails.userID, VEHICLE_NO, FROMDATE, TODATE
        this._transactionService.GetAllTransactionsBasedOnDateFilter(this.commonFilters)
          .subscribe((data) => {
            this.AllTransactionDetails = data as TransactionDetails[];
            if (this.AllTransactionDetails.length > 0) {
              this.AllTransactionDetails.forEach(element => {
                element.GENTRY_DATE = element.GENTRY_TIME;
                element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                element.TAT_TIME = this.getTAT(element.GENTRY_TIME.toString());
              });
              this.dataSource = new MatTableDataSource(this.AllTransactionDetails);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
            this.IsProgressBarVisibile = false;
          },
            (err) => {
              console.log(err);
              this.IsProgressBarVisibile = false;
              this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            });
      }
      else {
        this.notificationSnackBarComponent.openSnackBar('It requires at least a field or From Date and To Date', SnackBarStatus.danger);
      }
    }
    Object.keys(this.commonFilterFormGroup.controls).forEach(key => {
      this.commonFilterFormGroup.get(key).markAsTouched();
      this.commonFilterFormGroup.get(key).markAsDirty();
    });
    this.commonFilterFormGroup.reset();
  }

  GetAllVehicleNos(): void {
    this._transactionService.GetAllVehicleNos(this.authenticationDetails.userID).subscribe((data) => {
      if (data) {
        this.AllVehicleNos = data as string[];
      }
    },
      (err) => {
        console.log(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      });
  }



















  // GetSelectedTransactionDetails(): void {
  //   // console.log('called');
  //   if (this.SelectedID === 'parking') {
  //     const onlyParking: any[] = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'PENTRY');
  //     //  this._router.navigate(['/transaction', value]);
  //     console.log(onlyParking);
  //     this._transactionDetailsService.GetTransactionDetailsByValue(this.SelectedID).subscribe(
  //       (data) => {
  //         if (data) {
  //           this.AllTransactionDetails = data as TransactionDetails[];
  //           this.dataSource = new FilesDataSource(this._transactionService, this.paginator, this.sort);
  //           // this.dataSource.paginator = this.paginator;
  //           // this.dataSource.sort = this.sort;
  //           // this.SelectedTransactionDetails = data as TransDetailsByID;
  //           // console.log(this.SelectedTransactionDetails.TransactionDetails.ID);
  //           this.IsProgressBarVisibile = false;
  //         } else {
  //           this.IsProgressBarVisibile = false;
  //           this.notificationSnackBarComponent.openSnackBar(`No Details found for ID ${this.SelectedID}`, SnackBarStatus.danger);
  //         }
  //       },
  //       (err) => {
  //         console.error(err);
  //         this.IsProgressBarVisibile = false;
  //         this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //       }
  //     );
  //   }
  //   else if (this.SelectedID === 'loading') {
  //     const onlyLoading: any[] = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'LENTRY');
  //     console.log(onlyLoading);
  //     this._transactionDetailsService.GetTransactionDetailsByValue(this.SelectedID).subscribe(
  //       (data) => {
  //         if (data) {
  //           this.AllTransactionDetails = data as TransactionDetails[];
  //           // this.dataSource = new MatTableDataSource(this.AllTransactionDetails);
  //           this.dataSource = new FilesDataSource(this._transactionService, this.paginator, this.sort);
  //           // this.dataSource.paginator = this.paginator;
  //           // this.dataSource.sort = this.sort;
  //           // this.SelectedTransactionDetails = data as TransDetailsByID;
  //           // console.log(this.SelectedTransactionDetails.TransactionDetails.ID);
  //           this.IsProgressBarVisibile = false;
  //         } else {
  //           this.IsProgressBarVisibile = false;
  //           this.notificationSnackBarComponent.openSnackBar(`No Details found for ID ${this.SelectedID}`, SnackBarStatus.danger);
  //         }
  //       },
  //       (err) => {
  //         console.error(err);
  //         this.IsProgressBarVisibile = false;
  //         this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //       }
  //     );
  //     // this._router.navigate(['/transaction', value]);
  //   }
  //   else if (this.SelectedID === 'unloading') {
  //     const onlyUnLoading: any[] = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'ULENTRY');
  //     console.log(onlyUnLoading);
  //     this._transactionDetailsService.GetTransactionDetailsByValue(this.SelectedID).subscribe(
  //       (data) => {
  //         if (data) {
  //           this.AllTransactionDetails = data as TransactionDetails[];
  //           // this.dataSource = new MatTableDataSource(this.AllTransactionDetails);
  //           this.dataSource = new FilesDataSource(this._transactionService, this.paginator, this.sort);
  //           // this.dataSource.paginator = this.paginator;
  //           // this.dataSource.sort = this.sort;
  //           // this.SelectedTransactionDetails = data as TransDetailsByID;
  //           // console.log(this.SelectedTransactionDetails.TransactionDetails.ID);
  //           this.IsProgressBarVisibile = false;
  //         } else {
  //           this.IsProgressBarVisibile = false;
  //           this.notificationSnackBarComponent.openSnackBar(`No Details found for ID ${this.SelectedID}`, SnackBarStatus.danger);
  //         }
  //       },
  //       (err) => {
  //         console.error(err);
  //         this.IsProgressBarVisibile = false;
  //         this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //       }
  //     );
  //     // this._router.navigate(['/transaction', value]);
  //   }
  // }
}


