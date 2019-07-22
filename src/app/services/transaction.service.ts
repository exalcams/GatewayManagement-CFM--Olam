import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthenticationDetails } from 'app/models/authentication_details';
import { Guid } from 'guid-typescript';
import { catchError } from 'rxjs/operators';
import { TransactionDetails, CommonFilters } from 'app/models/transaction-details';
@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  baseAddress: string;
  NotificationEvent: Subject<any>;
  authenticationDetails: AuthenticationDetails;
  GetNotification(): Observable<any> {
    return this.NotificationEvent.asObservable();
  }

  TriggerNotification(eventName: string): void {
    this.NotificationEvent.next(eventName);
  }

  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseAddress = _authService.baseAddress;
    this.NotificationEvent = new Subject();
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    }
  }
  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || 'Server Error');
  }

  GetAllTransactionDetailsWithOutGateExit(ID: Guid): Observable<TransactionDetails[] | string> {
    return this._httpClient.get<TransactionDetails[]>(`${this.baseAddress}api/TransactionDetails/GetAllTransactionDetailsWithOutGateExit?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetTransactionDetailsByValue(ID: Guid ,Value: string ): Observable<TransactionDetails[] | string> {
    return this._httpClient.get<TransactionDetails[]>(`${this.baseAddress}api/TransactionDetails/GetTransactionDetailsByValue?Value=${Value}&UserID=${ID}`)
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
}
