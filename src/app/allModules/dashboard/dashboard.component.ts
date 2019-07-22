import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationDetails } from 'app/models/authentication_details';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { TransactionDetails, ExceptionDetails, CommonFilters } from 'app/models/transaction-details';
import { TransactionDetailsService } from 'app/services/transaction-details.service';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { Guid } from 'guid-typescript';
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DashboardComponent implements OnInit {
  AllTransactionDetails: TransactionDetails[] = [];
  AllExceptionDetails: ExceptionDetails[] = [];
  AllTransactionDetailsByValue: TransactionDetails[] = [];
  SelectedTransactionDeatils: TransactionDetails;
  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  SetIntervalID: any;
  commonFilterFormGroup: FormGroup;
  AllVehicleNos: string[] = [];
  commonFilters: CommonFilters;
  parkingCount: any;
  loadingCount: number;
  unLoadingCount: number;
  weighmentCount: number;
  totalTrucksCount: number;
  exceptionTrucksCount: number;
  completedTrucksCount: number;
  inTransistTrucksCount: number;
  contentForTableShow = true;
  contentForTableShowName: string;
  exceptionTableShow = false;
  otherTableShow = false;
  transactionBasedOnValueTableShow = false;
  diagramShow = false;
  displayedColumns = ['VEHICLE_NO', 'VENDOR', 'MATERIAL', 'DRIVER_DETAILS', 'BAY'];
  dataSource: MatTableDataSource<TransactionDetails>;
  displayedColumns1 = ['VEHICLE_NO', 'TRUCK_ID', 'EXCEPTION_MESSAGE', 'CREATED_ON'];
  dataSource1: MatTableDataSource<ExceptionDetails>;
  dataSource2: MatTableDataSource<TransactionDetails>;
  displayedColumns2 = ['VEHICLE_NO', 'VENDOR', 'DRIVER_DETAILS', 'MATERIAL', 'BAY', 'CUR_STATUS', 'STATUS_DESCRIPTION'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private _router: Router,
    public snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private _dashboardService: TransactionDetailsService,
    public _matDialog: MatDialog,

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
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    } else {
      this._router.navigate(['/auth/login']);
    }
    console.log(this.authenticationDetails);
    this.GetAllVehicleNos();
    this.GetAllTransactionDetailsCount(this.authenticationDetails.userID);
    this.GetAllExceptionDetailsCount(this.authenticationDetails.userID);
    this.GetAllInTransistDetailsCount(this.authenticationDetails.userID);
    this.GetAllCompletedDetailsCount(this.authenticationDetails.userID);
    this.GetAllExceptionDetailsCount(this.authenticationDetails.userID);
    this.GetAllParkingDetailsCount(this.authenticationDetails.userID);
    this.GetAllWeighmentDetailsCount(this.authenticationDetails.userID);
    this.GetAllLoadingDetailsCount(this.authenticationDetails.userID);
    this.GetAllUnLoadingDetailsCount(this.authenticationDetails.userID);
    this.SetIntervalID = setInterval(() => {
      this.GetAllTransactionDetailsCount(this.authenticationDetails.userID);
      this.GetAllExceptionDetailsCount(this.authenticationDetails.userID);
      this.GetAllInTransistDetailsCount(this.authenticationDetails.userID);
      this.GetAllCompletedDetailsCount(this.authenticationDetails.userID);
      this.GetAllExceptionDetailsCount(this.authenticationDetails.userID);
      this.GetAllParkingDetailsCount(this.authenticationDetails.userID);
      this.GetAllWeighmentDetailsCount(this.authenticationDetails.userID);
      this.GetAllLoadingDetailsCount(this.authenticationDetails.userID);
      this.GetAllUnLoadingDetailsCount(this.authenticationDetails.userID);
    }, 4000);
  }

  // tslint:disable-next-line:use-life-cycle-interface
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

  // tslint:disable-next-line:typedef
  applyFilter1(filterValue: string) {
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  // tslint:disable-next-line:typedef
  applyFilter2(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  goBackToDashboard(): void {
    this.diagramShow = false;
    this.contentForTableShow = true;
  }

  GetAllTransactionDetails(ID: Guid): void {
    this._dashboardService.GetAllTransactionDetails(ID).subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        // this.parkingCount = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'PENTRY').length;
        // this.loadingCount = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'LENTRY').length;
        // this.unLoadingCount = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'ULENTRY').length;
        // this.weighmentCount = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'W1ENTRY' || x.CUR_STATUS === 'W2ENTRY').length;
        // this.totalTrucksCount = this.AllTransactionDetails.length;
        // this.completedTrucksCount = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'GEXIT').length;
        // // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:max-line-length
        // this.inTransistTrucksCount = this.AllTransactionDetails.filter(x => x.CUR_STATUS !== 'GEXIT' && x.CUR_STATUS !== 'GENTRY' && x.CUR_STATUS !== 'W1ENTRY' && x.CUR_STATUS !== 'W2ENTRY' && x.CUR_STATUS !== 'LENTRY' && x.CUR_STATUS !== 'ULENTRY' && x.CUR_STATUS !== 'PENTRY').length;
        // this.IsProgressBarVisibile = false;
        this.totalTrucksCount = this.AllTransactionDetails.length;
        this.dataSource = new MatTableDataSource(this.AllTransactionDetails);
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

  GetAllCompletedDetails(ID: Guid): void {
    this._dashboardService.GetAllCompletedDetails(ID).subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        this.completedTrucksCount = this.AllTransactionDetails.length;
        // this.otherTableShow = true;
        // this.exceptionTableShow = false;
        this.dataSource = new MatTableDataSource(this.AllTransactionDetails);
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

  GetAllInTransistDetails(ID: Guid): void {
    this._dashboardService.GetAllInTransistDetails(ID).subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        this.inTransistTrucksCount = this.AllTransactionDetails.length;
        // this.otherTableShow = true;
        // this.exceptionTableShow = false;
        this.dataSource = new MatTableDataSource(this.AllTransactionDetails);
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

  GetAllExceptionDetails(ID: Guid): void {
    this._dashboardService.GetAllExceptionDetails(ID).subscribe(
      (data) => {
        this.AllExceptionDetails = data as ExceptionDetails[];
        this.exceptionTrucksCount = this.AllExceptionDetails.length;
        // this.otherTableShow = false;
        // this.exceptionTableShow = true;
        this.dataSource1 = new MatTableDataSource(this.AllExceptionDetails);
        this.dataSource1.paginator = this.paginator;
        this.dataSource1.sort = this.sort;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllParkingDetailsCount(ID: Guid): void {
    this._dashboardService.GetAllParkingDetailsCount(ID).subscribe(
      (data) => {
        this.parkingCount = data as number;
        console.log(this.parkingCount);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllWeighmentDetailsCount(ID: Guid): void {
    this._dashboardService.GetAllWeighmentDetailsCount(ID).subscribe(
      (data) => {
        this.weighmentCount = data as number;
        console.log(this.weighmentCount);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllLoadingDetailsCount(ID: Guid): void {
    this._dashboardService.GetAllLoadingDetailsCount(ID).subscribe(
      (data) => {
        this.loadingCount = data as number;
        console.log(this.loadingCount);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllUnLoadingDetailsCount(ID: Guid): void {
    this._dashboardService.GetAllUnLoadingDetailsCount(ID).subscribe(
      (data) => {
        this.unLoadingCount = data as number;
        console.log(this.unLoadingCount);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllTransactionDetailsCount(ID: Guid): void {
    this._dashboardService.GetAllTransactionDetailsCount(ID).subscribe(
      (data) => {
        this.totalTrucksCount = data as number;
        console.log(this.totalTrucksCount);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllInTransistDetailsCount(ID: Guid): void {
    this._dashboardService.GetAllInTransistDetailsCount(ID).subscribe(
      (data) => {
        this.inTransistTrucksCount = data as number;
        console.log(this.inTransistTrucksCount);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllCompletedDetailsCount(ID: Guid): void {
    this._dashboardService.GetAllCompletedDetailsCount(ID).subscribe(
      (data) => {
        this.completedTrucksCount = data as number;
        console.log(this.completedTrucksCount);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllExceptionDetailsCount(ID: Guid): void {
    this._dashboardService.GetAllExceptionDetailsCount(ID).subscribe(
      (data) => {
        this.exceptionTrucksCount = data as number;
        console.log(this.exceptionTrucksCount);
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  loadSelectedTransactionDetails(value: string): void {
    if (value === 'parking') {
      // const onlyParking: any[] = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'PENTRY');
      // this._router.navigate(['/transaction', value]);
      // console.log(onlyParking);
      this.diagramShow = true;
      this.contentForTableShowName = 'Only Parking';
      this.contentForTableShow = false;
      this.exceptionTableShow = false;
      this.otherTableShow = false;
      this.transactionBasedOnValueTableShow = true;
      this.dataSource2 = null;
      this.GetTransactionDetailsByValue(value, this.authenticationDetails.userID);
    }
    else if (value === 'loading') {
      // const onlyLoading: any[] = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'LENTRY');
      // console.log(onlyLoading);
      // this._router.navigate(['/transaction', value]);
      this.diagramShow = true;
      this.contentForTableShowName = 'Only Loading';
      this.contentForTableShow = false;
      this.exceptionTableShow = false;
      this.otherTableShow = false;
      this.transactionBasedOnValueTableShow = true;
      this.dataSource2 = null;
      this.GetTransactionDetailsByValue(value, this.authenticationDetails.userID);
    }
    else if (value === 'unloading') {
      // const onlyUnLoading: any[] = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'ULENTRY');
      // console.log(onlyUnLoading);
      //   this._router.navigate(['/transaction', value]);
      this.diagramShow = true;
      this.contentForTableShowName = 'Only UnLoading';
      this.contentForTableShow = false;
      this.exceptionTableShow = false;
      this.otherTableShow = false;
      this.transactionBasedOnValueTableShow = true;
      this.dataSource2 = null;
      this.GetTransactionDetailsByValue(value, this.authenticationDetails.userID);
    }
    else if (value === 'weighment') {
      // const onlyWeighment: any[] = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'W1ENTRY' || x.CUR_STATUS === 'W2ENTRY');
      // console.log(onlyWeighment);
      //  this._router.navigate(['/transaction', value]);
      this.diagramShow = true;
      this.contentForTableShowName = 'Only Weighment';
      this.contentForTableShow = false;
      this.exceptionTableShow = false;
      this.otherTableShow = false;
      this.transactionBasedOnValueTableShow = true;
      this.dataSource2 = null;
      this.GetTransactionDetailsByValue(value, this.authenticationDetails.userID);
    }
  }

  GetTransactionDetailsByValue(val: string, ID: Guid): void {
    this._dashboardService.GetTransactionDetailsByValue(val, ID).subscribe(
      (data) => {
        this.AllTransactionDetailsByValue = data as TransactionDetails[];
        this.IsProgressBarVisibile = false;
        this.dataSource2 = new MatTableDataSource(this.AllTransactionDetailsByValue);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  loadSelectedTruckDetails(value: string): void {
    if (value === 'total') {
      this.diagramShow = true;
      this.contentForTableShowName = 'Total Trucks';
      this.contentForTableShow = false;
      this.otherTableShow = true;
      this.exceptionTableShow = false;
      this.transactionBasedOnValueTableShow = false;
      this.dataSource = null;
      this.GetAllTransactionDetails(this.authenticationDetails.userID);
      // this.exceptionTableShow = false;
      // this.otherTableShow = true;
      // const onlyTotalTrucks: any[] = this.AllTransactionDetails;
      // console.log(onlyTotalTrucks);
      // this.dataSource = new MatTableDataSource(onlyTotalTrucks);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    }
    else if (value === 'completed') {
      this.diagramShow = true;
      this.contentForTableShowName = 'Completed Trucks';
      this.contentForTableShow = false;
      this.otherTableShow = true;
      this.exceptionTableShow = false;
      this.transactionBasedOnValueTableShow = false;
      this.dataSource = null;
      this.GetAllCompletedDetails(this.authenticationDetails.userID);
      // this.exceptionTableShow = false;
      // this.otherTableShow = true;
      // const onlyCompletedTrucks: any[] = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'GEXIT');
      // console.log(onlyCompletedTrucks);
      // this.dataSource = new MatTableDataSource(onlyCompletedTrucks);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    }
    else if (value === 'exception') {
      this.diagramShow = true;
      this.contentForTableShowName = 'Exceptions';
      this.contentForTableShow = false;
      this.otherTableShow = false;
      this.transactionBasedOnValueTableShow = false;
      this.exceptionTableShow = true;
      this.dataSource1 = null;
      this.GetAllExceptionDetails(this.authenticationDetails.userID);
    }
    else if (value === 'intransist') {
      this.diagramShow = true;
      this.contentForTableShowName = 'In Transist';
      this.contentForTableShow = false;
      this.otherTableShow = true;
      this.transactionBasedOnValueTableShow = false;
      this.exceptionTableShow = false;
      this.dataSource = null;
      this.GetAllInTransistDetails(this.authenticationDetails.userID);
      // this.exceptionTableShow = false;
      // this.otherTableShow = true;
      // // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:max-line-length
      // const onlyDurationTrucks: any[] = this.AllTransactionDetails.filter(x => x.CUR_STATUS !== 'GEXIT' && x.CUR_STATUS !== 'GENTRY' && x.CUR_STATUS !== 'W1ENTRY' && x.CUR_STATUS !== 'W2ENTRY' && x.CUR_STATUS !== 'LENTRY' && x.CUR_STATUS !== 'ULENTRY' && x.CUR_STATUS !== 'PENTRY');
      // console.log(onlyDurationTrucks);
      // this.dataSource = new MatTableDataSource(onlyDurationTrucks);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    }
  }

  loadSelectedVehicleDetails(vehicleData: any): void {
    console.log(vehicleData);
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    // dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'dashboard-detail';
    dialogConfig.data = {
      VEHICLE_NO: vehicleData.VEHICLE_NO,
      TRANSPORTER_NAME: vehicleData.TRANSPORTER_NAME,
      VENDOR: vehicleData.VENDOR,
      TRUCK_ID: vehicleData.TRUCK_ID,
      TYPE: vehicleData.TYPE,
      PLANT: vehicleData.PLANT,
      BAY: vehicleData.BAY,
      CUSTOMER_NAME: vehicleData.CUSTOMER_NAME,
      MATERIAL: vehicleData.MATERIAL,
      GENTRY_TIME: vehicleData.GENTRY_TIME,
      GEXIT_TIME: vehicleData.GEXIT_TIME,
      VEHICLE_OWNER_TYPE: vehicleData.VEHICLE_OWNER_TYPE,
      CUR_STATUS: vehicleData.CUR_STATUS,
      LINE_NUMBER: vehicleData.LINE_NUMBER,
      DRIVER_NO: vehicleData.DRIVER_NO

    };
    // __proto__: Object
    // dialogConfig.data = vehicleData;
    // console.log(dialogConfig.data);
    // this._matDialog.open(ContainerDetailsComponent, dialogConfig);
    const dialogRef = this._matDialog.open(DashboardDetailComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(
    //   data => console.log('Dialog output:', data)
    // );
  }

  GetAllVehicleNos(): void {
    this._dashboardService.GetAllVehicleNos(this.authenticationDetails.userID).subscribe((data) => {
      if (data) {
        this.AllVehicleNos = data as string[];
      }
    },
      (err) => {
        console.log(err);
      });
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
        this._dashboardService.GetAllTransactionsBasedOnVehicleNoFilter(this.commonFilters)
          .subscribe((data) => {
            this.AllTransactionDetails = data as TransactionDetails[];
            // if (this.AllTransactionDetails.length > 0) {
            this.dataSource = new MatTableDataSource(this.AllTransactionDetails);
            console.log(this.AllTransactionDetails);
            // this.commonFilters = null;
            // this.commonFilterFormGroup.reset();
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            // }
            this.IsProgressBarVisibile = false;
          },
            (err) => {
              console.log(err);
            });
      }
      // tslint:disable-next-line:max-line-length
      else if (this.commonFilters.FROMDATE !== '' && this.commonFilters.TODATE !== '' && this.commonFilters.FROMDATE !== null && this.commonFilters.TODATE !== null && this.commonFilters.VEHICLE_NO === '' || this.commonFilters.VEHICLE_NO === null) {
        // this.authenticationDetails.userID, VEHICLE_NO, FROMDATE, TODATE
        this._dashboardService.GetAllTransactionsBasedOnDateFilter(this.commonFilters)
          .subscribe((data) => {
            this.diagramShow = true;
            this.contentForTableShowName = 'Filtered Data';
            this.contentForTableShow = false;
            this.otherTableShow = true;
            this.exceptionTableShow = false;
            this.transactionBasedOnValueTableShow = false;
            this.AllTransactionDetails = data as TransactionDetails[];
            // if (this.AllTransactionDetails.length > 0) {
            this.dataSource = new MatTableDataSource(this.AllTransactionDetails);
            console.log(this.AllTransactionDetails);
            // this.commonFilters = null;
            //  this.commonFilterFormGroup.reset();
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            // }
            this.IsProgressBarVisibile = false;
          },
            (err) => {
              console.log(err);
            });
      }
      else {
        // this.commonFilters = null;
        // this.commonFilterFormGroup.reset();
        this.notificationSnackBarComponent.openSnackBar('It requires at least a field or From Date and To Date', SnackBarStatus.danger);
      }
    }
    Object.keys(this.commonFilterFormGroup.controls).forEach(key => {
      this.commonFilterFormGroup.get(key).markAsTouched();
      this.commonFilterFormGroup.get(key).markAsDirty();
    });
    this.commonFilterFormGroup.reset();
  }
}
