import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { AuthenticationDetails } from 'app/models/authentication_details';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatIconRegistry, MatPaginator, MatTableDataSource, MatSort, MatDatepickerInputEvent } from '@angular/material';
import { Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { fuseAnimations } from '@fuse/animations';
import { ReportService } from 'app/services/report.service';
import { ReportFilters, TransactionReportDetails } from 'app/models/report';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { Guid } from 'guid-typescript';
import { ExcelExtractService } from 'app/services/excelExtract.Service';

@Component({
  selector: 'transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.scss'],
  animations: fuseAnimations
})
export class TransactionReportComponent implements OnInit, OnDestroy {
  AllTransactionReportDetails: TransactionReportDetails[] = [];
  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  SetIntervalID: any;
  reportFormGroup: FormGroup;
  AllVehicleNos: string[] = [];
  reportFilters: ReportFilters;
  diagramShow = true;
  content1Show = false;
  content1ShowName: string;

  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['VEHICLE_NO', 'VENDOR', 'MATERIAL','TRANSACTION_ID','CUSTOMER_ID', 'CUSTOMER_NAME', 'TRANSPORTER_NAME', 'BAY', 'TYPE', 'CUR_STATUS', 'GENTRY_TIME','TIME_OF_ENTRY', 'GEXIT_TIME','TIME_OF_EXIT', 'GATE_TIME', 'PARKING_TIME', 'WEIGHMENT1_TIME', 'LOADING_TIME', 'UNLOADING_TIME', 'WEIGHMENT2_TIME'];
  dataSource: MatTableDataSource<TransactionReportDetails>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    private _router: Router,
    public snackBar: MatSnackBar,
    private _reportService: ReportService,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private excelService: ExcelExtractService
  ) {
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = true;
    this.reportFormGroup = this._formBuilder.group({
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

    this.GetAllTransactionReports();
    this.GetAllVehicleNos();

    this.SetIntervalID = setInterval(() => {
      // this.GetAllTransactionReports();
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
  @ViewChild('TABLE') table: ElementRef;
  exportAsXLSX(): void {
    this.excelService.exportAsExcelOnlyTable(this.table.nativeElement, 'transaction');
  }

  GetAllVehicleNos(): void {
    this._reportService.GetAllVehicleNos(this.authenticationDetails.userID).subscribe((data) => {
      if (data) {
        this.AllVehicleNos = data as string[];
      }
    },
      (err) => {
        console.log(err);
      });
  }

  getDate1(exitDate: string, entryDate: string): any {
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

  getDate(exitDate: string, entryDate: string): any {
    if (exitDate !== '' && entryDate !== '' && exitDate !== null && entryDate !== null) {
      const diff = new Date(exitDate).getTime() - new Date(entryDate).getTime();
      const day = 1000 * 60 * 60 * 24;
      const diffDays = Math.floor(diff / 86400000); // days
      const diffHrs = Math.floor((diff % 86400000) / 3600000); // hours
      const diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); // minutes
      const diffSecs = Math.round(((diff % 86400000) % 3600000) / 60000); // seconds
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

  GetAllTransactionReports(): void {
    this._reportService.GetAllTransactionReports(this.authenticationDetails.userID).subscribe(
      (data) => {
        this.AllTransactionReportDetails = data as TransactionReportDetails[];
        //console.log(this.AllTransactionReportDetails);
        if (this.AllTransactionReportDetails.length > 0) {
          this.AllTransactionReportDetails.forEach(element => {
            element.TIME_OF_ENTRY=element.GENTRY_TIME;
            element.TIME_OF_EXIT=element.GEXIT_TIME;
          });
          this.dataSource = new MatTableDataSource(this.AllTransactionReportDetails);
          console.log(this.AllTransactionReportDetails);
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

  GetAllReportsBasedOnFilter(): void {
    if (this.reportFormGroup.valid) {
      const VEHICLE_NO: string = this.reportFormGroup.get('VEHICLE_NO').value;
      const FROMDATE = this.datePipe.transform(this.reportFormGroup.get('FROMDATE').value as Date, 'yyyy-MM-dd');
      const TODATE = this.datePipe.transform(this.reportFormGroup.get('TODATE').value as Date, 'yyyy-MM-dd');
      const USERID: Guid = this.authenticationDetails.userID;
      this.reportFilters = new ReportFilters();
      this.reportFilters.UserID = USERID;
      this.reportFilters.VEHICLE_NO = VEHICLE_NO;
      this.reportFilters.FROMDATE = FROMDATE;
      this.reportFilters.TODATE = TODATE;
      // tslint:disable-next-line:max-line-length
      if (this.reportFilters.VEHICLE_NO !== '' && this.reportFilters.VEHICLE_NO !== null && this.reportFilters.FROMDATE === '' && this.reportFilters.TODATE === '' || this.reportFilters.FROMDATE === null && this.reportFilters.TODATE === null) {
        // this.authenticationDetails.userID, VEHICLE_NO, FROMDATE, TODATE
        this._reportService.GetAllReportsBasedOnVehicleNoFilter(this.reportFilters)
          .subscribe((data) => {
            this.AllTransactionReportDetails = data as TransactionReportDetails[];
            // if (this.AllTransactionReportDetails.length > 0) {
            this.dataSource = new MatTableDataSource(this.AllTransactionReportDetails);
            console.log(this.AllTransactionReportDetails);
            // this.reportFilters = null;
            // this.reportFormGroup.reset();
            this.dataSource.paginator = this.paginator;
            // this.dataSource.paginator.pageSizeOptions=[10, 20,50, this.AllTransactionReportDetails.length];
            this.dataSource.paginator.pageSize = this.AllTransactionReportDetails.length;
            this.dataSource.sort = this.sort;
            // }
            this.IsProgressBarVisibile = false;
          },
            (err) => {
              console.log(err);
            });
      }
      // tslint:disable-next-line:max-line-length
      else if (this.reportFilters.FROMDATE !== '' && this.reportFilters.TODATE !== '' && this.reportFilters.FROMDATE !== null && this.reportFilters.TODATE !== null && this.reportFilters.VEHICLE_NO === '' || this.reportFilters.VEHICLE_NO === null) {
        // this.authenticationDetails.userID, VEHICLE_NO, FROMDATE, TODATE
        this._reportService.GetAllReportsBasedOnDateFilter(this.reportFilters)
          .subscribe((data) => {
            this.AllTransactionReportDetails = data as TransactionReportDetails[];
            // if (this.AllTransactionReportDetails.length > 0) {
            this.dataSource = new MatTableDataSource(this.AllTransactionReportDetails);
            console.log(this.AllTransactionReportDetails);
            // this.reportFilters = null;
            //  this.reportFormGroup.reset();
            this.dataSource.paginator = this.paginator;
            this.dataSource.paginator = this.paginator;
            // this.dataSource.paginator.pageSizeOptions=[10, 20,50, this.AllTransactionReportDetails.length];
            this.dataSource.paginator.pageSize = this.AllTransactionReportDetails.length;
            this.dataSource.sort = this.sort;
            // }
            this.IsProgressBarVisibile = false;
          },
            (err) => {
              console.log(err);
            });
      }
      else {
        // this.reportFilters = null;
        // this.reportFormGroup.reset();
        this.notificationSnackBarComponent.openSnackBar('It requires at least a field or From Date and To Date', SnackBarStatus.danger);
      }
    }
    Object.keys(this.reportFormGroup.controls).forEach(key => {
      this.reportFormGroup.get(key).markAsTouched();
      this.reportFormGroup.get(key).markAsDirty();
    });
    //this.reportFormGroup.reset();
  }

  clearFromAndToDate(): void {
    this.reportFormGroup.get('FROMDATE').patchValue('');
    this.reportFormGroup.get('TODATE').patchValue('');
  }
  // clearVehicleNo(): void {
  //   this.reportFormGroup.get('VEHICLE_NO').patchValue('');
  // }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.reportFormGroup.get('VEHICLE_NO').patchValue('');
  }
  // loadSelectedReportDetails(value: string): void {
  //   if (value === 'TwentyEmpty') {
  //     // this.diagramShow = false;
  //     this.content1ShowName = '20 Empty';
  //     this.dataSource = null;
  //     // this.content1Show = true;
  //    // this.GetAll20EmptyReports();
  //   }
  //   else if (value === 'FourtyEmpty') {
  //     // this.diagramShow = false;
  //     this.content1ShowName = '40 Empty';
  //     this.dataSource = null;
  //     // this.content1Show = true;
  //    // this.GetAll40EmptyReports();
  //   }
  //   else if (value === 'TwentyFilled') {
  //     // this.diagramShow = false;
  //     this.content1ShowName = '20 Filled';
  //     this.dataSource = null;
  //     // this.content1Show = true;
  //   //  this.GetAll20FilledReports();
  //   }
  //   else if (value === 'FourtyFilled') {
  //     // this.diagramShow = false;
  //     this.content1ShowName = '40 Filled';
  //     this.dataSource = null;
  //     // this.content1Show = true;
  //    // this.GetAll40FilledReports();
  //   }
  //   else if (value === 'TwentyDamagedEmpty') {
  //     // this.diagramShow = false;
  //     this.content1ShowName = '20 Damaged Empty';
  //     this.dataSource = null;
  //     // this.content1Show = true;
  //   //  this.GetAll20DamagedEmptyReports();
  //   }
  //   else if (value === 'FourtyDamagedEmpty') {
  //     // this.diagramShow = false;
  //     this.content1ShowName = '40 Damaged Empty';
  //     this.dataSource = null;
  //     // this.content1Show = true;
  //    // this.GetAll40DamagedEmptyReports();
  //   }
  // }

  // moveSelectedItemDetailsAbove(row: ReportDetails): void {
  //   console.log(row);
  //   this._reportService.moveSelectedItemDetailsAbove(row).subscribe(
  //     (data) => {
  //       this.IsProgressBarVisibile = false;
  //     },
  //     (err) => {      
  //       this.IsProgressBarVisibile = false;
  //       this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //     }
  //   );
  // }

}
