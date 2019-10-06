
import { AuthenticationDetails } from 'app/models/authentication-details';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { fuseAnimations } from '@fuse/animations';
import { ReportFilters } from 'app/models/report';
import { GatewayStatusService } from 'app/services/gateway-status.service';
import { GatewayStatusDetails } from 'app/models/gateway-status';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OnInit, OnDestroy, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'gateway-status',
  templateUrl: './gateway-status.component.html',
  styleUrls: ['./gateway-status.component.scss'],
  animations: fuseAnimations
})
export class GatewayStatusComponent implements OnInit, OnDestroy {
  AllGatewayStatusDetails: GatewayStatusDetails[] = [];
  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  SetIntervalID: any;
  reportFormGroup: FormGroup;
  AllPlants: any[] = [{
    'PLANT': '6101',
    'PLANTNAME': 'TCA'
  },
  {
    'PLANT': '6117',
    'PLANTNAME': 'TCB'
  },
  {
    'PLANT': 'BHI',
    'PLANTNAME': 'BHI'
  }];
  AllStatusOptions: string[] = [
    'ON',
    'OFF'
  ];
  reportFilters: ReportFilters;
  diagramShow = true;
  content1Show = false;
  content1ShowName: string;

  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['GATEWAY_ID', 'TRUCK_DETAILS', 'PLANT', 'PLANTNAME', 'STATION', 'IP', 'CREATED_ON', 'MODIFIED_ON', 'ON_OFF_STATUS'];
  dataSource: MatTableDataSource<GatewayStatusDetails>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _router: Router,
    public snackBar: MatSnackBar,
    private _gatewayStatusService: GatewayStatusService,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = true;
    this.reportFormGroup = this._formBuilder.group({
      ON_OR_OFF: [''],
      PLANT: [''],
      // FROMDATE: [''],
      // TODATE: ['']
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
      //  this._router.navigate(['/auth/login']);
    }
    this.GetAllGatewayStatusDetails();
    this.SetIntervalID = setInterval(() => {
      this.GetAllGatewayStatusDetails();
    }, 10000);

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

  GetAllGatewayStatusDetails(): void {
    this._gatewayStatusService.GetAllGatewayStatusDetails(this.authenticationDetails.userID).subscribe(
      (data) => {
        this.AllGatewayStatusDetails = data as GatewayStatusDetails[];
        if (this.AllGatewayStatusDetails.length > 0) {
          this.dataSource = new MatTableDataSource(this.AllGatewayStatusDetails);
          console.log(this.AllGatewayStatusDetails);
          this.dataSource.paginator = this.paginator;
          this.dataSource.paginator.pageSize=this.AllGatewayStatusDetails.length;
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

  GetAllDetailsBasedOnFilter(): void {
    if (this.reportFormGroup.valid) {
      const ON_OR_OFF: string = this.reportFormGroup.get('ON_OR_OFF').value;
      const PLANT: string = this.reportFormGroup.get('PLANT').value;
      // const FROMDATE = this.datePipe.transform(this.reportFormGroup.get('FROMDATE').value as Date, 'yyyy-MM-dd');
      // const TODATE = this.datePipe.transform(this.reportFormGroup.get('TODATE').value as Date, 'yyyy-MM-dd');
      const USERID: Guid = this.authenticationDetails.userID;
      this.reportFilters = new ReportFilters();
      this.reportFilters.UserID = USERID;
      this.reportFilters.ON_OR_OFF = ON_OR_OFF;
      this.reportFilters.PLANT = PLANT;
      // this.reportFilters.FROMDATE = FROMDATE;
      // this.reportFilters.TODATE = TODATE;
      // tslint:disable-next-line:max-line-length
      if (this.reportFilters.ON_OR_OFF !== '' && this.reportFilters.ON_OR_OFF !== null && this.reportFilters.PLANT === '' || this.reportFilters.PLANT === null) {
        // this.authenticationDetails.userID, VEHICLE_NO, FROMDATE, TODATE
        this._gatewayStatusService.GetAllDetailsBasedOnFilter(this.reportFilters)
          .subscribe((data) => {
            this.AllGatewayStatusDetails = data as GatewayStatusDetails[];
            // if (this.AllTransactionReportDetails.length > 0) {
            this.dataSource = new MatTableDataSource(this.AllGatewayStatusDetails);
            console.log(this.AllGatewayStatusDetails);
            // this.reportFilters = null;
            // this.reportFormGroup.reset();
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            // }
            this.IsProgressBarVisibile = false;
          },
            (err) => {
              console.log(err);
            });
      }
      else if (this.reportFilters.PLANT !== '' && this.reportFilters.PLANT !== null && this.reportFilters.ON_OR_OFF === '' || this.reportFilters.ON_OR_OFF === null) {
        // this.authenticationDetails.userID, VEHICLE_NO, FROMDATE, TODATE
        this._gatewayStatusService.GetAllDetailsBasedOnFilter(this.reportFilters)
          .subscribe((data) => {
            this.AllGatewayStatusDetails = data as GatewayStatusDetails[];
            // if (this.AllTransactionReportDetails.length > 0) {
            this.dataSource = new MatTableDataSource(this.AllGatewayStatusDetails);
            console.log(this.AllGatewayStatusDetails);
            // this.reportFilters = null;
            //  this.reportFormGroup.reset();
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
        // this.reportFilters = null;
        // this.reportFormGroup.reset();
        this.notificationSnackBarComponent.openSnackBar('It requires at least a field ', SnackBarStatus.danger);
      }
    }
    Object.keys(this.reportFormGroup.controls).forEach(key => {
      this.reportFormGroup.get(key).markAsTouched();
      this.reportFormGroup.get(key).markAsDirty();
    });
    this.reportFormGroup.reset();
  }

}
