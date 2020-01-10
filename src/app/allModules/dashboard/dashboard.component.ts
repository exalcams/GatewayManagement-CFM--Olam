// tslint:disable-next-line: quotemark
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { AuthenticationDetails } from "app/models/authentication-details";
import { NotificationSnackBarComponent } from "app/notifications/notification-snack-bar/notification-snack-bar.component";
import {
    MatSnackBar,
    MatTableDataSource,
    MatPaginator,
    MatSort,
    MatDialog,
    MatDialogConfig
} from "@angular/material";
import { Router } from "@angular/router";
import {
    TransactionDetails,
    ExceptionDetails,
    CommonFilters
} from "app/models/transaction-details";
import { TransactionDetailsService } from "app/services/transaction-details.service";
import { SnackBarStatus } from "app/notifications/snackbar-status-enum";
import { Guid } from "guid-typescript";
import { DashboardDetailComponent } from "./dashboard-detail/dashboard-detail.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DashboardComponent implements OnInit {
    // Variable declarations
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
    displayedColumns = [
        "VEHICLE_NO",
        "GENTRY_DATE_ONLY",
        "GENTRY_TIME_ONLY",
        "TAT",
        "STATUS_DESCRIPTION",
        "CUR_STATUS",
        "TRUCK_ID",
        "TRANSACTION_ID",
        "TYPE",
        "BAY",
        "PROCESS_TYPE",
        "DRIVER_DETAILS",
        "DRIVER_NO",
        "TRANSPORTER_NAME",
        "CUSTOMER_NAME",
        "MATERIAL",
        "FG_DESCRIPTION"
    ];
    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    @ViewChild(MatSort)
    sort: MatSort;

    constructor(
        private _router: Router,
        public snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private _dashboardService: TransactionDetailsService,
        public _matDialog: MatDialog
    ) {
        this.authenticationDetails = new AuthenticationDetails();
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(
            this.snackBar
        );
        this.IsProgressBarVisibile = true;
        this.commonFilterFormGroup = this._formBuilder.group({
            VEHICLE_NO: [""],
            FROMDATE: [""],
            TODATE: [""]
            //  FROMDATE: ['', Validators.required],
            //  TODATE: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        //  Retrive authorizationData
        const retrievedObject = localStorage.getItem("authorizationData");
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(
                retrievedObject
            ) as AuthenticationDetails;
        } else {
            this._router.navigate(["/auth/login"]);
        }
        this.GetAllVehicleNos();
        this.GetAllTotalInPremisesDetailsCount(
            this.authenticationDetails.userID
        );
        // this.GetAllExceptionDetailsCount(this.authenticationDetails.userID);
        // this.GetAllInTransistDetailsCount(this.authenticationDetails.userID);
        // this.GetAllCompletedDetailsCount(this.authenticationDetails.userID);
        this.GetAllGateEntryDetailsCount(this.authenticationDetails.userID);
        this.GetAllParkingDetailsCount(this.authenticationDetails.userID);
        this.GetAllWeighmentDetailsCount(this.authenticationDetails.userID);
        this.GetAllLoadingDetailsCount(this.authenticationDetails.userID);
        this.GetAllUnLoadingDetailsCount(this.authenticationDetails.userID);
        this.GetAllTransDetailsTATGreaterFourLessEightHrsCount(
            this.authenticationDetails.userID
        );
        this.GetAllTransDetailsTATGreaterTwoLessFourHrsCount(
            this.authenticationDetails.userID
        );
        this.GetAllTransDetailsTATGreaterEightHrsCount(
            this.authenticationDetails.userID
        );

        this.GetAllWeighment1DetailsCount(this.authenticationDetails.userID);
        this.GetAllGateEntryTodayDetailsCount(
            this.authenticationDetails.userID
        );
        this.GetAllGateExitTodayDetailsCount(this.authenticationDetails.userID);
        this.GetAllAwaitingGateExitTodayDetailsCount(
            this.authenticationDetails.userID
        );
        this.SetIntervalID = setInterval(() => {
            this.GetAllTotalInPremisesDetailsCount(
                this.authenticationDetails.userID
            );
            //  this.GetAllExceptionDetailsCount(this.authenticationDetails.userID);
            //  this.GetAllInTransistDetailsCount(this.authenticationDetails.userID);
            //  this.GetAllCompletedDetailsCount(this.authenticationDetails.userID);
            this.GetAllGateEntryDetailsCount(this.authenticationDetails.userID);
            this.GetAllParkingDetailsCount(this.authenticationDetails.userID);
            this.GetAllWeighmentDetailsCount(this.authenticationDetails.userID);
            this.GetAllLoadingDetailsCount(this.authenticationDetails.userID);
            this.GetAllUnLoadingDetailsCount(this.authenticationDetails.userID);
            this.GetAllTransDetailsTATGreaterFourLessEightHrsCount(
                this.authenticationDetails.userID
            );
            this.GetAllTransDetailsTATGreaterTwoLessFourHrsCount(
                this.authenticationDetails.userID
            );
            this.GetAllTransDetailsTATGreaterEightHrsCount(
                this.authenticationDetails.userID
            );

            this.GetAllWeighment1DetailsCount(
                this.authenticationDetails.userID
            );
            this.GetAllGateEntryTodayDetailsCount(
                this.authenticationDetails.userID
            );
            this.GetAllGateExitTodayDetailsCount(
                this.authenticationDetails.userID
            );
            this.GetAllAwaitingGateExitTodayDetailsCount(
                this.authenticationDetails.userID
            );
        }, 4000);
    }

    //  tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {
        //  Unsubscribe from all subscriptions
        if (this.SetIntervalID) {
            clearInterval(this.SetIntervalID);
        }
    }

    //  tslint:disable-next-line:typedef
    applyCommonFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    goBackToDashboard(): void {
        this.diagramShow = false;
        this.tableShow = true;
    }

    // GET all counts of transactions

    GetAllGateEntryTodayDetailsCount(ID: Guid): void {
        this._dashboardService.GetAllGateEntryTodayDetailsCount(ID).subscribe(
            data => {
                this.inGateEntryTodayCount = data as number;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllGateExitTodayDetailsCount(ID: Guid): void {
        this._dashboardService.GetAllGateExitTodayDetailsCount(ID).subscribe(
            data => {
                this.inGateExitTodayCount = data as number;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllAwaitingGateExitTodayDetailsCount(ID: Guid): void {
        this._dashboardService
            .GetAllAwaitingGateExitTodayDetailsCount(ID)
            .subscribe(
                data => {
                    this.inAwaitingGateExitTodayCount = data as number;
                    this.IsProgressBarVisibile = false;
                },
                err => {
                    this.IsProgressBarVisibile = false;
                    this.notificationSnackBarComponent.openSnackBar(
                        err instanceof Object ? "Something went wrong" : err,
                        SnackBarStatus.danger
                    );
                }
            );
    }

    GetAllWeighment1DetailsCount(ID: Guid): void {
        this._dashboardService.GetAllWeighment1DetailsCount(ID).subscribe(
            data => {
                this.inWeighment1Count = data as number;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllTransactionDetailsCount(ID: Guid): void {
        this._dashboardService.GetAllTransactionDetailsCount(ID).subscribe(
            data => {
                this.totalTrucksCount = data as number;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllTotalInPremisesDetailsCount(ID: Guid): void {
        this._dashboardService.GetAllTotalInPremisesDetailsCount(ID).subscribe(
            data => {
                this.totalInPremisesCount = data as number;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllGateEntryDetailsCount(ID: Guid): void {
        this._dashboardService.GetAllGateEntryDetailsCount(ID).subscribe(
            data => {
                this.inGateCount = data as number;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllParkingDetailsCount(ID: Guid): void {
        this._dashboardService.GetAllParkingDetailsCount(ID).subscribe(
            data => {
                this.inParkingCount = data as number;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllWeighmentDetailsCount(ID: Guid): void {
        this._dashboardService.GetAllWeighmentDetailsCount(ID).subscribe(
            data => {
                this.inWeighmentCount = data as number;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllLoadingDetailsCount(ID: Guid): void {
        this._dashboardService.GetAllLoadingDetailsCount(ID).subscribe(
            data => {
                this.inLoadingCount = data as number;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllUnLoadingDetailsCount(ID: Guid): void {
        this._dashboardService.GetAllUnLoadingDetailsCount(ID).subscribe(
            data => {
                this.inUnLoadingCount = data as number;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllTransDetailsTATGreaterTwoLessFourHrsCount(ID: Guid): void {
        this._dashboardService
            .GetAllTransDetailsTATGreaterTwoLessFourHrsCount(ID)
            .subscribe(
                data => {
                    this.tatGreaterTwoLessFourHrsCount = data as number;
                    this.IsProgressBarVisibile = false;
                },
                err => {
                    this.IsProgressBarVisibile = false;
                    this.notificationSnackBarComponent.openSnackBar(
                        err instanceof Object ? "Something went wrong" : err,
                        SnackBarStatus.danger
                    );
                }
            );
    }

    GetAllTransDetailsTATGreaterFourLessEightHrsCount(ID: Guid): void {
        this._dashboardService
            .GetAllTransDetailsTATGreaterFourLessEightHrsCount(ID)
            .subscribe(
                data => {
                    this.tatGreaterFourLessEightHrsCount = data as number;
                    this.IsProgressBarVisibile = false;
                },
                err => {
                    this.IsProgressBarVisibile = false;
                    this.notificationSnackBarComponent.openSnackBar(
                        err instanceof Object ? "Something went wrong" : err,
                        SnackBarStatus.danger
                    );
                }
            );
    }

    GetAllTransDetailsTATGreaterEightHrsCount(ID: Guid): void {
        this._dashboardService
            .GetAllTransDetailsTATGreaterEightHrsCount(ID)
            .subscribe(
                data => {
                    this.tatGreaterEightHrsCount = data as number;
                    this.IsProgressBarVisibile = false;
                },
                err => {
                    this.IsProgressBarVisibile = false;
                    this.notificationSnackBarComponent.openSnackBar(
                        err instanceof Object ? "Something went wrong" : err,
                        SnackBarStatus.danger
                    );
                }
            );
    }

    // GET all transactions

    GetAllGateEntryTodayDetails(ID: Guid): void {
        this.IsProgressBarVisibile = true;
        this._dashboardService.GetAllGateEntryTodayDetails(ID).subscribe(
            data => {
                this.AllTransactionDetails = data as TransactionDetails[];
                //  this.AllTransactionDetails.forEach(element => {
                //    element.GENTRY_DATE = element.GENTRY_TIME;
                // tslint:disable-next-line: max-line-length
                //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                //  });
                this.inGateEntryTodayCount = this.AllTransactionDetails.length;
                this.dataSource = new MatTableDataSource(
                    this.AllTransactionDetails
                );
                this.dataSource.sortingDataAccessor = (item, property) => {
                    switch (property) {
                        case "TAT": {
                            return item.TAT_TIMESPAN_VAL;
                        }
                        case "GENTRY_DATE_ONLY": {
                            return new Date(item.GENTRY_TIME);
                        }
                        default: {
                            return item[property];
                        }
                    }
                };
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllGateExitTodayDetails(ID: Guid): void {
        this.IsProgressBarVisibile = true;
        this._dashboardService.GetAllGateExitTodayDetails(ID).subscribe(
            data => {
                this.AllTransactionDetails = data as TransactionDetails[];
                //  this.AllTransactionDetails.forEach(element => {
                //    element.GENTRY_DATE = element.GENTRY_TIME;
                // tslint:disable-next-line: max-line-length
                //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                //  });
                this.inGateExitTodayCount = this.AllTransactionDetails.length;
                this.dataSource = new MatTableDataSource(
                    this.AllTransactionDetails
                );
                this.dataSource.sortingDataAccessor = (item, property) => {
                    switch (property) {
                        case "TAT": {
                            return item.TAT_TIMESPAN_VAL;
                        }
                        case "GENTRY_DATE_ONLY": {
                            return new Date(item.GENTRY_TIME);
                        }
                        default: {
                            return item[property];
                        }
                    }
                };
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllAwaitingGateExitTodayDetails(ID: Guid): void {
        this.IsProgressBarVisibile = true;
        this._dashboardService.GetAllAwaitingGateExitTodayDetails(ID).subscribe(
            data => {
                this.AllTransactionDetails = data as TransactionDetails[];
                //  this.AllTransactionDetails.forEach(element => {
                //    element.GENTRY_DATE = element.GENTRY_TIME;
                //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                //  });
                this.inAwaitingGateExitTodayCount = this.AllTransactionDetails.length;
                this.dataSource = new MatTableDataSource(
                    this.AllTransactionDetails
                );
                this.dataSource.sortingDataAccessor = (item, property) => {
                    switch (property) {
                        case "TAT": {
                            return item.TAT_TIMESPAN_VAL;
                        }
                        case "GENTRY_DATE_ONLY": {
                            return new Date(item.GENTRY_TIME);
                        }
                        default: {
                            return item[property];
                        }
                    }
                };
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllWeighment1Details(ID: Guid): void {
        this.IsProgressBarVisibile = true;
        this._dashboardService.GetAllWeighment1Details(ID).subscribe(
            data => {
                this.AllTransactionDetails = data as TransactionDetails[];
                //  this.AllTransactionDetails.forEach(element => {
                //    element.GENTRY_DATE = element.GENTRY_TIME;
                //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                //  });
                this.inWeighment1Count = this.AllTransactionDetails.length;
                this.dataSource = new MatTableDataSource(
                    this.AllTransactionDetails
                );
                this.dataSource.sortingDataAccessor = (item, property) => {
                    switch (property) {
                        case "TAT": {
                            return item.TAT_TIMESPAN_VAL;
                        }
                        case "GENTRY_DATE_ONLY": {
                            return new Date(item.GENTRY_TIME);
                        }
                        default: {
                            return item[property];
                        }
                    }
                };
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllTotalInPremisesDetails(ID: Guid): void {
        this.IsProgressBarVisibile = true;
        this._dashboardService.GetAllTotalInPremisesDetails(ID).subscribe(
            data => {
                this.AllTransactionDetails = data as TransactionDetails[];
                //  this.AllTransactionDetails.forEach(element => {
                //    element.GENTRY_DATE = element.GENTRY_TIME;
                //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                //  });
                this.totalInPremisesCount = this.AllTransactionDetails.length;
                this.dataSource = new MatTableDataSource(
                    this.AllTransactionDetails
                );
                this.dataSource.sortingDataAccessor = (item, property) => {
                    switch (property) {
                        case "TAT": {
                            return item.TAT_TIMESPAN_VAL;
                        }
                        case "GENTRY_DATE_ONLY": {
                            return new Date(item.GENTRY_TIME);
                        }
                        default: {
                            return item[property];
                        }
                    }
                };
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllGateEntryDetails(ID: Guid): void {
        this.IsProgressBarVisibile = true;
        this._dashboardService.GetAllGateEntryDetails(ID).subscribe(
            data => {
                this.AllTransactionDetails = data as TransactionDetails[];
                //  this.AllTransactionDetails.forEach(element => {
                //    element.GENTRY_DATE = element.GENTRY_TIME;
                //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                //  });
                this.inGateCount = this.AllTransactionDetails.length;
                this.dataSource = new MatTableDataSource(
                    this.AllTransactionDetails
                );
                this.dataSource.sortingDataAccessor = (item, property) => {
                    switch (property) {
                        case "TAT": {
                            return item.TAT_TIMESPAN_VAL;
                        }
                        case "GENTRY_DATE_ONLY": {
                            return new Date(item.GENTRY_TIME);
                        }
                        default: {
                            return item[property];
                        }
                    }
                };
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllParkingDetails(ID: Guid): void {
        this.IsProgressBarVisibile = true;
        this._dashboardService.GetAllParkingDetails(ID).subscribe(
            data => {
                this.AllTransactionDetails = data as TransactionDetails[];
                //  this.AllTransactionDetails.forEach(element => {
                //    element.GENTRY_DATE = element.GENTRY_TIME;
                //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                //  });
                this.inParkingCount = this.AllTransactionDetails.length;
                this.dataSource = new MatTableDataSource(
                    this.AllTransactionDetails
                );
                this.dataSource.sortingDataAccessor = (item, property) => {
                    switch (property) {
                        case "TAT": {
                            return item.TAT_TIMESPAN_VAL;
                        }
                        case "GENTRY_DATE_ONLY": {
                            return new Date(item.GENTRY_TIME);
                        }
                        default: {
                            return item[property];
                        }
                    }
                };
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllWeighmentDetails(ID: Guid): void {
        this.IsProgressBarVisibile = true;
        this._dashboardService.GetAllWeighmentDetails(ID).subscribe(
            data => {
                this.AllTransactionDetails = data as TransactionDetails[];
                //  this.AllTransactionDetails.forEach(element => {
                //    element.GENTRY_DATE = element.GENTRY_TIME;
                //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                //  });
                this.inWeighmentCount = this.AllTransactionDetails.length;
                this.dataSource = new MatTableDataSource(
                    this.AllTransactionDetails
                );
                this.dataSource.sortingDataAccessor = (item, property) => {
                    switch (property) {
                        case "TAT": {
                            return item.TAT_TIMESPAN_VAL;
                        }
                        case "GENTRY_DATE_ONLY": {
                            return new Date(item.GENTRY_TIME);
                        }
                        default: {
                            return item[property];
                        }
                    }
                };
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllLoadingDetails(ID: Guid): void {
        this.IsProgressBarVisibile = true;
        this._dashboardService.GetAllLoadingDetails(ID).subscribe(
            data => {
                this.AllTransactionDetails = data as TransactionDetails[];
                //  this.AllTransactionDetails.forEach(element => {
                //    element.GENTRY_DATE = element.GENTRY_TIME;
                //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                //  });
                this.inLoadingCount = this.AllTransactionDetails.length;
                this.dataSource = new MatTableDataSource(
                    this.AllTransactionDetails
                );
                this.dataSource.sortingDataAccessor = (item, property) => {
                    switch (property) {
                        case "TAT": {
                            return item.TAT_TIMESPAN_VAL;
                        }
                        case "GENTRY_DATE_ONLY": {
                            return new Date(item.GENTRY_TIME);
                        }
                        default: {
                            return item[property];
                        }
                    }
                };
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllUnLoadingDetails(ID: Guid): void {
        this.IsProgressBarVisibile = true;
        this._dashboardService.GetAllUnLoadingDetails(ID).subscribe(
            data => {
                this.AllTransactionDetails = data as TransactionDetails[];
                //  this.AllTransactionDetails.forEach(element => {
                //    element.GENTRY_DATE = element.GENTRY_TIME;
                //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                //  });
                this.inUnLoadingCount = this.AllTransactionDetails.length;
                this.dataSource = new MatTableDataSource(
                    this.AllTransactionDetails
                );
                this.dataSource.sortingDataAccessor = (item, property) => {
                    switch (property) {
                        case "TAT": {
                            return item.TAT_TIMESPAN_VAL;
                        }
                        case "GENTRY_DATE_ONLY": {
                            return new Date(item.GENTRY_TIME);
                        }
                        default: {
                            return item[property];
                        }
                    }
                };
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.IsProgressBarVisibile = false;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllTransDetailsTATGreaterTwoLessFourHrs(ID: Guid): void {
        this.IsProgressBarVisibile = true;
        this._dashboardService
            .GetAllTransDetailsTATGreaterTwoLessFourHrs(ID)
            .subscribe(
                data => {
                    this.AllTransactionDetails = data as TransactionDetails[];
                    //  this.AllTransactionDetails.forEach(element => {
                    //    element.GENTRY_DATE = element.GENTRY_TIME;
                    //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                    //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                    //  });
                    this.tatGreaterTwoLessFourHrsCount = this.AllTransactionDetails.length;
                    this.dataSource = new MatTableDataSource(
                        this.AllTransactionDetails
                    );
                    this.dataSource.sortingDataAccessor = (item, property) => {
                        switch (property) {
                            case "TAT": {
                                return item.TAT_TIMESPAN_VAL;
                            }
                            case "GENTRY_DATE_ONLY": {
                                return new Date(item.GENTRY_TIME);
                            }
                            default: {
                                return item[property];
                            }
                        }
                    };
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.IsProgressBarVisibile = false;
                },
                err => {
                    this.IsProgressBarVisibile = false;
                    this.notificationSnackBarComponent.openSnackBar(
                        err instanceof Object ? "Something went wrong" : err,
                        SnackBarStatus.danger
                    );
                }
            );
    }

    GetAllTransDetailsTATGreaterFourLessEightHrs(ID: Guid): void {
        this.IsProgressBarVisibile = true;
        this._dashboardService
            .GetAllTransDetailsTATGreaterFourLessEightHrs(ID)
            .subscribe(
                data => {
                    this.AllTransactionDetails = data as TransactionDetails[];
                    //  this.AllTransactionDetails.forEach(element => {
                    //    element.GENTRY_DATE = element.GENTRY_TIME;
                    //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                    //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                    //  });
                    this.tatGreaterFourLessEightHrsCount = this.AllTransactionDetails.length;
                    this.dataSource = new MatTableDataSource(
                        this.AllTransactionDetails
                    );
                    this.dataSource.sortingDataAccessor = (item, property) => {
                        switch (property) {
                            case "TAT": {
                                return item.TAT_TIMESPAN_VAL;
                            }
                            case "GENTRY_DATE_ONLY": {
                                return new Date(item.GENTRY_TIME);
                            }
                            default: {
                                return item[property];
                            }
                        }
                    };
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.IsProgressBarVisibile = false;
                },
                err => {
                    this.IsProgressBarVisibile = false;
                    this.notificationSnackBarComponent.openSnackBar(
                        err instanceof Object ? "Something went wrong" : err,
                        SnackBarStatus.danger
                    );
                }
            );
    }

    GetAllTransDetailsTATGreaterEightHrs(ID: Guid): void {
        this._dashboardService
            .GetAllTransDetailsTATGreaterEightHrs(ID)
            .subscribe(
                data => {
                    this.AllTransactionDetails = data as TransactionDetails[];
                    //  this.AllTransactionDetails.forEach(element => {
                    //    element.GENTRY_DATE = element.GENTRY_TIME;
                    //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                    //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                    //  });
                    this.tatGreaterEightHrsCount = this.AllTransactionDetails.length;
                    this.dataSource = new MatTableDataSource(
                        this.AllTransactionDetails
                    );
                    this.dataSource.sortingDataAccessor = (item, property) => {
                        switch (property) {
                            case "TAT": {
                                return item.TAT_TIMESPAN_VAL;
                            }
                            case "GENTRY_DATE_ONLY": {
                                return new Date(item.GENTRY_TIME);
                            }
                            default: {
                                return item[property];
                            }
                        }
                    };
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.IsProgressBarVisibile = false;
                },
                err => {
                    this.IsProgressBarVisibile = false;
                    this.notificationSnackBarComponent.openSnackBar(
                        err instanceof Object ? "Something went wrong" : err,
                        SnackBarStatus.danger
                    );
                }
            );
    }

    GetTransactionDetailsByValue(val: string, ID: Guid): void {
        this._dashboardService.GetTransactionDetailsByValue(val, ID).subscribe(
            data => {
                this.AllTransactionDetailsByValue = data as TransactionDetails[];
                //  this.AllTransactionDetailsByValue.forEach(element => {
                //    element.GENTRY_DATE = element.GENTRY_TIME;
                //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                //  });
                this.IsProgressBarVisibile = false;
                this.dataSource = new MatTableDataSource(
                    this.AllTransactionDetailsByValue
                );
                this.dataSource.sortingDataAccessor = (item, property) => {
                    switch (property) {
                        case "TAT": {
                            return item.TAT_TIMESPAN_VAL;
                        }
                        case "GENTRY_DATE_ONLY": {
                            return new Date(item.GENTRY_TIME);
                        }
                        default: {
                            return item[property];
                        }
                    }
                };
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            err => {
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    err instanceof Object ? "Something went wrong" : err,
                    SnackBarStatus.danger
                );
            }
        );
    }

    GetAllTransactionsBasedOnFilter(filterName: string): void {
        if (this.commonFilterFormGroup.valid) {
            const VEHICLE_NO: string = this.commonFilterFormGroup.get(
                "VEHICLE_NO"
            ).value;
            const FROMDATE = this.datePipe.transform(
                this.commonFilterFormGroup.get("FROMDATE").value as Date,
                "yyyy-MM-dd"
            );
            const TODATE = this.datePipe.transform(
                this.commonFilterFormGroup.get("TODATE").value as Date,
                "yyyy-MM-dd"
            );
            const USERID: Guid = this.authenticationDetails.userID;
            this.commonFilters = new CommonFilters();
            this.commonFilters.FILTER_NAME = filterName;
            this.commonFilters.UserID = USERID;
            this.commonFilters.VEHICLE_NO = VEHICLE_NO;
            this.commonFilters.FROMDATE = FROMDATE;
            this.commonFilters.TODATE = TODATE;
            //  tslint:disable-next-line:max-line-length
            if (
                (this.commonFilters.VEHICLE_NO !== "" &&
                    this.commonFilters.VEHICLE_NO !== null &&
                    this.commonFilters.FROMDATE === "" &&
                    this.commonFilters.TODATE === "") ||
                (this.commonFilters.FROMDATE === null &&
                    this.commonFilters.TODATE === null)
            ) {
                //  this.authenticationDetails.userID, VEHICLE_NO, FROMDATE, TODATE
                this.IsProgressBarVisibile = true;
                this._dashboardService
                    .GetAllTransactionsBasedOnVehicleNoFilter(
                        this.commonFilters
                    )
                    .subscribe(
                        data => {
                            this.diagramShow = true;
                            this.commonTableShowName = this.commonFilters.FILTER_NAME;
                            this.tableShow = false;
                            this.commonTableShow = true;
                            this.AllTransactionDetails = data as TransactionDetails[];
                            //  if (this.AllTransactionDetails.length > 0) {
                            //  this.AllTransactionDetails.forEach(element => {
                            //    element.GENTRY_DATE = element.GENTRY_TIME;
                            //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                            //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                            //  });
                            this.dataSource = new MatTableDataSource(
                                this.AllTransactionDetails
                            );
                            this.dataSource.sortingDataAccessor = (
                                item,
                                property
                            ) => {
                                switch (property) {
                                    case "TAT": {
                                        console.log("Inside TAT");
                                        return item.TAT_TIMESPAN_VAL;
                                    }
                                    default: {
                                        return item[property];
                                    }
                                }
                            };
                            // console.log(this.AllTransactionDetails);
                            //  this.commonFilters = null;
                            //  this.commonFilterFormGroup.reset();
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                            //  }
                            this.IsProgressBarVisibile = false;
                        },
                        err => {
                            console.log(err);
                            this.notificationSnackBarComponent.openSnackBar(
                                err instanceof Object
                                    ? "Something went wrong"
                                    : err,
                                SnackBarStatus.danger
                            );
                        }
                    );
            }
            //  tslint:disable-next-line:max-line-length
            else if (
                (this.commonFilters.FROMDATE !== "" &&
                    this.commonFilters.TODATE !== "" &&
                    this.commonFilters.FROMDATE !== null &&
                    this.commonFilters.TODATE !== null &&
                    this.commonFilters.VEHICLE_NO === "") ||
                this.commonFilters.VEHICLE_NO === null
            ) {
                //  this.authenticationDetails.userID, VEHICLE_NO, FROMDATE, TODATE
                this.IsProgressBarVisibile = true;
                this._dashboardService
                    .GetAllTransactionsBasedOnDateFilter(this.commonFilters)
                    .subscribe(
                        data => {
                            this.diagramShow = true;
                            this.commonTableShowName = this.commonFilters.FILTER_NAME;
                            this.tableShow = false;
                            this.commonTableShow = true;
                            this.AllTransactionDetails = data as TransactionDetails[];
                            //  this.AllTransactionDetails.forEach(element => {
                            //    element.GENTRY_DATE = element.GENTRY_TIME;
                            //    element.STATUS_DESCRIPTION = element.CUR_STATUS == 'GENTRY' ? 'Gate Entry' : element.CUR_STATUS == 'ULENTRY' ? 'Unloading Entry' : element.CUR_STATUS == 'ULEXIT' ? 'Unloading Exit' : element.CUR_STATUS == 'LEXIT' ? 'Loading Exit' : element.CUR_STATUS == 'LENTRY' ? 'Loading Entry' : element.CUR_STATUS == 'PENTRY' ? 'Parking Entry' : element.CUR_STATUS == 'PEXIT' ? 'Parking Exit' : element.CUR_STATUS == 'GEXIT' ? 'Gate Exit' : element.CUR_STATUS == 'W1ENTRY' ? 'Weighment 1 Entry' : element.CUR_STATUS == 'W1EXIT' ? 'Weighment 1 Exit' : element.CUR_STATUS == 'W2ENTRY' ? 'Weighment 2 Entry' : element.CUR_STATUS == 'W2EXIT' ? 'Weighment 2 Exit' : '';
                            //    element.TAT = this.getTAT(element.GENTRY_TIME.toString());
                            //  });
                            //  if (this.AllTransactionDetails.length > 0) {
                            this.dataSource = new MatTableDataSource(
                                this.AllTransactionDetails
                            );
                            this.dataSource.sortingDataAccessor = (
                                item,
                                property
                            ) => {
                                switch (property) {
                                    case "TAT": {
                                        console.log("Inside TAT");
                                        return item.TAT_TIMESPAN_VAL;
                                    }
                                    default: {
                                        return item[property];
                                    }
                                }
                            };
                            //  console.log(this.AllTransactionDetails);
                            //  this.commonFilters = null;
                            //   this.commonFilterFormGroup.reset();
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                            //  }
                            this.IsProgressBarVisibile = false;
                        },
                        err => {
                            console.log(err);
                            this.notificationSnackBarComponent.openSnackBar(
                                err instanceof Object
                                    ? "Something went wrong"
                                    : err,
                                SnackBarStatus.danger
                            );
                        }
                    );
            } else {
                //  this.commonFilterFormGroup.reset();
                this.IsProgressBarVisibile = false;
                this.notificationSnackBarComponent.openSnackBar(
                    "It requires at least a field or From Date and To Date",
                    SnackBarStatus.danger
                );
            }
        }
        Object.keys(this.commonFilterFormGroup.controls).forEach(key => {
            this.commonFilterFormGroup.get(key).markAsTouched();
            this.commonFilterFormGroup.get(key).markAsDirty();
        });
        //  this.commonFilterFormGroup.reset();
    }

    GetAllVehicleNos(): void {
        this._dashboardService
            .GetAllVehicleNos(this.authenticationDetails.userID)
            .subscribe(
                data => {
                    if (data) {
                        this.AllVehicleNos = data as string[];
                    }
                },
                err => {
                    console.log(err);
                    this.notificationSnackBarComponent.openSnackBar(
                        err instanceof Object ? "Something went wrong" : err,
                        SnackBarStatus.danger
                    );
                }
            );
    }

    loadSelectedTileDetails(tile: string): void {
        this.commonFilterFormGroup.reset();
        if (tile.toLowerCase() === "totalinpremises") {
            this.diagramShow = true;
            this.tableShow = false;
            this.commonTableShowName = "Total In Premises";
            this.commonTableShow = true;
            this.isCommonTableFilter = true;
            // this.dataSource = null;
            this.GetAllTotalInPremisesDetails(
                this.authenticationDetails.userID
            );
        } else if (tile.toLowerCase() === "ingate") {
            this.diagramShow = true;
            this.tableShow = false;
            this.commonTableShowName = "In Gate";
            this.commonTableShow = true;
            this.isCommonTableFilter = true;
            // this.dataSource = null;
            this.GetAllGateEntryDetails(this.authenticationDetails.userID);
        } else if (tile.toLowerCase() === "inparking") {
            this.diagramShow = true;
            this.tableShow = false;
            this.commonTableShowName = "In Parking";
            this.commonTableShow = true;
            this.isCommonTableFilter = true;
            // this.dataSource = null;
            this.GetAllParkingDetails(this.authenticationDetails.userID);
        } else if (tile.toLowerCase() === "inweighment") {
            this.diagramShow = true;
            this.tableShow = false;
            this.commonTableShowName = "In Weighment";
            this.commonTableShow = true;
            this.isCommonTableFilter = true;
            // this.dataSource = null;
            this.GetAllWeighmentDetails(this.authenticationDetails.userID);
        } else if (tile.toLowerCase() === "inweighment1") {
            this.diagramShow = true;
            this.tableShow = false;
            this.commonTableShowName = "In Weighment";
            this.commonTableShow = true;
            this.isCommonTableFilter = true;
            // this.dataSource = null;
            this.GetAllWeighment1Details(this.authenticationDetails.userID);
        } else if (tile.toLowerCase() === "inloading") {
            this.diagramShow = true;
            this.tableShow = false;
            this.commonTableShowName = "In Loading";
            this.commonTableShow = true;
            this.isCommonTableFilter = true;
            //  this.dataSource = null;
            this.GetAllLoadingDetails(this.authenticationDetails.userID);
        } else if (tile.toLowerCase() === "inunloading") {
            this.diagramShow = true;
            this.tableShow = false;
            this.commonTableShowName = "In UnLoading";
            this.commonTableShow = true;
            this.isCommonTableFilter = true;
            // this.dataSource = null;
            this.GetAllUnLoadingDetails(this.authenticationDetails.userID);
        } else if (tile === "tatGreaterTwoLessFourHrs") {
            this.diagramShow = true;
            this.tableShow = false;
            this.commonTableShowName = "TAT Greater than 2 and Less than 4 hrs";
            this.commonTableShow = true;
            this.isCommonTableFilter = true;
            // this.dataSource = null;
            this.GetAllTransDetailsTATGreaterTwoLessFourHrs(
                this.authenticationDetails.userID
            );
        } else if (tile === "tatGreaterFourLessEightHrs") {
            this.diagramShow = true;
            this.tableShow = false;
            this.commonTableShowName = "TAT Greater than 4 and Less than 8 hrs";
            this.commonTableShow = true;
            this.isCommonTableFilter = true;
            // this.dataSource = null;
            this.GetAllTransDetailsTATGreaterFourLessEightHrs(
                this.authenticationDetails.userID
            );
        } else if (tile === "tatGreaterEightHrs") {
            this.diagramShow = true;
            this.tableShow = false;
            this.commonTableShowName = "TAT Greater than 8 hrs";
            this.commonTableShow = true;
            this.isCommonTableFilter = true;
            this.GetAllTransDetailsTATGreaterEightHrs(
                this.authenticationDetails.userID
            );
        } else if (tile === "inGateEntryToday") {
            this.diagramShow = true;
            this.tableShow = false;
            this.commonTableShowName = "Gate Entry";
            this.commonTableShow = true;
            this.isCommonTableFilter = false;
            this.GetAllGateEntryTodayDetails(this.authenticationDetails.userID);
        } else if (tile === "inGateExitToday") {
            this.diagramShow = true;
            this.tableShow = false;
            this.commonTableShowName = "Gate Exit";
            this.commonTableShow = true;
            this.isCommonTableFilter = false;
            this.GetAllGateExitTodayDetails(this.authenticationDetails.userID);
        } else if (tile === "inAwaitingGateExitToday") {
            this.diagramShow = true;
            this.tableShow = false;
            this.commonTableShowName = "Awaiting Gate Exit";
            this.commonTableShow = true;
            this.isCommonTableFilter = false;
            this.GetAllAwaitingGateExitTodayDetails(
                this.authenticationDetails.userID
            );
        }
    }

    loadSelectedStageDetails(value: string): void {
        this.commonFilterFormGroup.reset();
        if (value === "parking") {
            this.diagramShow = true;
            this.commonTableShowName = "Only Parking";
            this.tableShow = false;
            this.commonTableShow = true;
            this.isCommonTableFilter = true;
            this.GetTransactionDetailsByValue(
                value,
                this.authenticationDetails.userID
            );
        } else if (value === "loading") {
            this.diagramShow = true;
            this.commonTableShowName = "Only Loading";
            this.tableShow = false;
            this.commonTableShow = true;
            this.isCommonTableFilter = true;
            this.GetTransactionDetailsByValue(
                value,
                this.authenticationDetails.userID
            );
        } else if (value === "unloading") {
            this.diagramShow = true;
            this.commonTableShowName = "Only UnLoading";
            this.tableShow = false;
            this.commonTableShow = true;
            this.isCommonTableFilter = true;
            this.GetTransactionDetailsByValue(
                value,
                this.authenticationDetails.userID
            );
        } else if (value === "weighment") {
            this.diagramShow = true;
            this.commonTableShowName = "Only Weighment";
            this.tableShow = false;
            this.commonTableShow = true;
            this.isCommonTableFilter = true;
            this.GetTransactionDetailsByValue(
                value,
                this.authenticationDetails.userID
            );
        }
    }

    loadSelectedVehicleDetails(vehicleData: any): void {
        console.log(vehicleData);
        const dialogConfig = new MatDialogConfig();
        //  dialogConfig.disableClose = false;
        //  dialogConfig.autoFocus = true;
        dialogConfig.panelClass = "dashboard-detail";
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
        //  dialogConfig.data = vehicleData;
        //  this._matDialog.open(ContainerDetailsComponent, dialogConfig);
        const dialogRef = this._matDialog.open(
            DashboardDetailComponent,
            dialogConfig
        );
        //  dialogRef.afterClosed().subscribe(
        //    data => console.log('Dialog output:', data)
        //  );
    }

    loadSelectedTransactionDetails(row: TransactionDetails): void {
        this.SelectedTransactionDeatils = row;
        this._router.navigate([
            "/transactionDetails",
            this.SelectedTransactionDeatils.TRANS_ID
        ]);
    }

    //  getDate(exitDate: string, entryDate: string): any {
    //    if (exitDate !== '' && entryDate !== '' && exitDate !== null && entryDate !== null) {
    //      const diff = new Date(exitDate).getTime() - new Date(entryDate).getTime();
    //      if (Math.sign(diff) == -1 || Math.sign(diff) == -0) {
    //        return '-';
    //      }
    //      const day = 1000 * 60 * 60 * 24;
    //      const diffDays = Math.floor(diff / 86400000); //  days
    //      const diffHrs = Math.floor((diff % 86400000) / 3600000); //  hours
    //      const diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); //  minutes
    //      const days = Math.floor(diff / day);
    //      const months = Math.floor(days / 31);
    //      const years = Math.floor(months / 12);
    //      if (diffDays !== 0 && diffMins !== 0 && diffHrs !== 0) {
    //        return diffDays + ' dy ' + diffHrs + ' hr ' + diffMins + ' min';
    //      }
    //      else if (diffDays === 0 && diffMins !== 0 && diffHrs !== 0) {
    //        return diffHrs + ' hr ' + diffMins + ' min';
    //      }
    //      else if (diffDays !== 0 && diffMins === 0 && diffHrs !== 0) {
    //        return diffDays + ' dy ' + diffHrs + ' hr ';
    //      }
    //      else if (diffDays !== 0 && diffMins !== 0 && diffHrs === 0) {
    //        return diffDays + ' dy ' + diffMins + ' min';
    //      }
    //      else if (diffDays === 0 && diffMins !== 0 && diffHrs === 0) {
    //        return diffMins + ' min';
    //      }
    //      else if (diffDays === 0 && diffMins === 0 && diffHrs !== 0) {
    //        return diffHrs + ' hr ';
    //      }
    //      else if (diffDays !== 0 && diffMins === 0 && diffHrs === 0) {
    //        return diffDays + ' dy ';
    //      }
    //      else if (diffDays === 0 && diffMins === 0 && diffHrs === 0) {
    //        return ' - ';
    //      }
    //      else {
    //        return ' - ';
    //      }
    //    }
    //    else {
    //      return '-';
    //    }

    //  }

    //  getTAT(entryDate: string): any {
    //    if (entryDate !== '' && entryDate !== null) {
    //      // Africa/Lagos
    //      // Asia/Kolkata
    //      var aestTime = new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" });
    //      var aestTime1 = new Date(aestTime);
    //      const diff = aestTime1.getTime() - new Date(entryDate).getTime();
    //      if (Math.sign(diff) == -1 || Math.sign(diff) == -0) {
    //        return '-';
    //      }
    //      //  if (Math.sign(diff) == -1 || Math.sign(diff) == -0) {
    //      //    return '-';
    //      //  }
    //      const day = 1000 * 60 * 60 * 24;
    //      const diffDays = Math.floor(diff / 86400000); //  days
    //      const diffHrs = Math.floor((diff % 86400000) / 3600000); //  hours
    //      const diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); //  minutes
    //      const days = Math.floor(diff / day);
    //      const months = Math.floor(days / 31);
    //      const years = Math.floor(months / 12);
    //      if (diffDays !== 0 && diffMins !== 0 && diffHrs !== 0) {
    //        return diffDays + ' dy ' + diffHrs + ' hr ' + diffMins + ' min';
    //      }
    //      else if (diffDays === 0 && diffMins !== 0 && diffHrs !== 0) {
    //        return diffHrs + ' hr ' + diffMins + ' min';
    //      }
    //      else if (diffDays !== 0 && diffMins === 0 && diffHrs !== 0) {
    //        return diffDays + ' dy ' + diffHrs + ' hr ';
    //      }
    //      else if (diffDays !== 0 && diffMins !== 0 && diffHrs === 0) {
    //        return diffDays + ' dy ' + diffMins + ' min';
    //      }
    //      else if (diffDays === 0 && diffMins !== 0 && diffHrs === 0) {
    //        return diffMins + ' min';
    //      }
    //      else if (diffDays === 0 && diffMins === 0 && diffHrs !== 0) {
    //        return diffHrs + ' hr ';
    //      }
    //      else if (diffDays !== 0 && diffMins === 0 && diffHrs === 0) {
    //        return diffDays + ' dy ';
    //      }
    //      else if (diffDays === 0 && diffMins === 0 && diffHrs === 0) {
    //        return ' - ';
    //      }
    //      else {
    //        return ' - ';
    //      }
    //    }
    //    else {
    //      return '-';
    //    }

    //  }
}
