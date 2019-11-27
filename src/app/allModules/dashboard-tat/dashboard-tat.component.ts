import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationDetails } from 'app/models/authentication-details';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { TransactionDetails, ExceptionDetails, CommonFilters, DailyTATDetails, WeeklyTATDetails, MonthlyTATDetails } from 'app/models/transaction-details';
import { TransactionDetailsService } from 'app/services/transaction-details.service';
import { SnackBarStatus } from 'app/notifications/snackbar-status-enum';
import { Guid } from 'guid-typescript';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DashboardTATService } from 'app/services/dashboard-tat-service';
@Component({
  selector: 'app-dashboard-tat',
  templateUrl: './dashboard-tat.component.html',
  styleUrls: ['./dashboard-tat.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DashboardTATComponent implements OnInit {

  //Variable declarations
  AllTransactionDetails: TransactionDetails[] = [];
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
  isCommonTableFilter: boolean;

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

  tatGreaterTwoLessFourHrsCount: number;
  tatGreaterFourLessEightHrsCount: number;
  tatGreaterEightHrsCount: number;

  inGateEntryTodayCount: number;
  inGateExitTodayCount: number;
  inAwaitingGateExitTodayCount: number;
  inWeighment1Count: number;

  tableShow = true;
  diagramShow = false;
  commonTableShow = false;
  commonTableShowName: string;

  dataSource: MatTableDataSource<TransactionDetails>;
  displayedColumns = ['VEHICLE_NO', 'GENTRY_DATE_ONLY', 'GENTRY_TIME_ONLY', 'TAT', 'STATUS_DESCRIPTION', 'CUR_STATUS',
    'TRUCK_ID', 'TRANSACTION_ID', 'TYPE', 'BAY', 'DRIVER_DETAILS', 'DRIVER_NO', 'TRANSPORTER_NAME',
    'CUSTOMER_NAME', 'MATERIAL', 'FG_DESCRIPTION'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;

  AllDailyTATDetails: DailyTATDetails;
  AllWeeklyTATDetails: WeeklyTATDetails;
  AllMonthlyTATDetails: MonthlyTATDetails;
  // Doughnut
  public dailyDoughnutChartLabels: string[] = ['<4 hr', '4<8 hr', '>8 hr'];
  public dailyTATDoughnutChartData: number[] = [];
  public dailyDoughnutColors = [
    {
      backgroundColor: [
        'rgba(0, 153, 0, 1)',
        'rgba(230, 184, 0, 1)',
        'rgba(230, 0, 0, 1)',
      ]
    }
  ];
  public dailyDoughnutChartType: string = 'doughnut';

  public weeklyDoughnutChartLabels: string[] = ['<4 hr', '4<8 hr', '>8 hr'];
  public weeklyTATDoughnutChartData: number[] = [];
  public weeklyDoughnutColors = [
    {
      backgroundColor: [
        'rgba(0, 153, 0, 1)',
        'rgba(230, 184, 0, 1)',
        'rgba(230, 0, 0, 1)',
      ]
    }
  ];
  public weeklyDoughnutChartType: string = 'doughnut';


  public monthlyDoughnutChartLabels: string[] = ['<4 hr', '4<8 hr', '>8 hr'];
  public monthlyTATDoughnutChartData: number[] = [];
  public monthlyDoughnutColors = [
    {
      backgroundColor: [
        'rgba(0, 153, 0, 1)',
        'rgba(230, 184, 0, 1)',
        'rgba(230, 0, 0, 1)',
      ]
    }
  ];
  public monthlyDoughnutChartType: string = 'doughnut';

  donutChartData = [
    {
      label: '<4 hr',
      value: 5,
      color: 'green',
    },
    {
      label: '4<8 hr',
      value: 13,
      color: 'orange',
    },
    {
      label: '>8 hr',
      value: 5,
      color: 'red',
    },
  ];


  constructor(
    private _router: Router,
    public snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private _dashboardTATService: DashboardTATService,
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
    this.GetDailyTAT(this.authenticationDetails.userID);
    this.GetWeeklyTAT(this.authenticationDetails.userID);
    this.GetMonthlyTAT(this.authenticationDetails.userID);
    this.SetIntervalID = setInterval(() => {
      //this.GetDailyTAT(this.authenticationDetails.userID);
    }, 4000);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    if (this.SetIntervalID) {
      clearInterval(this.SetIntervalID);
    }
  }

  //   ngAfterViewInit() {
  //     console.log(' aaa' );
  //    this.dataSource.sortingDataAccessor = (item, property) => {
  //     // property = this.sortBy;
  //      // console.log('item: '+JSON.stringify(item)+' '+' property: '+ property);
  //  switch (property) {
  //    case 'TRUCK_ID': {
  //      console.log(property);
  //      return item[property];
  //      }

  //    case 'TAT': {
  //        console.log('Inside date');
  //        // this.dataSource.sort(function (a,b){
  //        //   let c = new Date(a.date);
  //        //   let d = new Date(b.date);
  //        //   return c-d;
  //        // });
  //       //  let newDate = new Date(item.GENTRY_DATE.toString());
  //       //  console.log(newDate);

  //       let TATArray=item.TAT.split('');
  //        let days=TATArray[0];
  //              let minutes=TATArray[0];
  //      return days;
  //    }
  //    default: {
  //      console.log('Inside default sort');
  //      return item[property];}
  //            }
  //        };

  //      // this.dataSource.sort = this.sort;
  //    //  console.log(this.dataSource.sort);
  //  }

  // events
  public dailyChartClicked(e: any): void {
    console.log(e);
  }

  public dailyChartHovered(e: any): void {
    console.log(e);
  }

  // events
  public weeklyChartClicked(e: any): void {
    console.log(e);
  }

  public weeklyChartHovered(e: any): void {
    console.log(e);
  }

  // events
  public monthlyChartClicked(e: any): void {
    console.log(e);
  }

  public monthlyChartHovered(e: any): void {
    console.log(e);
  }

  // tslint:disable-next-line:typedef
  applyCommonFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goBackToDashboard(): void {
    this.diagramShow = false;
    this.tableShow = true;
  }

  GetDailyTAT(ID: Guid): void {
    this._dashboardTATService.GetDailyTAT(ID,"default").subscribe(
      (data) => {
        this.AllDailyTATDetails = data as DailyTATDetails;
        if (this.AllDailyTATDetails && this.AllDailyTATDetails.TOTAL_VEHICLES_COUNT != 0) {
          this.dailyTATDoughnutChartData.push(this.AllDailyTATDetails.LESSER_FOUR_COUNT);
          this.dailyTATDoughnutChartData.push(this.AllDailyTATDetails.BETWEEN_FOUR_EIGHT_COUNT);
          this.dailyTATDoughnutChartData.push(this.AllDailyTATDetails.GREATER_EIGHT_COUNT);
          //console.log(this.dailyTATDoughnutChartData);
        }
        // else {
        //   this.dailyTATDoughnutChartData = [100, 100, 100];
        // }
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetWeeklyTAT(ID: Guid): void {
    this._dashboardTATService.GetWeeklyTAT(ID,"default").subscribe(
      (data) => {
        this.AllWeeklyTATDetails = data as WeeklyTATDetails;
        if (this.AllWeeklyTATDetails && this.AllWeeklyTATDetails.TOTAL_VEHICLES_COUNT != 0) {
          this.weeklyTATDoughnutChartData.push(this.AllWeeklyTATDetails.LESSER_FOUR_COUNT);
          this.weeklyTATDoughnutChartData.push(this.AllWeeklyTATDetails.BETWEEN_FOUR_EIGHT_COUNT);
          this.weeklyTATDoughnutChartData.push(this.AllWeeklyTATDetails.GREATER_EIGHT_COUNT);
          //console.log(this.weeklyTATDoughnutChartData);
        }
        // else {
        //   this.weeklyTATDoughnutChartData = [100, 100, 100];
        // }
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetMonthlyTAT(ID: Guid): void {
    this._dashboardTATService.GetMonthlyTAT(ID,"default").subscribe(
      (data) => {
        this.AllMonthlyTATDetails = data as MonthlyTATDetails;
        if (this.AllMonthlyTATDetails && this.AllMonthlyTATDetails.TOTAL_VEHICLES_COUNT != 0) {
          this.monthlyTATDoughnutChartData.push(this.AllMonthlyTATDetails.LESSER_FOUR_COUNT);
          this.monthlyTATDoughnutChartData.push(this.AllMonthlyTATDetails.BETWEEN_FOUR_EIGHT_COUNT);
          this.monthlyTATDoughnutChartData.push(this.AllMonthlyTATDetails.GREATER_EIGHT_COUNT);
          //console.log(this.monthlyTATDoughnutChartData);
        }
        // else {
        //   this.monthlyTATDoughnutChartData = [100, 100, 100];
        // }
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllDailyTATDetails(ID: Guid): void {
    this.IsProgressBarVisibile = true;
    this._dashboardTATService.GetAllDailyTATDetails(ID,"default").subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        // this.AllTransactionDetails.forEach(element => {
        //   //element.GENTRY_DATE_ONLY = element.GENTRY_TIME;
        //   //element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
        //   //element.TAT = this.getTAT(element.GENTRY_TIME.toString());
        // });       
        this.dataSource = new MatTableDataSource(this.AllTransactionDetails);
        this.dataSource.sortingDataAccessor = (item, property) => {
          // property = this.sortBy;
          // console.log('item: '+JSON.stringify(item)+' '+' property: '+ property);
          switch (property) {
            // case 'TRUCK_ID': {
            //   console.log(property);
            //   return item[property];
            // }
            case 'TAT': {
              //console.log('Inside TAT');
              // this.dataSource.sort(function (a,b){
              //   let c = new Date(a.date);
              //   let d = new Date(b.date);
              //   return c-d;
              // });
              //  let newDate = new Date(item.GENTRY_DATE.toString());
              //  console.log(newDate);

              // let TATArray = item.TAT.split(' ');
              // let filteredTATArray = TATArray.filter(function (entry) { return entry.trim() != ''; });
              // if (filteredTATArray[1] === 'dy') {
              //   //days present
              //   //Convert to seconds
              //   let days = filteredTATArray[0];
              //   return item.TAT_TIMESPAN_VAL;
              // }
              // else {
              //   let hrs = filteredTATArray[2];
              //   return hrs;
              // }
              return item.TAT_TIMESPAN_VAL;
            }
            default: {
              //console.log('Inside default sort');
              return item[property];
            }
          }
        };
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

  GetAllWeeklyTATDetails(ID: Guid): void {
    this.IsProgressBarVisibile = true;
    this._dashboardTATService.GetAllWeeklyTATDetails(ID,"default").subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        // this.AllTransactionDetails.forEach(element => {
        //   //element.GENTRY_DATE_ONLY = element.GENTRY_TIME;
        //   //element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
        //   //element.TAT = this.getTAT(element.GENTRY_TIME.toString());
        // });
        this.dataSource = new MatTableDataSource(this.AllTransactionDetails);
        this.dataSource.sortingDataAccessor = (item, property) => {
          // property = this.sortBy;
          // console.log('item: '+JSON.stringify(item)+' '+' property: '+ property);
          switch (property) {
            // case 'TRUCK_ID': {
            //   console.log(property);
            //   return item[property];
            // }
            case 'TAT': {
              console.log('Inside TAT');
              // this.dataSource.sort(function (a,b){
              //   let c = new Date(a.date);
              //   let d = new Date(b.date);
              //   return c-d;
              // });
              //  let newDate = new Date(item.GENTRY_DATE.toString());
              //  console.log(newDate);

              // let TATArray = item.TAT.split(' ');
              // let filteredTATArray = TATArray.filter(function (entry) { return entry.trim() != ''; });
              // if (filteredTATArray[1] === 'dy') {
              //   //days present
              //   //Convert to seconds
              //   let days = filteredTATArray[0];
              //   return item.TAT_TIMESPAN_VAL;
              // }
              // else {
              //   let hrs = filteredTATArray[2];
              //   return hrs;
              // }
              return item.TAT_TIMESPAN_VAL;
            }
            default: {
              console.log('Inside default sort');
              return item[property];
            }
          }
        };
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

  GetAllMonthlyTATDetails(ID: Guid): void {
    this.IsProgressBarVisibile = true;
    this._dashboardTATService.GetAllMonthlyTATDetails(ID,"default").subscribe(
      (data) => {
        this.AllTransactionDetails = data as TransactionDetails[];
        // this.AllTransactionDetails.forEach(element => {
        //   //element.GENTRY_DATE_ONLY = element.GENTRY_TIME;
        //   //element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
        //   //element.TAT = this.getTAT(element.GENTRY_TIME.toString());
        // });
        this.dataSource = new MatTableDataSource(this.AllTransactionDetails);
        this.dataSource.sortingDataAccessor = (item, property) => {
          // property = this.sortBy;
          // console.log('item: '+JSON.stringify(item)+' '+' property: '+ property);
          switch (property) {
            // case 'TRUCK_ID': {
            //   console.log(property);
            //   return item[property];
            // }
            case 'TAT': {
              console.log('Inside TAT');
              // this.dataSource.sort(function (a,b){
              //   let c = new Date(a.date);
              //   let d = new Date(b.date);
              //   return c-d;
              // });
              //  let newDate = new Date(item.GENTRY_DATE.toString());
              //  console.log(newDate);

              // let TATArray = item.TAT.split(' ');
              // let filteredTATArray = TATArray.filter(function (entry) { return entry.trim() != ''; });
              // if (filteredTATArray[1] === 'dy') {
              //   //days present
              //   //Convert to seconds
              //   let days = filteredTATArray[0];
              //   return item.TAT_TIMESPAN_VAL;
              // }
              // else {
              //   let hrs = filteredTATArray[2];
              //   return hrs;
              // }
              return item.TAT_TIMESPAN_VAL;
            }
            default: {
              console.log('Inside default sort');
              return item[property];
            }
          }
        };
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

  loadSelectedTATDetails(period: string): void {
    this.commonFilterFormGroup.reset();
    if (period === 'Daily') {
      this.diagramShow = true;
      this.tableShow = false;
      this.commonTableShowName = 'Daily TAT Details';
      this.commonTableShow = true;
      this.isCommonTableFilter = true;
      this.GetAllDailyTATDetails(this.authenticationDetails.userID);
    }
    else if (period === 'Weekly') {
      this.diagramShow = true;
      this.tableShow = false;
      this.commonTableShowName = 'Weekly TAT Details';
      this.commonTableShow = true;
      this.isCommonTableFilter = true;
      this.GetAllWeeklyTATDetails(this.authenticationDetails.userID);
    }
    else if (period === 'Monthly') {
      this.diagramShow = true;
      this.tableShow = false;
      this.commonTableShowName = 'Monthly TAT Details';
      this.commonTableShow = true;
      this.isCommonTableFilter = true;
      this.GetAllMonthlyTATDetails(this.authenticationDetails.userID);
    }
  }

  loadSelectedTransactionDetails(row: TransactionDetails): void {
    this.SelectedTransactionDeatils = row;
    this._router.navigate(['/transactionDetails', this.SelectedTransactionDeatils.TRANS_ID]);
  }

  GetTransactionDetailsByValue(val: string, ID: Guid): void {
    this._dashboardTATService.GetTransactionDetailsByValue(val, ID).subscribe(
      (data) => {
        this.AllTransactionDetailsByValue = data as TransactionDetails[];
        this.AllTransactionDetailsByValue.forEach(element => {
          //element.GENTRY_DATE_ONLY = element.GENTRY_TIME;
          //element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
          //element.TAT = this.getTAT(element.GENTRY_TIME.toString());
        });
        this.IsProgressBarVisibile = false;
        this.dataSource = new MatTableDataSource(this.AllTransactionDetailsByValue);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllTransactionsBasedOnFilter(filterName: string): void {
    if (this.commonFilterFormGroup.valid) {
      const VEHICLE_NO: string = this.commonFilterFormGroup.get('VEHICLE_NO').value;
      const FROMDATE = this.datePipe.transform(this.commonFilterFormGroup.get('FROMDATE').value as Date, 'yyyy-MM-dd');
      const TODATE = this.datePipe.transform(this.commonFilterFormGroup.get('TODATE').value as Date, 'yyyy-MM-dd');
      const USERID: Guid = this.authenticationDetails.userID;
      this.commonFilters = new CommonFilters();
      this.commonFilters.FILTER_NAME = filterName;
      this.commonFilters.UserID = USERID;
      this.commonFilters.VEHICLE_NO = VEHICLE_NO;
      this.commonFilters.FROMDATE = FROMDATE;
      this.commonFilters.TODATE = TODATE;
      // tslint:disable-next-line:max-line-length
      if (this.commonFilters.VEHICLE_NO !== '' && this.commonFilters.VEHICLE_NO !== null && this.commonFilters.FROMDATE === '' && this.commonFilters.TODATE === '' || this.commonFilters.FROMDATE === null && this.commonFilters.TODATE === null) {
        // this.authenticationDetails.userID, VEHICLE_NO, FROMDATE, TODATE
        this._dashboardTATService.GetAllTransactionsBasedOnVehicleNoFilter(this.commonFilters)
          .subscribe((data) => {
            this.diagramShow = true;
            this.commonTableShowName = this.commonFilters.FILTER_NAME;
            this.tableShow = false;
            this.commonTableShow = true;
            this.AllTransactionDetails = data as TransactionDetails[];
            // if (this.AllTransactionDetails.length > 0) {
            // this.AllTransactionDetails.forEach(element => {
            //   //element.GENTRY_DATE_ONLY = element.GENTRY_TIME;
            //   //element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
            //   //element.TAT = this.getTAT(element.GENTRY_TIME.toString());
            // });
            this.dataSource = new MatTableDataSource(this.AllTransactionDetails);
            //console.log(this.AllTransactionDetails);
            // this.commonFilters = null;
            // this.commonFilterFormGroup.reset();
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            // }
            this.IsProgressBarVisibile = false;
          },
            (err) => {
              console.log(err);
              this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            });
      }
      // tslint:disable-next-line:max-line-length
      else if (this.commonFilters.FROMDATE !== '' && this.commonFilters.TODATE !== '' && this.commonFilters.FROMDATE !== null && this.commonFilters.TODATE !== null && this.commonFilters.VEHICLE_NO === '' || this.commonFilters.VEHICLE_NO === null) {
        // this.authenticationDetails.userID, VEHICLE_NO, FROMDATE, TODATE
        this._dashboardTATService.GetAllTransactionsBasedOnDateFilter(this.commonFilters)
          .subscribe((data) => {
            this.diagramShow = true;
            this.commonTableShowName = this.commonFilters.FILTER_NAME;
            this.tableShow = false;
            this.commonTableShow = true;
            this.AllTransactionDetails = data as TransactionDetails[];
            // this.AllTransactionDetails.forEach(element => {
            //   //element.GENTRY_DATE_ONLY = element.GENTRY_TIME;
            //   //element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
            //  // element.TAT = this.getTAT(element.GENTRY_TIME.toString());
            // });
            // if (this.AllTransactionDetails.length > 0) {
            this.dataSource = new MatTableDataSource(this.AllTransactionDetails);
            // console.log(this.AllTransactionDetails);
            // this.commonFilters = null;
            //  this.commonFilterFormGroup.reset();
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            // }
            this.IsProgressBarVisibile = false;
          },
            (err) => {
              console.log(err);
              this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
            });
      }
      else {
        // this.commonFilterFormGroup.reset();
        this.notificationSnackBarComponent.openSnackBar('It requires at least a field or From Date and To Date', SnackBarStatus.danger);
      }
    }
    Object.keys(this.commonFilterFormGroup.controls).forEach(key => {
      this.commonFilterFormGroup.get(key).markAsTouched();
      this.commonFilterFormGroup.get(key).markAsDirty();
    });
    // this.commonFilterFormGroup.reset();
  }

  GetAllVehicleNos(): void {
    this._dashboardTATService.GetAllVehicleNos(this.authenticationDetails.userID).subscribe((data) => {
      if (data) {
        this.AllVehicleNos = data as string[];
      }
    },
      (err) => {
        console.log(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      });
  }

  // loadSelectedVehicleDetails(vehicleData: any): void {
  //   console.log(vehicleData);
  //   const dialogConfig = new MatDialogConfig();
  //   // dialogConfig.disableClose = false;
  //   // dialogConfig.autoFocus = true;
  //   dialogConfig.panelClass = 'dashboard-detail';
  //   dialogConfig.data = {
  //     VEHICLE_NO: vehicleData.VEHICLE_NO,
  //     TRANSPORTER_NAME: vehicleData.TRANSPORTER_NAME,
  //     VENDOR: vehicleData.VENDOR,
  //     TRUCK_ID: vehicleData.TRUCK_ID,
  //     TYPE: vehicleData.TYPE,
  //     PLANT: vehicleData.PLANT,
  //     BAY: vehicleData.BAY,
  //     CUSTOMER_NAME: vehicleData.CUSTOMER_NAME,
  //     MATERIAL: vehicleData.MATERIAL,
  //     GENTRY_TIME: vehicleData.GENTRY_TIME,
  //     GEXIT_TIME: vehicleData.GEXIT_TIME,
  //     VEHICLE_OWNER_TYPE: vehicleData.VEHICLE_OWNER_TYPE,
  //     CUR_STATUS: vehicleData.CUR_STATUS,
  //     LINE_NUMBER: vehicleData.LINE_NUMBER,
  //     DRIVER_NO: vehicleData.DRIVER_NO

  //   };
  //   // dialogConfig.data = vehicleData;
  //   // this._matDialog.open(ContainerDetailsComponent, dialogConfig);
  //   const dialogRef = this._matDialog.open(DashboardDetailComponent, dialogConfig);
  //   // dialogRef.afterClosed().subscribe(
  //   //   data => console.log('Dialog output:', data)
  //   // );
  // }



  // getDate(exitDate: string, entryDate: string): any {
  //   if (exitDate !== '' && entryDate !== '' && exitDate !== null && entryDate !== null) {
  //     const diff = new Date(exitDate).getTime() - new Date(entryDate).getTime();
  //     if (Math.sign(diff) == -1 || Math.sign(diff) == -0) {
  //       return '-';
  //     }
  //     const day = 1000 * 60 * 60 * 24;
  //     const diffDays = Math.floor(diff / 86400000); // days
  //     const diffHrs = Math.floor((diff % 86400000) / 3600000); // hours
  //     const diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); // minutes
  //     const days = Math.floor(diff / day);
  //     const months = Math.floor(days / 31);
  //     const years = Math.floor(months / 12);
  //     if (diffDays !== 0 && diffMins !== 0 && diffHrs !== 0) {
  //       return diffDays + ' dy ' + diffHrs + ' hr ' + diffMins + ' min';
  //     }
  //     else if (diffDays === 0 && diffMins !== 0 && diffHrs !== 0) {
  //       return diffHrs + ' hr ' + diffMins + ' min';
  //     }
  //     else if (diffDays !== 0 && diffMins === 0 && diffHrs !== 0) {
  //       return diffDays + ' dy ' + diffHrs + ' hr ';
  //     }
  //     else if (diffDays !== 0 && diffMins !== 0 && diffHrs === 0) {
  //       return diffDays + ' dy ' + diffMins + ' min';
  //     }
  //     else if (diffDays === 0 && diffMins !== 0 && diffHrs === 0) {
  //       return diffMins + ' min';
  //     }
  //     else if (diffDays === 0 && diffMins === 0 && diffHrs !== 0) {
  //       return diffHrs + ' hr ';
  //     }
  //     else if (diffDays !== 0 && diffMins === 0 && diffHrs === 0) {
  //       return diffDays + ' dy ';
  //     }
  //     else if (diffDays === 0 && diffMins === 0 && diffHrs === 0) {
  //       return ' - ';
  //     }
  //     else {
  //       return ' - ';
  //     }
  //   }
  //   else {
  //     return '-';
  //   }

  // }

  // getTAT(entryDate: string): any {
  //   if (entryDate !== '' && entryDate !== null) {
  //     //Africa/Lagos   
  //     //Asia/Kolkata
  //     var aestTime = new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" });
  //     var aestTime1 = new Date(aestTime);
  //     const diff = aestTime1.getTime() - new Date(entryDate).getTime();
  //     if (Math.sign(diff) == -1 || Math.sign(diff) == -0) {
  //       return '-';
  //     }
  //     // if (Math.sign(diff) == -1 || Math.sign(diff) == -0) {
  //     //   return '-';
  //     // }
  //     const day = 1000 * 60 * 60 * 24;
  //     const diffDays = Math.floor(diff / 86400000); // days
  //     const diffHrs = Math.floor((diff % 86400000) / 3600000); // hours
  //     const diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); // minutes
  //     const days = Math.floor(diff / day);
  //     const months = Math.floor(days / 31);
  //     const years = Math.floor(months / 12);
  //     if (diffDays !== 0 && diffMins !== 0 && diffHrs !== 0) {
  //       return diffDays + ' dy ' + diffHrs + ' hr ' + diffMins + ' min';
  //     }
  //     else if (diffDays === 0 && diffMins !== 0 && diffHrs !== 0) {
  //       return diffHrs + ' hr ' + diffMins + ' min';
  //     }
  //     else if (diffDays !== 0 && diffMins === 0 && diffHrs !== 0) {
  //       return diffDays + ' dy ' + diffHrs + ' hr ';
  //     }
  //     else if (diffDays !== 0 && diffMins !== 0 && diffHrs === 0) {
  //       return diffDays + ' dy ' + diffMins + ' min';
  //     }
  //     else if (diffDays === 0 && diffMins !== 0 && diffHrs === 0) {
  //       return diffMins + ' min';
  //     }
  //     else if (diffDays === 0 && diffMins === 0 && diffHrs !== 0) {
  //       return diffHrs + ' hr ';
  //     }
  //     else if (diffDays !== 0 && diffMins === 0 && diffHrs === 0) {
  //       return diffDays + ' dy ';
  //     }
  //     else if (diffDays === 0 && diffMins === 0 && diffHrs === 0) {
  //       return ' - ';
  //     }
  //     else {
  //       return ' - ';
  //     }
  //   }
  //   else {
  //     return '-';
  //   }

  // }

}
