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

  // [Key]
  // public int TRANS_ID { get; set; }
  // [Required]
  // public string TRUCK_ID { get; set; }
  // [Required]
  // public string VEHICLE_NO { get; set; }
  // public string PLANT { get; set; }
  // public string TYPE { get; set; }
  // public string BAY { get; set; }
  // public string VENDOR { get; set; }
  // public string DRIVER_DETAILS { get; set; }
  // public string DRIVER_NO { get; set; }
  // public string MATERIAL { get; set; }
  // public string TRANSPORTER_NAME { get; set; }
  // public string CUSTOMER_NAME { get; set; }
  // public string FG_DESCRIPTION { get; set; }
  // public string LINE_NUMBER { get; set; }
  // public string STATUS { get; set; }
  // public DateTime? GENTRY_TIME { get; set; }
  // public DateTime? PENTRY_TIME { get; set; }
  // public DateTime? PEXIT_TIME { get; set; }
  // public DateTime? W1ENTRY_TIME { get; set; }
  // public DateTime? W1EXIT_TIME { get; set; }
  // public DateTime? LENTRY_TIME { get; set; }
  // public DateTime? LEXIT_TIME { get; set; }
  // public DateTime? ULENTRY_TIME { get; set; }
  // public DateTime? ULEXIT_TIME { get; set; }
  // public DateTime? W2ENTRY_TIME { get; set; }
  // public DateTime? W2EXIT_TIME { get; set; }
  // public DateTime? GEXIT_TIME { get; set; }
  // public DateTime? SECONDTRANS_LENTRY_TIME { get; set; }
  // public DateTime? SECONDTRANS_LEXIT_TIME { get; set; }
  // public DateTime? SECONDTRANS_W3ENTRY_TIME { get; set; }
  // public DateTime? SECONDTRANS_W3EXIT_TIME { get; set; }
  // public string PRE_STATUS { get; set; }
  // public string CUR_STATUS { get; set; }
  // public string PRE_STATION_ID { get; set; }
  // public string CUR_STATION_ID { get; set; }
  // public string FLAG { get; set; }
  // public bool ISACTIVE { get; set; }
  // public string VEHICLE_OWNER_TYPE { get; set; }
  // public bool ISEXCEPTION { get; set; }
  // public string EXCEPTION_MESSAGE { get; set; }
  // public string CUSTOMER_ID { get; set; }
  // public DateTime? PEXIT_TIME_MODIFIED { get; set; }
  // public string TRANSACTION_ID { get; set; }
  // public DateTime? LEXIT_TIME_MODIFIED { get; set; }
  // public DateTime? ULEXIT_TIME_MODIFIED { get; set; }
  // public DateTime? W1EXIT_TIME_MODIFIED { get; set; }
  // public DateTime? W2EXIT_TIME_MODIFIED { get; set; }
  // TOTAL_GATE_DURATION: string;
  // TOTAL_PARKING_DURATION: string;
  // TOTAL_LOADING_DURATION: string;
  // TOTAL_UNLOADING_DURATION: string;
  // TOTAL_WEIGHMENT1_DURATION: string;
  // TOTAL_WEIGHMENT2_DURATION: string;
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['VEHICLE_NO', 'TYPE','REFERENCE' ,'TRANSPORTER_NAME', 'CUSTOMER_NAME', 'MATERIAL',
    'BAY', 'CUR_STATUS', 'TOTAL_GATE_DURATION', 'TOTAL_PARKING_DURATION', 'ATL_ASSIGN_DURATION', 'BAY_ASSIGN_DURATION',
    'TOTAL_WEIGHMENT1_DURATION', 'TOTAL_LOADING_DURATION', 'TOTAL_UNLOADING_DURATION', 'TOTAL_WEIGHMENT2_DURATION',
    'WEIGHMENT2_GEXIT_DURATION', 'GENTRY_DATE', 'GENTRY_TIME', 'ATL_ASSIGN_DATE', 'ATL_ASSIGN_TIME',
    'BAY_ASSIGN_DATE', 'BAY_ASSIGN_TIME', 'TOTAL_GENTRY_ATLASSIGN_TIME_HMS', 'TOTAL_GENTRY_BAYASSIGN_TIME_HMS',
    'PENTRY_DATE', 'PENTRY_TIME', 'PEXIT_DATE', 'PEXIT_TIME', 'TOTAL_PARKING_TIME_HMS',
    'W1ENTRY_DATE', 'W1ENTRY_TIME', 'W1EXIT_DATE', 'W1EXIT_TIME', 'TOTAL_WEIGHMENT1_TIME_HMS',
    'LENTRY_DATE', 'LENTRY_TIME', 'LEXIT_DATE', 'LEXIT_TIME', 'TOTAL_LOADING_TIME_HMS',
    'ULENTRY_DATE', 'ULENTRY_TIME', 'ULEXIT_DATE', 'ULEXIT_TIME', 'TOTAL_UNLOADING_TIME_HMS',
    'W2ENTRY_DATE', 'W2ENTRY_TIME', 'W2EXIT_DATE', 'W2EXIT_TIME', 'TOTAL_WEIGHMENT2_TIME_HMS',
    'TOTAL_WEIGHMENT2GEXIT_TIME_HMS', 'GEXIT_DATE', 'GEXIT_TIME', 'TOTAL_GATE_TIME_HMS',
    'TRANSACTION_ID', 'CUSTOMER_ID', 'VENDOR', 'TRUCK_ID','REMARKS', 'EXCEPTION_MESSAGE'];
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

  getTimeInSentence(exitDate: string, entryDate: string): any {
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

  getDate11(exitDate: string, entryDate: string): any {
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

  getTimeInHMSFormat(exitDate: any, entryDate: any): any {
    if (exitDate !== '' && entryDate !== '' && exitDate !== null && entryDate !== null) {
      const res = Math.abs(new Date(exitDate).getTime() - new Date(entryDate).getTime()) / 1000;
      //console.log(res);
      // get total days between two dates
      const diffDays = Math.round(Math.floor(res / 86400));
      //console.log("Difference (Days): "+diffDays);                        
      var diffHrs = 0;
      if (diffDays) {
        diffHrs = Math.round(Math.floor(res / 3600) % 24);
        diffHrs = diffHrs + (diffDays * 24);
      }
      else {
        // get hours        
        diffHrs = Math.round(Math.floor(res / 3600) % 24);
        //console.log("Difference (Hours): "+diffHrs);  
      }
      // get minutes
      const diffMins = Math.round(Math.floor(res / 60) % 60);
      //console.log("Difference (Minutes): "+diffMins);  

      // get seconds
      const diffSeconds = Math.round(res % 60);
      //console.log("Difference (Seconds): "+diffSeconds);  
      if (diffMins !== 0 && diffHrs !== 0 && diffSeconds !== 0) {
        return diffHrs + ':' + diffMins + ':' + diffSeconds;
      }
      // else if (diffDays === 0 && diffMins !== 0 && diffHrs !== 0) {
      //   return diffHrs + ' hr ' + diffMins + ' min';
      // }
      // else if (diffDays !== 0 && diffMins === 0 && diffHrs !== 0) {
      //   return diffDays + ' dy ' + diffHrs + ' hr ';
      // }
      // else if (diffDays !== 0 && diffMins !== 0 && diffHrs === 0) {
      //   return diffDays + ' dy ' + diffMins + ' min';
      // }
      // else if (diffDays === 0 && diffMins !== 0 && diffHrs === 0) {
      //   return diffMins + ' min';
      // }
      // else if (diffDays === 0 && diffMins === 0 && diffHrs !== 0) {
      //   return diffHrs + ' hr ';
      // }
      // else if (diffDays !== 0 && diffMins === 0 && diffHrs === 0) {
      //   return diffDays + ' dy ';
      // }
      else if (diffMins === 0 && diffHrs === 0 && diffSeconds === 0) {
        return ' - ';
      }
      else {
        return diffHrs + ':' + diffMins + ':' + diffSeconds;
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
            element.GENTRY_DATE = element.GENTRY_TIME;
            element.GEXIT_DATE = element.GEXIT_TIME;
            element.PENTRY_DATE = element.PENTRY_TIME;
            element.PEXIT_DATE = element.PEXIT_TIME;
            element.LENTRY_DATE = element.LENTRY_TIME;
            element.LEXIT_DATE = element.LEXIT_TIME;
            element.ULENTRY_DATE = element.ULENTRY_TIME;
            element.ULEXIT_DATE = element.ULEXIT_TIME;
            element.W1ENTRY_DATE = element.W1ENTRY_TIME;
            element.W1EXIT_DATE = element.W1EXIT_TIME;
            element.W2ENTRY_DATE = element.W2ENTRY_TIME;
            element.W2EXIT_DATE = element.W2EXIT_TIME;

            // if (element.GEXIT_TIME && element.GENTRY_TIME && element.GEXIT_TIME != null && element.GENTRY_TIME != null) {
            //   element.TOTAL_GATE_DURATION = this.getTimeInSentence(element.GEXIT_TIME.toString(), element.GENTRY_TIME.toString());
            // }
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
            if (this.AllTransactionReportDetails.length > 0) {
              this.AllTransactionReportDetails.forEach(element => {
                element.GENTRY_DATE = element.GENTRY_TIME;
                element.GEXIT_DATE = element.GEXIT_TIME;
                element.PENTRY_DATE = element.PENTRY_TIME;
                element.PEXIT_DATE = element.PEXIT_TIME;
                element.LENTRY_DATE = element.LENTRY_TIME;
                element.LEXIT_DATE = element.LEXIT_TIME;
                element.ULENTRY_DATE = element.ULENTRY_TIME;
                element.ULEXIT_DATE = element.ULEXIT_TIME;
                element.W1ENTRY_DATE = element.W1ENTRY_TIME;
                element.W1EXIT_DATE = element.W1EXIT_TIME;
                element.W2ENTRY_DATE = element.W2ENTRY_TIME;
                element.W2EXIT_DATE = element.W2EXIT_TIME;
                // if (element.GEXIT_TIME && element.GENTRY_TIME && element.GEXIT_TIME != null && element.GENTRY_TIME != null) {
                //   element.TOTAL_GATE_DURATION = this.getTimeInSentence(element.GEXIT_TIME.toString(), element.GENTRY_TIME.toString());
                // }
              });
            }
            this.dataSource = new MatTableDataSource(this.AllTransactionReportDetails);
            //console.log(this.AllTransactionReportDetails);
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
            if (this.AllTransactionReportDetails.length > 0) {
              this.AllTransactionReportDetails.forEach(element => {
                element.GENTRY_DATE = element.GENTRY_TIME;
                element.GEXIT_DATE = element.GEXIT_TIME;
                element.PENTRY_DATE = element.PENTRY_TIME;
                element.PEXIT_DATE = element.PEXIT_TIME;
                element.LENTRY_DATE = element.LENTRY_TIME;
                element.LEXIT_DATE = element.LEXIT_TIME;
                element.ULENTRY_DATE = element.ULENTRY_TIME;
                element.ULEXIT_DATE = element.ULEXIT_TIME;
                element.W1ENTRY_DATE = element.W1ENTRY_TIME;
                element.W1EXIT_DATE = element.W1EXIT_TIME;
                element.W2ENTRY_DATE = element.W2ENTRY_TIME;
                element.W2EXIT_DATE = element.W2EXIT_TIME;
                // if (element.GEXIT_TIME && element.GENTRY_TIME && element.GEXIT_TIME != null && element.GENTRY_TIME != null) {
                //   element.TOTAL_GATE_DURATION = this.getTimeInSentence(element.GEXIT_TIME.toString(), element.GENTRY_TIME.toString());
                // }
              });
            }
            this.dataSource = new MatTableDataSource(this.AllTransactionReportDetails);
           // console.log(this.AllTransactionReportDetails);
            // this.reportFilters = null;
            //  this.reportFormGroup.reset();
            this.dataSource.paginator = this.paginator;
            // this.dataSource.paginator.pageSizeOptions=[10, 20,50, this.AllTransactionReportDetails.length];
            this.dataSource.paginator.pageSize = this.AllTransactionReportDetails.length;
            this.dataSource.sort = this.sort;
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
