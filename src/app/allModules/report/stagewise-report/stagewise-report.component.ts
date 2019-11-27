import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { AuthenticationDetails } from 'app/models/authentication-details';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatIconRegistry, MatPaginator, MatTableDataSource, MatSort, MatDatepickerInputEvent } from '@angular/material';
import { Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { fuseAnimations } from '@fuse/animations';
import { ReportService } from 'app/services/report.service';
import { ReportFilters, StageWiseReportDetails } from 'app/models/report';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Guid } from 'guid-typescript';
import { ExcelExtractService } from 'app/services/excel-extract.service';

@Component({
  selector: 'stagewise-report',
  templateUrl: './stagewise-report.component.html',
  styleUrls: ['./stagewise-report.component.scss'],
  animations: fuseAnimations
})
export class StageWiseReportComponent implements OnInit, OnDestroy {
  AllStageWiseReportDetails: StageWiseReportDetails[] = [];
  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  SetIntervalID: any;
  reportFormGroup: FormGroup;
  reportFilters: ReportFilters;
  AllPlants: string[] = [];
  diagramShow = true;
  content1Show = false;
  content1ShowName: string;
  displayedColumns: string[] = ['AVG_GATE_TIME', 'AVG_PARKING_TIME', 'AVG_ATL_ASSIGN_TIME', 'AVG_BAY_ASSIGN_TIME', 'AVG_LOADING_TIME', 'AVG_UNLOADING_TIME', 'AVG_WEIGHMENT1_TIME', 'AVG_WEIGHMENT2_TIME', 'AVG_WEIGHMENT2_GEXIT_TIME'];
  dataSource: MatTableDataSource<StageWiseReportDetails>;
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
      CUSTOMER: [''],
      PLANT: [''],
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
    this.GetAllStageWiseReports();
    this.GetAllPlants();
    this.SetIntervalID = setInterval(() => {
      // this.GetAllReports();
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
    this.excelService.exportAsExcelOnlyTable(this.table.nativeElement, 'stage-wise');
  }
  GetAllStageWiseReports(): void {
    this.IsProgressBarVisibile = true;
    this._reportService.GetAllStageWiseReports(this.authenticationDetails.userID).subscribe(
      (data) => {
        this.AllStageWiseReportDetails = data as StageWiseReportDetails[];
        // if (this.AllStageWiseReportDetails.length > 0) {
        this.dataSource = new MatTableDataSource(this.AllStageWiseReportDetails);
        //console.log(this.AllStageWiseReportDetails);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // }
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
      const PLANT: string = this.reportFormGroup.get('PLANT').value;
      const FROMDATE = this.datePipe.transform(this.reportFormGroup.get('FROMDATE').value as Date, 'yyyy-MM-dd');
      const TODATE = this.datePipe.transform(this.reportFormGroup.get('TODATE').value as Date, 'yyyy-MM-dd');
      const USERID: Guid = this.authenticationDetails.userID;
      this.reportFilters = new ReportFilters();
      this.reportFilters.UserID = USERID;
       this.reportFilters.PLANT = PLANT;
      this.reportFilters.FROMDATE = FROMDATE;
      this.reportFilters.TODATE = TODATE;
      // tslint:disable-next-line:max-line-length
      // if (this.reportFilters.VEHICLE_NO !== '' && this.reportFilters.VEHICLE_NO !== null && this.reportFilters.FROMDATE === '' && this.reportFilters.TODATE === '' || this.reportFilters.FROMDATE === null && this.reportFilters.TODATE === null) {
      //   // this.authenticationDetails.userID, VEHICLE_NO, FROMDATE, TODATE
      //   this._reportService.GetAllReportsBasedOnVehicleNoFilter(this.reportFilters)
      //     .subscribe((data) => {
      //       this.AllStageWiseReportDetails = data as StageWiseReportDetails[];
      //       // if (this.AllStageWiseReportDetails.length > 0) {
      //       this.dataSource = new MatTableDataSource(this.AllStageWiseReportDetails);
      //       console.log(this.AllStageWiseReportDetails);
      //       // this.reportFilters = null;
      //       // this.reportFormGroup.reset();
      //       this.dataSource.paginator = this.paginator;
      //       this.dataSource.sort = this.sort;
      //       // }
      //       this.IsProgressBarVisibile = false;
      //     },
      //       (err) => {
      //         console.log(err);
      //       });
      // }
      // tslint:disable-next-line:max-line-length
      if ((this.reportFilters.PLANT === '' || this.reportFilters.PLANT === null) && ((this.reportFilters.FROMDATE !== '' && this.reportFilters.TODATE !== '') && (this.reportFilters.FROMDATE !== null && this.reportFilters.TODATE !== null))) {
        // this.authenticationDetails.userID, VEHICLE_NO, FROMDATE, TODATE
        this.IsProgressBarVisibile = true;
        this._reportService.GetAllStageWiseReportsBasedOnDateFilter(this.reportFilters)
          .subscribe((data) => {
            this.AllStageWiseReportDetails = data as StageWiseReportDetails[];
            // if (this.AllStageWiseReportDetails.length > 0) {
            this.dataSource = new MatTableDataSource(this.AllStageWiseReportDetails);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            // }
            this.IsProgressBarVisibile = false;
          },
            (err) => {
              console.log(err);
            });
      }
      else if ((this.reportFilters.PLANT !== '' && this.reportFilters.PLANT !== null) && ((this.reportFilters.FROMDATE === '' && this.reportFilters.TODATE === '') || (this.reportFilters.FROMDATE === null && this.reportFilters.TODATE === null))){
        // this.authenticationDetails.userID, VEHICLE_NO, FROMDATE, TODATE
        this.IsProgressBarVisibile = true;
        this._reportService.GetAllStageWiseReportsBasedOnPlantFilter(this.reportFilters)
          .subscribe((data) => {
            this.AllStageWiseReportDetails = data as StageWiseReportDetails[];
            // if (this.AllStageWiseReportDetails.length > 0) {
            this.dataSource = new MatTableDataSource(this.AllStageWiseReportDetails);
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
        this.notificationSnackBarComponent.openSnackBar('It requires From Date and To Date', SnackBarStatus.danger);
        this.IsProgressBarVisibile = false;
      }
    }
    Object.keys(this.reportFormGroup.controls).forEach(key => {
      this.reportFormGroup.get(key).markAsTouched();
      this.reportFormGroup.get(key).markAsDirty();
    });
  }
  
  GetAllPlants(): void {
    this._reportService.GetAllPlants(this.authenticationDetails.userID).subscribe((data) => {
      if (data) {
        this.AllPlants = data as string[];
      }
    },
      (err) => {
        console.log(err);
      });
  }

  clearFromAndToDate(): void {
    this.reportFormGroup.get('FROMDATE').patchValue('');
    this.reportFormGroup.get('TODATE').patchValue('');
  }


  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.reportFormGroup.get('PLANT').patchValue('');
  }
}
