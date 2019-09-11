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
  AllCommonTransactionDetails: TransactionDetails[] = [];
  AllExceptionDetails: ExceptionDetails[] = [];
  AllTransactionDetailsByValue: TransactionDetails[] = [];
  AllVehicleNos: string[] = [];
  SelectedTransactionDeatils: TransactionDetails;
  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  SetIntervalID: any;
  commonFilterFormGroup: FormGroup;
  commonFilters: CommonFilters;

  totalInPremisesCount: number;
  inGateCount: number;
  inParkingCount: number;
  inLoadingCount: number;
  inUnLoadingCount: number;
  inWeighmentCount: number;
  totalTrucksCount: number;
  exceptionTrucksCount: number;
  completedTrucksCount: number;
  inTransistTrucksCount: number;

  tableShow = true;
  diagramShow = false;
  commonTableShow = false;
  commonTableShowName: string;
  stageTableShow = false;
  stageTableShowName: string;
  exceptionTableShow = false;

  tatEqualTwoHrsCount:number;
  tatGreaterTwoLessFourHrsCount:number;
  tatGreaterFourHrsCount:number;

  commmonDisplayedColumns = ['VEHICLE_NO', 'STATUS_DESCRIPTION', 'CUR_STATUS', 'TRUCK_ID', 'TRANSACTION_ID', 'TYPE', 'BAY', 'DRIVER_DETAILS', 'DRIVER_NO', 'TRANSPORTER_NAME', 'CUSTOMER_NAME', 'MATERIAL','GENTRY_DATE', 'GENTRY_TIME'];
  commonDataSource: MatTableDataSource<TransactionDetails>;
  @ViewChild(MatPaginator) commonPaginator: MatPaginator;
  @ViewChild(MatSort) commonSort: MatSort;

  stageDataSource: MatTableDataSource<TransactionDetails>;
  stageDisplayedColumns = ['VEHICLE_NO', 'STATUS_DESCRIPTION', 'CUR_STATUS', 'TRUCK_ID', 'TRANSACTION_ID', 'TYPE', 'BAY', 'DRIVER_DETAILS', 'DRIVER_NO', 'TRANSPORTER_NAME', 'CUSTOMER_NAME', 'MATERIAL','GENTRY_DATE', 'GENTRY_TIME'];
  @ViewChild(MatPaginator) stagePaginator: MatPaginator;
  @ViewChild(MatSort) stageSort: MatSort;

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
    this.GetAllTotalInPremisesDetailsCount(this.authenticationDetails.userID);
    //this.GetAllExceptionDetailsCount(this.authenticationDetails.userID);
    //this.GetAllInTransistDetailsCount(this.authenticationDetails.userID);
    //this.GetAllCompletedDetailsCount(this.authenticationDetails.userID);
    this.GetAllGateEntryDetailsCount(this.authenticationDetails.userID);
    this.GetAllParkingDetailsCount(this.authenticationDetails.userID);
    this.GetAllWeighmentDetailsCount(this.authenticationDetails.userID);
    this.GetAllLoadingDetailsCount(this.authenticationDetails.userID);
    this.GetAllUnLoadingDetailsCount(this.authenticationDetails.userID);
    this.GetAllTransDetailsTATEqualTwoHrsCount(this.authenticationDetails.userID);
    this.GetAllTransDetailsTATGreaterTwoLessFourHrsCount(this.authenticationDetails.userID);
    this.GetAllTransDetailsTATGreaterFourHrsCount(this.authenticationDetails.userID);
    this.SetIntervalID = setInterval(() => {
      this.GetAllTotalInPremisesDetailsCount(this.authenticationDetails.userID);
      // this.GetAllExceptionDetailsCount(this.authenticationDetails.userID);
      // this.GetAllInTransistDetailsCount(this.authenticationDetails.userID);
      // this.GetAllCompletedDetailsCount(this.authenticationDetails.userID);
      this.GetAllGateEntryDetailsCount(this.authenticationDetails.userID);
      this.GetAllParkingDetailsCount(this.authenticationDetails.userID);
      this.GetAllWeighmentDetailsCount(this.authenticationDetails.userID);
      this.GetAllLoadingDetailsCount(this.authenticationDetails.userID);
      this.GetAllUnLoadingDetailsCount(this.authenticationDetails.userID);
      this.GetAllTransDetailsTATEqualTwoHrsCount(this.authenticationDetails.userID);
      this.GetAllTransDetailsTATGreaterTwoLessFourHrsCount(this.authenticationDetails.userID);
      this.GetAllTransDetailsTATGreaterFourHrsCount(this.authenticationDetails.userID);
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
  applyCommonFilter(filterValue: string) {
    this.commonDataSource.filter = filterValue.trim().toLowerCase();
  }

  // tslint:disable-next-line:typedef
  applyStageFilter(filterValue: string) {
    this.stageDataSource.filter = filterValue.trim().toLowerCase();
  }

  goBackToDashboard(): void {
    this.diagramShow = false;
    this.tableShow = true;
  }

  //GET all counts of transactions

  GetAllTransactionDetailsCount(ID: Guid): void {
    this._dashboardService.GetAllTransactionDetailsCount(ID).subscribe(
      (data) => {
        this.totalTrucksCount = data as number;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllTotalInPremisesDetailsCount(ID: Guid): void {
    this._dashboardService.GetAllTotalInPremisesDetailsCount(ID).subscribe(
      (data) => {
        this.totalInPremisesCount = data as number;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllGateEntryDetailsCount(ID: Guid): void {
    this._dashboardService.GetAllGateEntryDetailsCount(ID).subscribe(
      (data) => {
        this.inGateCount = data as number;
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
        this.inParkingCount = data as number;
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
        this.inWeighmentCount = data as number;
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
        this.inLoadingCount = data as number;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllTransDetailsTATEqualTwoHrsCount(ID: Guid): void {
    this._dashboardService.GetAllTransDetailsTATEqualTwoHrsCount(ID).subscribe(
      (data) => {
        this.tatEqualTwoHrsCount = data as number;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllTransDetailsTATGreaterTwoLessFourHrsCount(ID: Guid): void {
    this._dashboardService.GetAllTransDetailsTATGreaterTwoLessFourHrsCount(ID).subscribe(
      (data) => {
        this.tatGreaterTwoLessFourHrsCount = data as number;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllTransDetailsTATGreaterFourHrsCount(ID: Guid): void {
    this._dashboardService.GetAllTransDetailsTATGreaterFourHrsCount(ID).subscribe(
      (data) => {
        this.tatGreaterFourHrsCount = data as number;
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
        this.inUnLoadingCount = data as number;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  //GET all transactions

  GetAllTotalInPremisesDetails(ID: Guid): void {
    this._dashboardService.GetAllTotalInPremisesDetails(ID).subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        this.totalInPremisesCount = this.AllTransactionDetails.length;
        this.commonDataSource = new MatTableDataSource(this.AllTransactionDetails);
        this.commonDataSource.paginator = this.commonPaginator;
        this.commonDataSource.sort = this.commonSort;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllGateEntryDetails(ID: Guid): void {
    this._dashboardService.GetAllGateEntryDetails(ID).subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        this.inGateCount = this.AllTransactionDetails.length;
        this.commonDataSource = new MatTableDataSource(this.AllTransactionDetails);
        this.commonDataSource.paginator = this.commonPaginator;
        this.commonDataSource.sort = this.commonSort;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllParkingDetails(ID: Guid): void {
    this._dashboardService.GetAllParkingDetails(ID).subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        this.inParkingCount = this.AllTransactionDetails.length;
        this.commonDataSource = new MatTableDataSource(this.AllTransactionDetails);
        this.commonDataSource.paginator = this.commonPaginator;
        this.commonDataSource.sort = this.commonSort;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllWeighmentDetails(ID: Guid): void {
    this._dashboardService.GetAllWeighmentDetails(ID).subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        this.inWeighmentCount = this.AllTransactionDetails.length;
        this.commonDataSource = new MatTableDataSource(this.AllTransactionDetails);
        this.commonDataSource.paginator = this.commonPaginator;
        this.commonDataSource.sort = this.commonSort;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllLoadingDetails(ID: Guid): void {
    this._dashboardService.GetAllLoadingDetails(ID).subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        this.inLoadingCount = this.AllTransactionDetails.length;
        this.commonDataSource = new MatTableDataSource(this.AllTransactionDetails);
        this.commonDataSource.paginator = this.commonPaginator;
        this.commonDataSource.sort = this.commonSort;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllUnLoadingDetails(ID: Guid): void {
    this._dashboardService.GetAllUnLoadingDetails(ID).subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        this.inUnLoadingCount = this.AllTransactionDetails.length;
        this.commonDataSource = new MatTableDataSource(this.AllTransactionDetails);
        this.commonDataSource.paginator = this.commonPaginator;
        this.commonDataSource.sort = this.commonSort;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllTransDetailsTATEqualTwoHrs(ID: Guid): void {
    this._dashboardService.GetAllTransDetailsTATEqualTwoHrs(ID).subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        this.tatEqualTwoHrsCount = this.AllTransactionDetails.length;
        this.commonDataSource = new MatTableDataSource(this.AllTransactionDetails);
        this.commonDataSource.paginator = this.commonPaginator;
        this.commonDataSource.sort = this.commonSort;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllTransDetailsTATGreaterTwoLessFourHrs(ID: Guid): void {
    this._dashboardService.GetAllTransDetailsTATGreaterTwoLessFourHrs(ID).subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        this.tatGreaterTwoLessFourHrsCount = this.AllTransactionDetails.length;
        this.commonDataSource = new MatTableDataSource(this.AllTransactionDetails);
        this.commonDataSource.paginator = this.commonPaginator;
        this.commonDataSource.sort = this.commonSort;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllTransDetailsTATGreaterFourHrs(ID: Guid): void {
    this._dashboardService.GetAllTransDetailsTATGreaterFourHrs(ID).subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        this.tatGreaterFourHrsCount = this.AllTransactionDetails.length;
        this.commonDataSource = new MatTableDataSource(this.AllTransactionDetails);
        this.commonDataSource.paginator = this.commonPaginator;
        this.commonDataSource.sort = this.commonSort;
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  loadSelectedTileDetails(tile: string): void {
    if (tile.toLowerCase() === 'totalinpremises') {
      this.diagramShow = true;
      this.tableShow = false;
      this.commonTableShowName = 'Total In Premises';
      this.commonTableShow = true;
      this.stageTableShow = false;
      this.exceptionTableShow = false;
      //this.commonDataSource = null;
      this.GetAllTotalInPremisesDetails(this.authenticationDetails.userID);
    }
    else if (tile.toLowerCase() === 'ingate') {
      this.diagramShow = true;
      this.tableShow = false;
      this.commonTableShowName = 'In Gate';
      this.commonTableShow = true;
      this.stageTableShow = false;
      this.exceptionTableShow = false;
      //this.commonDataSource = null;
      this.GetAllGateEntryDetails(this.authenticationDetails.userID);
    }
    else if (tile.toLowerCase() === 'inparking') {
      this.diagramShow = true;
      this.tableShow = false;
      this.commonTableShowName = 'In Parking';
      this.commonTableShow = true;
      this.stageTableShow = false;
      this.exceptionTableShow = false;
      this.commonDataSource = null;
      this.GetAllParkingDetails(this.authenticationDetails.userID);
    }
    else if (tile.toLowerCase() === 'inweighment') {
      this.diagramShow = true;
      this.tableShow = false;
      this.commonTableShowName = 'In Weighment';
      this.commonTableShow = true;
      this.stageTableShow = false;
      this.exceptionTableShow = false;
      this.commonDataSource = null;
      this.GetAllWeighmentDetails(this.authenticationDetails.userID);
    }
    else if (tile.toLowerCase() === 'inloading') {
      this.diagramShow = true;
      this.tableShow = false;
      this.commonTableShowName = 'In Loading';
      this.commonTableShow = true;
      this.stageTableShow = false;
      this.exceptionTableShow = false;
      this.commonDataSource = null;
      this.GetAllLoadingDetails(this.authenticationDetails.userID);
    }
    else if (tile.toLowerCase() === 'inunloading') {
      this.diagramShow = true;
      this.tableShow = false;
      this.commonTableShowName = 'In UnLoading';
      this.commonTableShow = true;
      this.stageTableShow = false;
      this.exceptionTableShow = false;
      this.commonDataSource = null;
      this.GetAllUnLoadingDetails(this.authenticationDetails.userID);
    }
    else if (tile === 'tatEqualTwoHrs') {
      this.diagramShow = true;
      this.tableShow = false;
      this.commonTableShowName = 'TAT Equal to 2 hrs';
      this.commonTableShow = true;
      this.stageTableShow = false;
      this.exceptionTableShow = false;
      this.commonDataSource = null;
      this.GetAllTransDetailsTATEqualTwoHrs(this.authenticationDetails.userID);
    }
    else if (tile === 'tatGreaterTwoLessFourHrs') {
      this.diagramShow = true;
      this.tableShow = false;
      this.commonTableShowName = 'TAT Greater than 2 and Less than 4 hrs';
      this.commonTableShow = true;
      this.stageTableShow = false;
      this.exceptionTableShow = false;
      this.commonDataSource = null;
      this.GetAllTransDetailsTATGreaterTwoLessFourHrs(this.authenticationDetails.userID);
    }
    else if (tile === 'tatGreaterFourHrs') {
      this.diagramShow = true;
      this.tableShow = false;
      this.commonTableShowName = 'TAT Greater than 4 hrs';
      this.commonTableShow = true;
      this.stageTableShow = false;
      this.exceptionTableShow = false;
      this.commonDataSource = null;
      this.GetAllTransDetailsTATGreaterFourHrs(this.authenticationDetails.userID);
    }
  }

  loadSelectedStageDetails(value: string): void {
    if (value === 'parking') {
      // const onlyParking: any[] = this.AllTransactionDetails.filter(x => x.CUR_STATUS === 'PENTRY');
      // this._router.navigate(['/transaction', value]);
      // console.log(onlyParking);
      this.diagramShow = true;
      this.stageTableShowName = 'Only Parking';
      this.tableShow = false;
      this.stageTableShow = true;
      this.commonTableShow = false;
      this.exceptionTableShow = false;
      this.stageDataSource = null;
      this.GetTransactionDetailsByValue(value, this.authenticationDetails.userID);
    }
    else if (value === 'loading') {
      this.diagramShow = true;
      this.stageTableShowName = 'Only Loading';
      this.tableShow = false;
      this.exceptionTableShow = false;
      this.commonTableShow = false;
      this.stageTableShow = true;
      this.stageDataSource = null;
      this.GetTransactionDetailsByValue(value, this.authenticationDetails.userID);
    }
    else if (value === 'unloading') {
      this.diagramShow = true;
      this.stageTableShowName = 'Only UnLoading';
      this.tableShow = false;
      this.exceptionTableShow = false;
      this.commonTableShow = false;
      this.stageTableShow = true;
      this.stageDataSource = null;
      this.GetTransactionDetailsByValue(value, this.authenticationDetails.userID);
    }
    else if (value === 'weighment') {
      this.diagramShow = true;
      this.stageTableShowName = 'Only Weighment';
      this.tableShow = false;
      this.exceptionTableShow = false;
      this.commonTableShow = false;
      this.stageTableShow = true;
      this.stageDataSource = null;
      this.GetTransactionDetailsByValue(value, this.authenticationDetails.userID);
    }
  }

  GetTransactionDetailsByValue(val: string, ID: Guid): void {
    this._dashboardService.GetTransactionDetailsByValue(val, ID).subscribe(
      (data) => {
        this.AllTransactionDetailsByValue = data as TransactionDetails[];
        this.IsProgressBarVisibile = false;
        this.stageDataSource = new MatTableDataSource(this.AllTransactionDetailsByValue);
        this.stageDataSource.paginator = this.stagePaginator;
        this.stageDataSource.sort = this.stageSort;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
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
            this.commonDataSource = new MatTableDataSource(this.AllTransactionDetails);
            console.log(this.AllTransactionDetails);
            // this.commonFilters = null;
            // this.commonFilterFormGroup.reset();
            this.commonDataSource.paginator = this.commonPaginator;
            this.commonDataSource.sort = this.commonSort;
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
            this.commonTableShowName = 'Filtered Data';
            this.tableShow = false;
            this.commonTableShow = true;
            this.exceptionTableShow = false;
            this.stageTableShow = false;
            this.AllTransactionDetails = data as TransactionDetails[];
            // if (this.AllTransactionDetails.length > 0) {
            this.commonDataSource = new MatTableDataSource(this.AllTransactionDetails);
            console.log(this.AllTransactionDetails);
            // this.commonFilters = null;
            //  this.commonFilterFormGroup.reset();
            this.commonDataSource.paginator = this.commonPaginator;
            this.commonDataSource.sort = this.commonSort;
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
