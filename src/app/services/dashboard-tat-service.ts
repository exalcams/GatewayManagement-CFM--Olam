import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError, Subject } from 'rxjs';
import { TransactionDetails, TransDetailsByID, ExceptionDetails, CommonFilters, DailyTATDetails, WeeklyTATDetails, MonthlyTATDetails } from 'app/models/transaction-details';
import { catchError } from 'rxjs/operators';
import { Guid } from 'guid-typescript';

@Injectable({
    providedIn: 'root'
})
export class DashboardTATService {
    baseAddress: string;
    SelectedTransactionDetail: TransactionDetails;
    exceptionCount: number;
    constructor(private _httpClient: HttpClient, private _authService: AuthService) {
        this.baseAddress = _authService.baseAddress;
    }

    GetSelectedTransactionDetails(): TransactionDetails {
        return this.SelectedTransactionDetail;
    }

    TriggerTransactionDetailsSelection(transactionDetails: TransactionDetails): void {
        this.SelectedTransactionDetail = transactionDetails;
        // this.TransactionDetailsSelectEvent.next(transactionDetails);
    }

    // Error Handler
    errorHandler(error: HttpErrorResponse): Observable<string> {
        return throwError(error.error || error.message || 'Server Error');
    }

    GetDailyTAT(ID: Guid, Option: string): Observable<DailyTATDetails | string> {
        return this._httpClient.get<DailyTATDetails>(`${this.baseAddress}api/TransactionDetails/GetDailyTAT?UserID=${ID}&Option=${Option}`)
            .pipe(catchError(this.errorHandler));
    }

    GetWeeklyTAT(ID: Guid, Option: string): Observable<WeeklyTATDetails | string> {
        return this._httpClient.get<WeeklyTATDetails>(`${this.baseAddress}api/TransactionDetails/GetWeeklyTAT?UserID=${ID}&Option=${Option}`)
            .pipe(catchError(this.errorHandler));
    }

    GetMonthlyTAT(ID: Guid, Option: string): Observable<MonthlyTATDetails | string> {
        return this._httpClient.get<MonthlyTATDetails>(`${this.baseAddress}api/TransactionDetails/GetMonthlyTAT?UserID=${ID}&Option=${Option}`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllDailyTATDetails(ID: Guid, Option: string): Observable<TransactionDetails[] | string> {
        return this._httpClient.get<TransactionDetails[]>(`${this.baseAddress}api/TransactionDetails/GetAllDailyTATDetails?UserID=${ID}&Option=${Option}`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllWeeklyTATDetails(ID: Guid, Option: string): Observable<TransactionDetails[] | string> {
        return this._httpClient.get<TransactionDetails[]>(`${this.baseAddress}api/TransactionDetails/GetAllWeeklyTATDetails?UserID=${ID}&Option=${Option}`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllMonthlyTATDetails(ID: Guid, Option: string): Observable<TransactionDetails[] | string> {
        return this._httpClient.get<TransactionDetails[]>(`${this.baseAddress}api/TransactionDetails/GetAllMonthlyTATDetails?UserID=${ID}&Option=${Option}`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllTransactionsBasedOnVehicleNoFilter(commonFilters: CommonFilters): Observable<TransactionDetails[] | string> {
        return this._httpClient.post<TransactionDetails[]>(`${this.baseAddress}api/TransactionDetails/GetAllTransactionsBasedOnVehicleNoFilter`, commonFilters)
            .pipe(catchError(this.errorHandler));
    }

    GetAllTransactionsBasedOnDateFilter(commonFilters: CommonFilters): Observable<TransactionDetails[] | string> {
        return this._httpClient.post<TransactionDetails[]>(`${this.baseAddress}api/TransactionDetails/GetAllTransactionsBasedOnDateFilter`, commonFilters)
            .pipe(catchError(this.errorHandler));
    }

    GetAllVehicleNos(ID: Guid): Observable<string[] | string> {
        return this._httpClient.get<string[]>(`${this.baseAddress}api/TransactionDetails/GetAllVehicleNos?UserID=${ID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetTransactionDetailsByValue(Value: string, GID: Guid): Observable<TransactionDetails[] | string> {
        return this._httpClient.get<TransactionDetails[]>(`${this.baseAddress}api/TransactionDetails/GetTransactionDetailsByValue?Value=${Value}&UserID=${GID}`)
            .pipe(catchError(this.errorHandler));
    }

}
