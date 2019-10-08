import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { AuthenticationDetails } from 'app/models/authentication-details';
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
import { ExcelExtractService } from 'app/services/excel-extract.service';

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
  displayedColumns: string[] = ['VEHICLE_NO', 'TYPE', 'TRANSPORTER_NAME', 'CUSTOMER_NAME', 'MATERIAL', 'FG_DESCRIPTION',
    'BAY', 'CUR_STATUS', 'TOTAL_GATE_DURATION', 'TOTAL_PARKING_DURATION', 'ATL_ASSIGN_DURATION', 'BAY_ASSIGN_DURATION',
    'TOTAL_WEIGHMENT1_DURATION', 'TOTAL_LOADING_DURATION', 'TOTAL_UNLOADING_DURATION', 'TOTAL_WEIGHMENT2_DURATION',
    'WEIGHMENT2_GEXIT_DURATION', 'GENTRY_DATE_ONLY', 'GENTRY_TIME_ONLY', 'ATL_ASSIGN_DATE', 'ATL_ASSIGN_TIME',
    'BAY_ASSIGN_DATE', 'BAY_ASSIGN_TIME', 'TOTAL_GENTRY_ATLASSIGN_TIME_HMS', 'TOTAL_ATL_BAYASSIGN_TIME_HMS',
    'PENTRY_DATE_ONLY', 'PENTRY_TIME_ONLY', 'PEXIT_DATE_ONLY', 'PEXIT_TIME_ONLY', 'TOTAL_PARKING_TIME_HMS',
    'W1ENTRY_DATE_ONLY', 'W1ENTRY_TIME_ONLY', 'W1EXIT_DATE_ONLY', 'W1EXIT_TIME_ONLY', 'TOTAL_WEIGHMENT1_TIME_HMS',
    'LENTRY_DATE_ONLY', 'LENTRY_TIME_ONLY', 'LEXIT_DATE_ONLY', 'LEXIT_TIME_ONLY', 'TOTAL_LOADING_TIME_HMS',
    'ULENTRY_DATE_ONLY', 'ULENTRY_TIME_ONLY', 'ULEXIT_DATE_ONLY', 'ULEXIT_TIME_ONLY', 'TOTAL_UNLOADING_TIME_HMS',
    'W2ENTRY_DATE_ONLY', 'W2ENTRY_TIME_ONLY', 'W2EXIT_DATE_ONLY', 'W2EXIT_TIME_ONLY', 'TOTAL_WEIGHMENT2_TIME_HMS',
    'TOTAL_WEIGHMENT2GEXIT_TIME_HMS', 'GEXIT_DATE_ONLY', 'GEXIT_TIME_ONLY', 'TOTAL_GATE_TIME_HMS',
    'TRANSACTION_ID', 'CUSTOMER_ID', 'VENDOR', 'TRUCK_ID', 'REMARKS', 'EXCEPTION_MESSAGE'];
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

    this.GetAllTransactionReportsLast100();
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

  ExportTransactionReportToExcel(): void {
    const startIndex: number = this.paginator.pageSize * this.paginator.pageIndex;
    const endIndex: number = this.paginator.pageSize + startIndex;
    let array: TransactionReportDetails[] = [];
    const ExcelArray: any[] = [];
    if (this.dataSource.filteredData.length) {
      array = this.dataSource.filteredData;
    } else {
      array = this.dataSource.data;
    }
    const itemsShowed1 = array.slice(startIndex, endIndex);
    itemsShowed1.forEach(x => {
      ExcelArray.push(
        {
          'Vehicle No.': x.VEHICLE_NO, 'Type': x.TYPE, 'Transporter Name': x.TRANSPORTER_NAME,
          'Customer Name': x.CUSTOMER_NAME, 'Delivery Number': x.MATERIAL, 'Material Description': x.FG_DESCRIPTION, 'Bay': x.BAY,
          'Current Status': x.CUR_STATUS, 'Total Gate Duration': x.TOTAL_GATE_DURATION,
          'Parking Duration': x.TOTAL_PARKING_DURATION, 'ATL Assignment Duration': x.ATL_ASSIGN_DURATION,
          'Bay Assignment Duration': x.BAY_ASSIGN_DURATION, 'Weighment1 Duration': x.TOTAL_WEIGHMENT1_DURATION,
          'Loading Duration': x.TOTAL_LOADING_DURATION, 'Total UnLoading Duration': x.TOTAL_UNLOADING_DURATION,
          'Total Weighment2 Duration': x.TOTAL_WEIGHMENT2_DURATION, 'Weighment2 to Gate Exit Duration': x.WEIGHMENT2_GEXIT_DURATION,
          'Entry Date': x.GENTRY_DATE_ONLY, 'Entry Time': x.GENTRY_TIME_ONLY,
          'ATL Assigned Date': x.ATL_ASSIGN_DATE, 'ATL Assigned Time': x.ATL_ASSIGN_TIME,
          'Bay Assigned Date': x.BAY_ASSIGN_DATE, 'Bay Assigned Time': x.BAY_ASSIGN_TIME,
          'Gate Entry to ATL Assignment duration hrs': x.TOTAL_GENTRY_ATLASSIGN_TIME_HMS,
          'ATL to Bay Assignment duration hrs': x.TOTAL_ATL_BAYASSIGN_TIME_HMS,
          'Parking In Date': x.PENTRY_DATE_ONLY, 'Parking In Time': x.PENTRY_TIME_ONLY,
          'Parking Exit Date': x.PEXIT_DATE_ONLY, 'Parking Exit Time': x.PEXIT_TIME_ONLY,
          'Parking Time': x.TOTAL_PARKING_TIME_HMS,
          'Weighment1 In Date': x.W1ENTRY_DATE_ONLY, 'Weighment1 In Time': x.W1ENTRY_TIME_ONLY,
          'Weighment1 Exit Date': x.W1EXIT_DATE_ONLY, 'Weighment1 Exit Time': x.W1EXIT_TIME_ONLY,
          'Weighment1 Time': x.TOTAL_WEIGHMENT1_TIME_HMS,
          'Loading In Date': x.LENTRY_DATE_ONLY, 'Loading In Time': x.LENTRY_TIME_ONLY,
          'Loading Exit Date': x.LEXIT_DATE_ONLY, 'Loading Exit Time': x.LEXIT_TIME_ONLY,
          'Loading Time': x.TOTAL_LOADING_TIME_HMS,
          'UnLoading In Date': x.ULENTRY_DATE_ONLY, 'UnLoading In Time': x.ULENTRY_TIME_ONLY,
          'UnLoading Exit Date': x.ULEXIT_DATE_ONLY, 'UnLoading Exit Time': x.ULEXIT_TIME_ONLY,
          'UnLoading Time': x.TOTAL_UNLOADING_TIME_HMS,
          'Weighment2 In Date': x.W2ENTRY_DATE_ONLY, 'Weighment2 In Time': x.W2ENTRY_TIME_ONLY,
          'Weighment2 Exit Date': x.W2EXIT_DATE_ONLY, 'Weighment2 Exit Time': x.W2EXIT_TIME_ONLY,
          'Weighment2 Time': x.TOTAL_WEIGHMENT2_TIME_HMS,
          'Weighment2 to Gate Exit Duration hrs': x.TOTAL_WEIGHMENT2GEXIT_TIME_HMS,
          'Exit Date': x.GEXIT_DATE_ONLY, 'Exit Time': x.GEXIT_TIME_ONLY,
          'Gate Time': x.TOTAL_GATE_TIME_HMS,
          'Transaction Id': x.TRANSACTION_ID, 'Customer Id': x.CUSTOMER_ID,
          'Vendor': x.VENDOR, 'BLE Number': x.TRUCK_ID,
          'Remarks': x.REMARKS, 'Exception Message': x.EXCEPTION_MESSAGE,
        });
    });
    if (ExcelArray.length > 0) {
      this.excelService.exportAsExcelFile(ExcelArray, 'transaction');
    } else {
      this.notificationSnackBarComponent.openSnackBar('No records found', SnackBarStatus.warning);
    }
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
      if (Math.sign(diff) == -1 || Math.sign(diff) == -0) {
        return '-';
      }
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
      var diffHrs1 = diffHrs.toString();
      var diffMins1 = diffMins.toString();
      var diffSeconds1 = diffSeconds.toString();
      if (diffHrs1.length === 1) {
        diffHrs1 = '0' + diffHrs1
      }
      if (diffMins1.length === 1) {
        diffMins1 = '0' + diffMins1
      }
      if (diffSeconds1.length === 1) {
        diffSeconds1 = '0' + diffSeconds1
      }

      if (diffHrs1 !== '' && diffMins1 !== '' && diffSeconds1 !== '') {
        return diffHrs1 + ':' + diffMins1 + ':' + diffSeconds1;
      }
      else if (diffHrs1 === '' && diffMins1 !== '' && diffSeconds1 !== '') {
        return '00' + ':' + diffMins1 + ':' + diffSeconds1;
      }
      else if (diffHrs1 !== '' && diffMins1 === '' && diffSeconds1 !== '') {
        return diffHrs1 + ':' + '00' + ':' + diffSeconds1;
      }
      else if (diffHrs1 !== '' && diffMins1 !== '' && diffSeconds1 === '') {
        return diffHrs1 + ':' + diffMins1 + ':' + '00';
      }
      else if (diffHrs1 === '' && diffMins1 === '' && diffSeconds1 !== '') {
        return '00' + ':' + '00' + ':' + diffSeconds1;
      }
      else if (diffHrs1 !== '' && diffMins1 === '' && diffSeconds1 === '') {
        return diffHrs1 + ':' + '00' + ':' + '00';
      }
      else if (diffHrs1 === '' && diffMins1 !== '' && diffSeconds1 === '') {
        return '00' + ':' + diffMins1 + ':' + '00';
      }
      else if (diffMins1 === '00' && diffHrs1 === '00' && diffSeconds1 === '00') {
        return '00' + ':' + '00' + ':' + '00';
      }
    }
    else {
      return '-';
    }
  }

  GetAllTransactionReportsLast100(): void {
    this._reportService.GetAllTransactionReportsLast100(this.authenticationDetails.userID).subscribe(
      (data) => {
        this.AllTransactionReportDetails = data as TransactionReportDetails[];
        //console.log(this.AllTransactionReportDetails);
        if (this.AllTransactionReportDetails.length > 0) {
          this.AllTransactionReportDetails.forEach(element => {
            element.TYPE = element.TYPE == 'L' ? 'Loading' :
              element.TYPE == 'UL' ? 'Unloading' : element.TYPE == 'ULL' ? 'Unloading And Loading' : '';
            element.CUR_STATUS = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' :
              element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' :
                element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' :
                  element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' :
                    element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' :
                      element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' :
                        element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';

            element.GENTRY_TIME_ONLY = this.datePipe.transform(element.GENTRY_TIME, 'hh:mm:ss a');
            element.GENTRY_DATE_ONLY = this.datePipe.transform(element.GENTRY_TIME, 'dd-MM-yyyy');
            element.GEXIT_TIME_ONLY = this.datePipe.transform(element.GEXIT_TIME, 'hh:mm:ss a');
            element.GEXIT_DATE_ONLY = this.datePipe.transform(element.GEXIT_TIME, 'dd-MM-yyyy');
            if (element.GEXIT_TIME && element.GENTRY_TIME && element.GEXIT_TIME != null && element.GENTRY_TIME != null) {
              element.TOTAL_GATE_DURATION = this.getTimeInSentence(element.GEXIT_TIME.toString(), element.GENTRY_TIME.toString());
              element.TOTAL_GATE_TIME_HMS = this.getTimeInHMSFormat(element.GEXIT_TIME.toString(), element.GENTRY_TIME.toString());
            }
            element.PENTRY_TIME_ONLY = this.datePipe.transform(element.PENTRY_TIME, 'hh:mm:ss a');
            element.PENTRY_DATE_ONLY = this.datePipe.transform(element.PENTRY_TIME, 'dd-MM-yyyy');
            element.PEXIT_TIME_ONLY = this.datePipe.transform(element.PEXIT_TIME, 'hh:mm:ss a');
            element.PEXIT_DATE_ONLY = this.datePipe.transform(element.PEXIT_TIME, 'dd-MM-yyyy');
            if (element.PEXIT_TIME && element.PENTRY_TIME && element.PEXIT_TIME != null && element.PENTRY_TIME != null) {
              element.TOTAL_PARKING_DURATION = this.getTimeInSentence(element.PEXIT_TIME.toString(), element.PENTRY_TIME.toString());
              element.TOTAL_PARKING_TIME_HMS = this.getTimeInHMSFormat(element.PEXIT_TIME.toString(), element.PENTRY_TIME.toString());
            }
            element.W1ENTRY_TIME_ONLY = this.datePipe.transform(element.W1ENTRY_TIME, 'hh:mm:ss a');
            element.W1ENTRY_DATE_ONLY = this.datePipe.transform(element.W1ENTRY_TIME, 'dd-MM-yyyy');
            element.W1EXIT_TIME_ONLY = this.datePipe.transform(element.W1EXIT_TIME, 'hh:mm:ss a');
            element.W1EXIT_DATE_ONLY = this.datePipe.transform(element.W1EXIT_TIME, 'dd-MM-yyyy');
            if (element.W1EXIT_TIME && element.W1ENTRY_TIME && element.W1EXIT_TIME != null && element.W1ENTRY_TIME != null) {
              element.TOTAL_WEIGHMENT1_DURATION = this.getTimeInSentence(element.W1EXIT_TIME.toString(), element.W1ENTRY_TIME.toString());
              element.TOTAL_WEIGHMENT1_TIME_HMS = this.getTimeInHMSFormat(element.W1EXIT_TIME.toString(), element.W1ENTRY_TIME.toString());
            }
            element.LENTRY_TIME_ONLY = this.datePipe.transform(element.LENTRY_TIME, 'hh:mm:ss a');
            element.LENTRY_DATE_ONLY = this.datePipe.transform(element.LENTRY_TIME, 'dd-MM-yyyy');
            element.LEXIT_TIME_ONLY = this.datePipe.transform(element.LEXIT_TIME, 'hh:mm:ss a');
            element.LEXIT_DATE_ONLY = this.datePipe.transform(element.LEXIT_TIME, 'dd-MM-yyyy');
            if (element.LEXIT_TIME && element.LENTRY_TIME && element.LEXIT_TIME != null && element.LENTRY_TIME != null) {
              element.TOTAL_LOADING_DURATION = this.getTimeInSentence(element.LEXIT_TIME.toString(), element.LENTRY_TIME.toString());
              element.TOTAL_LOADING_TIME_HMS = this.getTimeInHMSFormat(element.LEXIT_TIME.toString(), element.LENTRY_TIME.toString());

            }
            element.ULENTRY_TIME_ONLY = this.datePipe.transform(element.ULENTRY_TIME, 'hh:mm:ss a');
            element.ULENTRY_DATE_ONLY = this.datePipe.transform(element.ULENTRY_TIME, 'dd-MM-yyyy');
            element.ULEXIT_TIME_ONLY = this.datePipe.transform(element.ULEXIT_TIME, 'hh:mm:ss a');
            element.ULEXIT_DATE_ONLY = this.datePipe.transform(element.ULEXIT_TIME, 'dd-MM-yyyy');
            if (element.ULEXIT_TIME && element.ULENTRY_TIME && element.ULEXIT_TIME != null && element.ULENTRY_TIME != null) {
              element.TOTAL_UNLOADING_DURATION = this.getTimeInSentence(element.ULEXIT_TIME.toString(), element.ULENTRY_TIME.toString());
              element.TOTAL_UNLOADING_TIME_HMS = this.getTimeInHMSFormat(element.ULEXIT_TIME.toString(), element.ULENTRY_TIME.toString());

            }
            element.W2ENTRY_TIME_ONLY = this.datePipe.transform(element.W2ENTRY_TIME, 'hh:mm:ss a');
            element.W2ENTRY_DATE_ONLY = this.datePipe.transform(element.W2ENTRY_TIME, 'dd-MM-yyyy');
            element.W2EXIT_TIME_ONLY = this.datePipe.transform(element.W2EXIT_TIME, 'hh:mm:ss a');
            element.W2EXIT_DATE_ONLY = this.datePipe.transform(element.W2EXIT_TIME, 'dd-MM-yyyy');
            if (element.W2EXIT_TIME && element.W2ENTRY_TIME && element.W2EXIT_TIME != null && element.W2ENTRY_TIME != null) {
              element.TOTAL_WEIGHMENT2_DURATION = this.getTimeInSentence(element.W2EXIT_TIME.toString(), element.W2ENTRY_TIME.toString());
              element.TOTAL_WEIGHMENT2_TIME_HMS = this.getTimeInHMSFormat(element.W2EXIT_TIME.toString(), element.W2ENTRY_TIME.toString());

            }
            if (element.GEXIT_TIME && element.W2ENTRY_TIME && element.GEXIT_TIME != null && element.W2ENTRY_TIME != null) {
              element.WEIGHMENT2_GEXIT_DURATION = this.getTimeInSentence(element.GEXIT_TIME.toString(), element.W2ENTRY_TIME.toString());
              element.TOTAL_WEIGHMENT2GEXIT_TIME_HMS = this.getTimeInHMSFormat(element.GEXIT_TIME.toString(), element.W2ENTRY_TIME.toString());
            }

            if (element.ATL_ASSIGN_DATE != '' && element.ATL_ASSIGN_DATE != null) {
              var date = new Date(element.ATL_ASSIGN_DATE);
              element.ATL_ASSIGN_DATE = this.datePipe.transform(date, 'dd-MM-yyyy');
            }
            if (element.BAY_ASSIGN_DATE != '' && element.BAY_ASSIGN_DATE != null) {
              var date1 = new Date(element.BAY_ASSIGN_DATE);
              element.BAY_ASSIGN_DATE = this.datePipe.transform(date1, 'dd-MM-yyyy');
            }
            if (element.GENTRY_TIME && element.ATL_ASSIGN_TIME && element.GENTRY_TIME != null && element.ATL_ASSIGN_TIME != null) {
              //element.ATL_ASSIGN_DURATION = this.getTimeInSentence(element.ATL_ASSIGN_TIME.toString(), element.GENTRY_TIME.toString());
              var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
              var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
              element.TOTAL_GENTRY_ATLASSIGN_TIME_HMS = this.getTimeInHMSFormat(date11.toString(), element.GENTRY_TIME.toString());
            }

            if (element.BAY_ASSIGN_TIME && element.ATL_ASSIGN_TIME && element.BAY_ASSIGN_TIME != null && element.ATL_ASSIGN_TIME != null) {
              //element.BAY_ASSIGN_DURATION = this.getTimeInSentence(element.BAY_ASSIGN_TIME.toString(), element.ATL_ASSIGN_TIME.toString());
              var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
              var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
              var newDate1 = this.datePipe.transform(element.BAY_ASSIGN_DATE, 'dd-MM-yyyy')
              var date111 = new Date(newDate1 + " " + element.BAY_ASSIGN_TIME);
              element.TOTAL_ATL_BAYASSIGN_TIME_HMS = this.getTimeInHMSFormat(date111, date11);
            }
            if (element.GENTRY_TIME && element.ATL_ASSIGN_TIME && element.GENTRY_TIME != null && element.ATL_ASSIGN_TIME != null) {
              //element.ATL_ASSIGN_DURATION = this.getTimeInSentence(element.ATL_ASSIGN_TIME.toString(), element.GENTRY_TIME.toString());
              var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
              var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
              element.ATL_ASSIGN_DURATION = this.getTimeInSentence(date11.toString(), element.GENTRY_TIME.toString());
            }

            if (element.BAY_ASSIGN_TIME && element.ATL_ASSIGN_TIME && element.BAY_ASSIGN_TIME != null && element.ATL_ASSIGN_TIME != null) {
              //element.BAY_ASSIGN_DURATION = this.getTimeInSentence(element.BAY_ASSIGN_TIME.toString(), element.ATL_ASSIGN_TIME.toString());
              var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
              var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
              var newDate1 = this.datePipe.transform(element.BAY_ASSIGN_DATE, 'dd-MM-yyyy')
              var date111 = new Date(newDate1 + " " + element.BAY_ASSIGN_TIME);
              element.BAY_ASSIGN_DURATION = this.getTimeInSentence(date111.toString(), date11.toString());
            }
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

  GetAllTransactionReports(): void {
    this._reportService.GetAllTransactionReports(this.authenticationDetails.userID).subscribe(
      (data) => {
        this.AllTransactionReportDetails = data as TransactionReportDetails[];
        //console.log(this.AllTransactionReportDetails);
        if (this.AllTransactionReportDetails.length > 0) {
          this.AllTransactionReportDetails.forEach(element => {
            element.TYPE = element.TYPE == 'L' ? 'Loading' :
              element.TYPE == 'UL' ? 'Unloading' : element.TYPE == 'ULL' ? 'Unloading And Loading' : '';
            element.CUR_STATUS = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' :
              element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' :
                element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' :
                  element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' :
                    element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' :
                      element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' :
                        element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';

            element.GENTRY_TIME_ONLY = this.datePipe.transform(element.GENTRY_TIME, 'hh:mm:ss a');
            element.GENTRY_DATE_ONLY = this.datePipe.transform(element.GENTRY_TIME, 'dd-MM-yyyy');
            element.GEXIT_TIME_ONLY = this.datePipe.transform(element.GEXIT_TIME, 'hh:mm:ss a');
            element.GEXIT_DATE_ONLY = this.datePipe.transform(element.GEXIT_TIME, 'dd-MM-yyyy');
            if (element.GEXIT_TIME && element.GENTRY_TIME && element.GEXIT_TIME != null && element.GENTRY_TIME != null) {
              element.TOTAL_GATE_DURATION = this.getTimeInSentence(element.GEXIT_TIME.toString(), element.GENTRY_TIME.toString());
              element.TOTAL_GATE_TIME_HMS = this.getTimeInHMSFormat(element.GEXIT_TIME.toString(), element.GENTRY_TIME.toString());
            }
            element.PENTRY_TIME_ONLY = this.datePipe.transform(element.PENTRY_TIME, 'hh:mm:ss a');
            element.PENTRY_DATE_ONLY = this.datePipe.transform(element.PENTRY_TIME, 'dd-MM-yyyy');
            element.PEXIT_TIME_ONLY = this.datePipe.transform(element.PEXIT_TIME, 'hh:mm:ss a');
            element.PEXIT_DATE_ONLY = this.datePipe.transform(element.PEXIT_TIME, 'dd-MM-yyyy');
            if (element.PEXIT_TIME && element.PENTRY_TIME && element.PEXIT_TIME != null && element.PENTRY_TIME != null) {
              element.TOTAL_PARKING_DURATION = this.getTimeInSentence(element.PEXIT_TIME.toString(), element.PENTRY_TIME.toString());
              element.TOTAL_PARKING_TIME_HMS = this.getTimeInHMSFormat(element.PEXIT_TIME.toString(), element.PENTRY_TIME.toString());
            }
            element.W1ENTRY_TIME_ONLY = this.datePipe.transform(element.W1ENTRY_TIME, 'hh:mm:ss a');
            element.W1ENTRY_DATE_ONLY = this.datePipe.transform(element.W1ENTRY_TIME, 'dd-MM-yyyy');
            element.W1EXIT_TIME_ONLY = this.datePipe.transform(element.W1EXIT_TIME, 'hh:mm:ss a');
            element.W1EXIT_DATE_ONLY = this.datePipe.transform(element.W1EXIT_TIME, 'dd-MM-yyyy');
            if (element.W1EXIT_TIME && element.W1ENTRY_TIME && element.W1EXIT_TIME != null && element.W1ENTRY_TIME != null) {
              element.TOTAL_WEIGHMENT1_DURATION = this.getTimeInSentence(element.W1EXIT_TIME.toString(), element.W1ENTRY_TIME.toString());
              element.TOTAL_WEIGHMENT1_TIME_HMS = this.getTimeInHMSFormat(element.W1EXIT_TIME.toString(), element.W1ENTRY_TIME.toString());
            }
            element.LENTRY_TIME_ONLY = this.datePipe.transform(element.LENTRY_TIME, 'hh:mm:ss a');
            element.LENTRY_DATE_ONLY = this.datePipe.transform(element.LENTRY_TIME, 'dd-MM-yyyy');
            element.LEXIT_TIME_ONLY = this.datePipe.transform(element.LEXIT_TIME, 'hh:mm:ss a');
            element.LEXIT_DATE_ONLY = this.datePipe.transform(element.LEXIT_TIME, 'dd-MM-yyyy');
            if (element.LEXIT_TIME && element.LENTRY_TIME && element.LEXIT_TIME != null && element.LENTRY_TIME != null) {
              element.TOTAL_LOADING_DURATION = this.getTimeInSentence(element.LEXIT_TIME.toString(), element.LENTRY_TIME.toString());
              element.TOTAL_LOADING_TIME_HMS = this.getTimeInHMSFormat(element.LEXIT_TIME.toString(), element.LENTRY_TIME.toString());

            }
            element.ULENTRY_TIME_ONLY = this.datePipe.transform(element.ULENTRY_TIME, 'hh:mm:ss a');
            element.ULENTRY_DATE_ONLY = this.datePipe.transform(element.ULENTRY_TIME, 'dd-MM-yyyy');
            element.ULEXIT_TIME_ONLY = this.datePipe.transform(element.ULEXIT_TIME, 'hh:mm:ss a');
            element.ULEXIT_DATE_ONLY = this.datePipe.transform(element.ULEXIT_TIME, 'dd-MM-yyyy');
            if (element.ULEXIT_TIME && element.ULENTRY_TIME && element.ULEXIT_TIME != null && element.ULENTRY_TIME != null) {
              element.TOTAL_UNLOADING_DURATION = this.getTimeInSentence(element.ULEXIT_TIME.toString(), element.ULENTRY_TIME.toString());
              element.TOTAL_UNLOADING_TIME_HMS = this.getTimeInHMSFormat(element.ULEXIT_TIME.toString(), element.ULENTRY_TIME.toString());

            }
            element.W2ENTRY_TIME_ONLY = this.datePipe.transform(element.W2ENTRY_TIME, 'hh:mm:ss a');
            element.W2ENTRY_DATE_ONLY = this.datePipe.transform(element.W2ENTRY_TIME, 'dd-MM-yyyy');
            element.W2EXIT_TIME_ONLY = this.datePipe.transform(element.W2EXIT_TIME, 'hh:mm:ss a');
            element.W2EXIT_DATE_ONLY = this.datePipe.transform(element.W2EXIT_TIME, 'dd-MM-yyyy');
            if (element.W2EXIT_TIME && element.W2ENTRY_TIME && element.W2EXIT_TIME != null && element.W2ENTRY_TIME != null) {
              element.TOTAL_WEIGHMENT2_DURATION = this.getTimeInSentence(element.W2EXIT_TIME.toString(), element.W2ENTRY_TIME.toString());
              element.TOTAL_WEIGHMENT2_TIME_HMS = this.getTimeInHMSFormat(element.W2EXIT_TIME.toString(), element.W2ENTRY_TIME.toString());

            }
            if (element.GEXIT_TIME && element.W2ENTRY_TIME && element.GEXIT_TIME != null && element.W2ENTRY_TIME != null) {
              element.WEIGHMENT2_GEXIT_DURATION = this.getTimeInSentence(element.GEXIT_TIME.toString(), element.W2ENTRY_TIME.toString());
              element.TOTAL_WEIGHMENT2GEXIT_TIME_HMS = this.getTimeInHMSFormat(element.GEXIT_TIME.toString(), element.W2ENTRY_TIME.toString());
            }

            if (element.ATL_ASSIGN_DATE != '' && element.ATL_ASSIGN_DATE != null) {
              var date = new Date(element.ATL_ASSIGN_DATE);
              element.ATL_ASSIGN_DATE = this.datePipe.transform(date, 'dd-MM-yyyy');
            }
            if (element.BAY_ASSIGN_DATE != '' && element.BAY_ASSIGN_DATE != null) {
              var date1 = new Date(element.BAY_ASSIGN_DATE);
              element.BAY_ASSIGN_DATE = this.datePipe.transform(date1, 'dd-MM-yyyy');
            }
            if (element.GENTRY_TIME && element.ATL_ASSIGN_TIME && element.GENTRY_TIME != null && element.ATL_ASSIGN_TIME != null) {
              //element.ATL_ASSIGN_DURATION = this.getTimeInSentence(element.ATL_ASSIGN_TIME.toString(), element.GENTRY_TIME.toString());
              var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
              var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
              element.TOTAL_GENTRY_ATLASSIGN_TIME_HMS = this.getTimeInHMSFormat(date11.toString(), element.GENTRY_TIME.toString());
            }

            if (element.BAY_ASSIGN_TIME && element.ATL_ASSIGN_TIME && element.BAY_ASSIGN_TIME != null && element.ATL_ASSIGN_TIME != null) {
              //element.BAY_ASSIGN_DURATION = this.getTimeInSentence(element.BAY_ASSIGN_TIME.toString(), element.ATL_ASSIGN_TIME.toString());
              var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
              var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
              var newDate1 = this.datePipe.transform(element.BAY_ASSIGN_DATE, 'dd-MM-yyyy')
              var date111 = new Date(newDate1 + " " + element.BAY_ASSIGN_TIME);
              element.TOTAL_ATL_BAYASSIGN_TIME_HMS = this.getTimeInHMSFormat(date111, date11);
            }
            if (element.GENTRY_TIME && element.ATL_ASSIGN_TIME && element.GENTRY_TIME != null && element.ATL_ASSIGN_TIME != null) {
              //element.ATL_ASSIGN_DURATION = this.getTimeInSentence(element.ATL_ASSIGN_TIME.toString(), element.GENTRY_TIME.toString());
              var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
              var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
              element.ATL_ASSIGN_DURATION = this.getTimeInSentence(date11.toString(), element.GENTRY_TIME.toString());
            }

            if (element.BAY_ASSIGN_TIME && element.ATL_ASSIGN_TIME && element.BAY_ASSIGN_TIME != null && element.ATL_ASSIGN_TIME != null) {
              //element.BAY_ASSIGN_DURATION = this.getTimeInSentence(element.BAY_ASSIGN_TIME.toString(), element.ATL_ASSIGN_TIME.toString());
              var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
              var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
              var newDate1 = this.datePipe.transform(element.BAY_ASSIGN_DATE, 'dd-MM-yyyy')
              var date111 = new Date(newDate1 + " " + element.BAY_ASSIGN_TIME);
              element.BAY_ASSIGN_DURATION = this.getTimeInSentence(date111.toString(), date11.toString());
            }
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
                element.TYPE = element.TYPE == 'L' ? 'Loading' :
                  element.TYPE == 'UL' ? 'Unloading' : element.TYPE == 'ULL' ? 'Unloading And Loading' : '';
                element.CUR_STATUS = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' :
                  element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' :
                    element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' :
                      element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' :
                        element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' :
                          element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' :
                            element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';

                element.GENTRY_TIME_ONLY = this.datePipe.transform(element.GENTRY_TIME, 'hh:mm:ss a');
                element.GENTRY_DATE_ONLY = this.datePipe.transform(element.GENTRY_TIME, 'dd-MM-yyyy');
                element.GEXIT_TIME_ONLY = this.datePipe.transform(element.GEXIT_TIME, 'hh:mm:ss a');
                element.GEXIT_DATE_ONLY = this.datePipe.transform(element.GEXIT_TIME, 'dd-MM-yyyy');
                if (element.GEXIT_TIME && element.GENTRY_TIME && element.GEXIT_TIME != null && element.GENTRY_TIME != null) {
                  element.TOTAL_GATE_DURATION = this.getTimeInSentence(element.GEXIT_TIME.toString(), element.GENTRY_TIME.toString());
                  element.TOTAL_GATE_TIME_HMS = this.getTimeInHMSFormat(element.GEXIT_TIME.toString(), element.GENTRY_TIME.toString());
                }
                element.PENTRY_TIME_ONLY = this.datePipe.transform(element.PENTRY_TIME, 'hh:mm:ss a');
                element.PENTRY_DATE_ONLY = this.datePipe.transform(element.PENTRY_TIME, 'dd-MM-yyyy');
                element.PEXIT_TIME_ONLY = this.datePipe.transform(element.PEXIT_TIME, 'hh:mm:ss a');
                element.PEXIT_DATE_ONLY = this.datePipe.transform(element.PEXIT_TIME, 'dd-MM-yyyy');
                if (element.PEXIT_TIME && element.PENTRY_TIME && element.PEXIT_TIME != null && element.PENTRY_TIME != null) {
                  element.TOTAL_PARKING_DURATION = this.getTimeInSentence(element.PEXIT_TIME.toString(), element.PENTRY_TIME.toString());
                  element.TOTAL_PARKING_TIME_HMS = this.getTimeInHMSFormat(element.PEXIT_TIME.toString(), element.PENTRY_TIME.toString());
                }
                element.W1ENTRY_TIME_ONLY = this.datePipe.transform(element.W1ENTRY_TIME, 'hh:mm:ss a');
                element.W1ENTRY_DATE_ONLY = this.datePipe.transform(element.W1ENTRY_TIME, 'dd-MM-yyyy');
                element.W1EXIT_TIME_ONLY = this.datePipe.transform(element.W1EXIT_TIME, 'hh:mm:ss a');
                element.W1EXIT_DATE_ONLY = this.datePipe.transform(element.W1EXIT_TIME, 'dd-MM-yyyy');
                if (element.W1EXIT_TIME && element.W1ENTRY_TIME && element.W1EXIT_TIME != null && element.W1ENTRY_TIME != null) {
                  element.TOTAL_WEIGHMENT1_DURATION = this.getTimeInSentence(element.W1EXIT_TIME.toString(), element.W1ENTRY_TIME.toString());
                  element.TOTAL_WEIGHMENT1_TIME_HMS = this.getTimeInHMSFormat(element.W1EXIT_TIME.toString(), element.W1ENTRY_TIME.toString());
                }
                element.LENTRY_TIME_ONLY = this.datePipe.transform(element.LENTRY_TIME, 'hh:mm:ss a');
                element.LENTRY_DATE_ONLY = this.datePipe.transform(element.LENTRY_TIME, 'dd-MM-yyyy');
                element.LEXIT_TIME_ONLY = this.datePipe.transform(element.LEXIT_TIME, 'hh:mm:ss a');
                element.LEXIT_DATE_ONLY = this.datePipe.transform(element.LEXIT_TIME, 'dd-MM-yyyy');
                if (element.LEXIT_TIME && element.LENTRY_TIME && element.LEXIT_TIME != null && element.LENTRY_TIME != null) {
                  element.TOTAL_LOADING_DURATION = this.getTimeInSentence(element.LEXIT_TIME.toString(), element.LENTRY_TIME.toString());
                  element.TOTAL_LOADING_TIME_HMS = this.getTimeInHMSFormat(element.LEXIT_TIME.toString(), element.LENTRY_TIME.toString());

                }
                element.ULENTRY_TIME_ONLY = this.datePipe.transform(element.ULENTRY_TIME, 'hh:mm:ss a');
                element.ULENTRY_DATE_ONLY = this.datePipe.transform(element.ULENTRY_TIME, 'dd-MM-yyyy');
                element.ULEXIT_TIME_ONLY = this.datePipe.transform(element.ULEXIT_TIME, 'hh:mm:ss a');
                element.ULEXIT_DATE_ONLY = this.datePipe.transform(element.ULEXIT_TIME, 'dd-MM-yyyy');
                if (element.ULEXIT_TIME && element.ULENTRY_TIME && element.ULEXIT_TIME != null && element.ULENTRY_TIME != null) {
                  element.TOTAL_UNLOADING_DURATION = this.getTimeInSentence(element.ULEXIT_TIME.toString(), element.ULENTRY_TIME.toString());
                  element.TOTAL_UNLOADING_TIME_HMS = this.getTimeInHMSFormat(element.ULEXIT_TIME.toString(), element.ULENTRY_TIME.toString());

                }
                element.W2ENTRY_TIME_ONLY = this.datePipe.transform(element.W2ENTRY_TIME, 'hh:mm:ss a');
                element.W2ENTRY_DATE_ONLY = this.datePipe.transform(element.W2ENTRY_TIME, 'dd-MM-yyyy');
                element.W2EXIT_TIME_ONLY = this.datePipe.transform(element.W2EXIT_TIME, 'hh:mm:ss a');
                element.W2EXIT_DATE_ONLY = this.datePipe.transform(element.W2EXIT_TIME, 'dd-MM-yyyy');
                if (element.W2EXIT_TIME && element.W2ENTRY_TIME && element.W2EXIT_TIME != null && element.W2ENTRY_TIME != null) {
                  element.TOTAL_WEIGHMENT2_DURATION = this.getTimeInSentence(element.W2EXIT_TIME.toString(), element.W2ENTRY_TIME.toString());
                  element.TOTAL_WEIGHMENT2_TIME_HMS = this.getTimeInHMSFormat(element.W2EXIT_TIME.toString(), element.W2ENTRY_TIME.toString());

                }
                if (element.GEXIT_TIME && element.W2ENTRY_TIME && element.GEXIT_TIME != null && element.W2ENTRY_TIME != null) {
                  element.WEIGHMENT2_GEXIT_DURATION = this.getTimeInSentence(element.GEXIT_TIME.toString(), element.W2ENTRY_TIME.toString());
                  element.TOTAL_WEIGHMENT2GEXIT_TIME_HMS = this.getTimeInHMSFormat(element.GEXIT_TIME.toString(), element.W2ENTRY_TIME.toString());
                }
    
                if (element.ATL_ASSIGN_DATE != '' && element.ATL_ASSIGN_DATE != null) {
                  var date = new Date(element.ATL_ASSIGN_DATE);
                  element.ATL_ASSIGN_DATE = this.datePipe.transform(date, 'dd-MM-yyyy');
                }
                if (element.BAY_ASSIGN_DATE != '' && element.BAY_ASSIGN_DATE != null) {
                  var date1 = new Date(element.BAY_ASSIGN_DATE);
                  element.BAY_ASSIGN_DATE = this.datePipe.transform(date1, 'dd-MM-yyyy');
                }
                if (element.GENTRY_TIME && element.ATL_ASSIGN_TIME && element.GENTRY_TIME != null && element.ATL_ASSIGN_TIME != null) {
                  //element.ATL_ASSIGN_DURATION = this.getTimeInSentence(element.ATL_ASSIGN_TIME.toString(), element.GENTRY_TIME.toString());
                  var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
                  var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
                  element.TOTAL_GENTRY_ATLASSIGN_TIME_HMS = this.getTimeInHMSFormat(date11.toString(), element.GENTRY_TIME.toString());
                }
    
                if (element.BAY_ASSIGN_TIME && element.ATL_ASSIGN_TIME && element.BAY_ASSIGN_TIME != null && element.ATL_ASSIGN_TIME != null) {
                  //element.BAY_ASSIGN_DURATION = this.getTimeInSentence(element.BAY_ASSIGN_TIME.toString(), element.ATL_ASSIGN_TIME.toString());
                  var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
                  var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
                  var newDate1 = this.datePipe.transform(element.BAY_ASSIGN_DATE, 'dd-MM-yyyy')
                  var date111 = new Date(newDate1 + " " + element.BAY_ASSIGN_TIME);
                  element.TOTAL_ATL_BAYASSIGN_TIME_HMS = this.getTimeInHMSFormat(date111, date11);
                }
                if (element.GENTRY_TIME && element.ATL_ASSIGN_TIME && element.GENTRY_TIME != null && element.ATL_ASSIGN_TIME != null) {
                  //element.ATL_ASSIGN_DURATION = this.getTimeInSentence(element.ATL_ASSIGN_TIME.toString(), element.GENTRY_TIME.toString());
                  var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
                  var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
                  element.ATL_ASSIGN_DURATION = this.getTimeInSentence(date11.toString(), element.GENTRY_TIME.toString());
                }
    
                if (element.BAY_ASSIGN_TIME && element.ATL_ASSIGN_TIME && element.BAY_ASSIGN_TIME != null && element.ATL_ASSIGN_TIME != null) {
                  //element.BAY_ASSIGN_DURATION = this.getTimeInSentence(element.BAY_ASSIGN_TIME.toString(), element.ATL_ASSIGN_TIME.toString());
                  var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
                  var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
                  var newDate1 = this.datePipe.transform(element.BAY_ASSIGN_DATE, 'dd-MM-yyyy')
                  var date111 = new Date(newDate1 + " " + element.BAY_ASSIGN_TIME);
                  element.BAY_ASSIGN_DURATION = this.getTimeInSentence(date111.toString(), date11.toString());
                }

              });
              this.dataSource = new MatTableDataSource(this.AllTransactionReportDetails);
              console.log(this.AllTransactionReportDetails);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
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
                element.TYPE = element.TYPE == 'L' ? 'Loading' :
                  element.TYPE == 'UL' ? 'Unloading' : element.TYPE == 'ULL' ? 'Unloading And Loading' : '';
                element.CUR_STATUS = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' :
                  element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' :
                    element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' :
                      element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' :
                        element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' :
                          element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' :
                            element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';

                element.GENTRY_TIME_ONLY = this.datePipe.transform(element.GENTRY_TIME, 'hh:mm:ss a');
                element.GENTRY_DATE_ONLY = this.datePipe.transform(element.GENTRY_TIME, 'dd-MM-yyyy');
                element.GEXIT_TIME_ONLY = this.datePipe.transform(element.GEXIT_TIME, 'hh:mm:ss a');
                element.GEXIT_DATE_ONLY = this.datePipe.transform(element.GEXIT_TIME, 'dd-MM-yyyy');
                if (element.GEXIT_TIME && element.GENTRY_TIME && element.GEXIT_TIME != null && element.GENTRY_TIME != null) {
                  element.TOTAL_GATE_DURATION = this.getTimeInSentence(element.GEXIT_TIME.toString(), element.GENTRY_TIME.toString());
                  element.TOTAL_GATE_TIME_HMS = this.getTimeInHMSFormat(element.GEXIT_TIME.toString(), element.GENTRY_TIME.toString());
                }
                element.PENTRY_TIME_ONLY = this.datePipe.transform(element.PENTRY_TIME, 'hh:mm:ss a');
                element.PENTRY_DATE_ONLY = this.datePipe.transform(element.PENTRY_TIME, 'dd-MM-yyyy');
                element.PEXIT_TIME_ONLY = this.datePipe.transform(element.PEXIT_TIME, 'hh:mm:ss a');
                element.PEXIT_DATE_ONLY = this.datePipe.transform(element.PEXIT_TIME, 'dd-MM-yyyy');
                if (element.PEXIT_TIME && element.PENTRY_TIME && element.PEXIT_TIME != null && element.PENTRY_TIME != null) {
                  element.TOTAL_PARKING_DURATION = this.getTimeInSentence(element.PEXIT_TIME.toString(), element.PENTRY_TIME.toString());
                  element.TOTAL_PARKING_TIME_HMS = this.getTimeInHMSFormat(element.PEXIT_TIME.toString(), element.PENTRY_TIME.toString());
                }
                element.W1ENTRY_TIME_ONLY = this.datePipe.transform(element.W1ENTRY_TIME, 'hh:mm:ss a');
                element.W1ENTRY_DATE_ONLY = this.datePipe.transform(element.W1ENTRY_TIME, 'dd-MM-yyyy');
                element.W1EXIT_TIME_ONLY = this.datePipe.transform(element.W1EXIT_TIME, 'hh:mm:ss a');
                element.W1EXIT_DATE_ONLY = this.datePipe.transform(element.W1EXIT_TIME, 'dd-MM-yyyy');
                if (element.W1EXIT_TIME && element.W1ENTRY_TIME && element.W1EXIT_TIME != null && element.W1ENTRY_TIME != null) {
                  element.TOTAL_WEIGHMENT1_DURATION = this.getTimeInSentence(element.W1EXIT_TIME.toString(), element.W1ENTRY_TIME.toString());
                  element.TOTAL_WEIGHMENT1_TIME_HMS = this.getTimeInHMSFormat(element.W1EXIT_TIME.toString(), element.W1ENTRY_TIME.toString());
                }
                element.LENTRY_TIME_ONLY = this.datePipe.transform(element.LENTRY_TIME, 'hh:mm:ss a');
                element.LENTRY_DATE_ONLY = this.datePipe.transform(element.LENTRY_TIME, 'dd-MM-yyyy');
                element.LEXIT_TIME_ONLY = this.datePipe.transform(element.LEXIT_TIME, 'hh:mm:ss a');
                element.LEXIT_DATE_ONLY = this.datePipe.transform(element.LEXIT_TIME, 'dd-MM-yyyy');
                if (element.LEXIT_TIME && element.LENTRY_TIME && element.LEXIT_TIME != null && element.LENTRY_TIME != null) {
                  element.TOTAL_LOADING_DURATION = this.getTimeInSentence(element.LEXIT_TIME.toString(), element.LENTRY_TIME.toString());
                  element.TOTAL_LOADING_TIME_HMS = this.getTimeInHMSFormat(element.LEXIT_TIME.toString(), element.LENTRY_TIME.toString());

                }
                element.ULENTRY_TIME_ONLY = this.datePipe.transform(element.ULENTRY_TIME, 'hh:mm:ss a');
                element.ULENTRY_DATE_ONLY = this.datePipe.transform(element.ULENTRY_TIME, 'dd-MM-yyyy');
                element.ULEXIT_TIME_ONLY = this.datePipe.transform(element.ULEXIT_TIME, 'hh:mm:ss a');
                element.ULEXIT_DATE_ONLY = this.datePipe.transform(element.ULEXIT_TIME, 'dd-MM-yyyy');
                if (element.ULEXIT_TIME && element.ULENTRY_TIME && element.ULEXIT_TIME != null && element.ULENTRY_TIME != null) {
                  element.TOTAL_UNLOADING_DURATION = this.getTimeInSentence(element.ULEXIT_TIME.toString(), element.ULENTRY_TIME.toString());
                  element.TOTAL_UNLOADING_TIME_HMS = this.getTimeInHMSFormat(element.ULEXIT_TIME.toString(), element.ULENTRY_TIME.toString());

                }
                element.W2ENTRY_TIME_ONLY = this.datePipe.transform(element.W2ENTRY_TIME, 'hh:mm:ss a');
                element.W2ENTRY_DATE_ONLY = this.datePipe.transform(element.W2ENTRY_TIME, 'dd-MM-yyyy');
                element.W2EXIT_TIME_ONLY = this.datePipe.transform(element.W2EXIT_TIME, 'hh:mm:ss a');
                element.W2EXIT_DATE_ONLY = this.datePipe.transform(element.W2EXIT_TIME, 'dd-MM-yyyy');
                if (element.W2EXIT_TIME && element.W2ENTRY_TIME && element.W2EXIT_TIME != null && element.W2ENTRY_TIME != null) {
                  element.TOTAL_WEIGHMENT2_DURATION = this.getTimeInSentence(element.W2EXIT_TIME.toString(), element.W2ENTRY_TIME.toString());
                  element.TOTAL_WEIGHMENT2_TIME_HMS = this.getTimeInHMSFormat(element.W2EXIT_TIME.toString(), element.W2ENTRY_TIME.toString());

                }
                if (element.GEXIT_TIME && element.W2ENTRY_TIME && element.GEXIT_TIME != null && element.W2ENTRY_TIME != null) {
                  element.WEIGHMENT2_GEXIT_DURATION = this.getTimeInSentence(element.GEXIT_TIME.toString(), element.W2ENTRY_TIME.toString());
                  element.TOTAL_WEIGHMENT2GEXIT_TIME_HMS = this.getTimeInHMSFormat(element.GEXIT_TIME.toString(), element.W2ENTRY_TIME.toString());
                }

                if (element.ATL_ASSIGN_DATE != '' && element.ATL_ASSIGN_DATE != null) {
                  var date = new Date(element.ATL_ASSIGN_DATE);
                  element.ATL_ASSIGN_DATE = this.datePipe.transform(date, 'dd-MM-yyyy');
                }
                if (element.BAY_ASSIGN_DATE != '' && element.BAY_ASSIGN_DATE != null) {
                  var date1 = new Date(element.BAY_ASSIGN_DATE);
                  element.BAY_ASSIGN_DATE = this.datePipe.transform(date1, 'dd-MM-yyyy');
                }
                if (element.GENTRY_TIME && element.ATL_ASSIGN_TIME && element.GENTRY_TIME != null && element.ATL_ASSIGN_TIME != null) {
                  //element.ATL_ASSIGN_DURATION = this.getTimeInSentence(element.ATL_ASSIGN_TIME.toString(), element.GENTRY_TIME.toString());
                  var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
                  var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
                  element.TOTAL_GENTRY_ATLASSIGN_TIME_HMS = this.getTimeInHMSFormat(date11.toString(), element.GENTRY_TIME.toString());
                }
    
                if (element.BAY_ASSIGN_TIME && element.ATL_ASSIGN_TIME && element.BAY_ASSIGN_TIME != null && element.ATL_ASSIGN_TIME != null) {
                  //element.BAY_ASSIGN_DURATION = this.getTimeInSentence(element.BAY_ASSIGN_TIME.toString(), element.ATL_ASSIGN_TIME.toString());
                  var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
                  var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
                  var newDate1 = this.datePipe.transform(element.BAY_ASSIGN_DATE, 'dd-MM-yyyy')
                  var date111 = new Date(newDate1 + " " + element.BAY_ASSIGN_TIME);
                  element.TOTAL_ATL_BAYASSIGN_TIME_HMS = this.getTimeInHMSFormat(date111, date11);
                }
                if (element.GENTRY_TIME && element.ATL_ASSIGN_TIME && element.GENTRY_TIME != null && element.ATL_ASSIGN_TIME != null) {
                  //element.ATL_ASSIGN_DURATION = this.getTimeInSentence(element.ATL_ASSIGN_TIME.toString(), element.GENTRY_TIME.toString());
                  var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
                  var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
                  element.ATL_ASSIGN_DURATION = this.getTimeInSentence(date11.toString(), element.GENTRY_TIME.toString());
                }
    
                if (element.BAY_ASSIGN_TIME && element.ATL_ASSIGN_TIME && element.BAY_ASSIGN_TIME != null && element.ATL_ASSIGN_TIME != null) {
                  //element.BAY_ASSIGN_DURATION = this.getTimeInSentence(element.BAY_ASSIGN_TIME.toString(), element.ATL_ASSIGN_TIME.toString());
                  var newDate = this.datePipe.transform(element.ATL_ASSIGN_DATE, 'dd-MM-yyyy')
                  var date11 = new Date(newDate + " " + element.ATL_ASSIGN_TIME);
                  var newDate1 = this.datePipe.transform(element.BAY_ASSIGN_DATE, 'dd-MM-yyyy')
                  var date111 = new Date(newDate1 + " " + element.BAY_ASSIGN_TIME);
                  element.BAY_ASSIGN_DURATION = this.getTimeInSentence(date111.toString(), date11.toString());
                }
              });
              this.dataSource = new MatTableDataSource(this.AllTransactionReportDetails);
              console.log(this.AllTransactionReportDetails);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
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


}
