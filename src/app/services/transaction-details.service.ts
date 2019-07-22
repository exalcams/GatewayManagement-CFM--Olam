import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError, Subject } from 'rxjs';
import { TransactionDetails, TransDetailsByID, ExceptionDetails, CommonFilters } from 'app/models/transaction-details';
import { catchError } from 'rxjs/operators';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class TransactionDetailsService {
  baseAddress: string;

  // TransactionDetailsSelectEvent: Subject<TransactionDetails>;
  SelectedTransactionDetail: TransactionDetails;

  exceptionCount: number;

  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseAddress = _authService.baseAddress;
    // this.TransactionDetailsSelectEvent = new Subject<TransactionDetails>();
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

  CreateTransactionDetails(transactionDetails: TransactionDetails): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Account/CreateApp`,
      transactionDetails,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllTransactionDetails(ID: Guid): Observable<TransactionDetails[] | string> {
    return this._httpClient.get<TransactionDetails[]>(`${this.baseAddress}api/TransactionDetails/GetAllTransactionDetails?UserID=${ID}`)
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

  GetAllCompletedDetails(ID: Guid): Observable<TransactionDetails[] | string> {
    return this._httpClient.get<TransactionDetails[]>(`${this.baseAddress}api/TransactionDetails/GetAllCompletedDetails?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllInTransistDetails(ID: Guid): Observable<TransactionDetails[] | string> {
    return this._httpClient.get<TransactionDetails[]>(`${this.baseAddress}api/TransactionDetails/GetAllInTransistDetails?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }
  
  GetAllExceptionDetails(ID: Guid): Observable<ExceptionDetails[] | string> {
    return this._httpClient.get<ExceptionDetails[]>(`${this.baseAddress}api/TransactionDetails/GetAllExceptionDetails?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllParkingDetailsCount(ID: Guid): Observable<number  | string> {
    return this._httpClient.get<number>(`${this.baseAddress}api/TransactionDetails/GetAllParkingDetailsCount?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllWeighmentDetailsCount(ID: Guid): Observable<number  | string> {
    return this._httpClient.get<number>(`${this.baseAddress}api/TransactionDetails/GetAllWeighmentDetailsCount?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllLoadingDetailsCount(ID: Guid): Observable<number  | string> {
    return this._httpClient.get<number>(`${this.baseAddress}api/TransactionDetails/GetAllLoadingDetailsCount?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllUnLoadingDetailsCount(ID: Guid): Observable<number  | string> {
    return this._httpClient.get<number>(`${this.baseAddress}api/TransactionDetails/GetAllUnLoadingDetailsCount?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllTransactionDetailsCount(ID: Guid): Observable<number  | string> {
    return this._httpClient.get<number>(`${this.baseAddress}api/TransactionDetails/GetAllTransactionDetailsCount?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }
  

  GetAllCompletedDetailsCount(ID: Guid): Observable<number  | string> {
    return this._httpClient.get<number>(`${this.baseAddress}api/TransactionDetails/GetAllCompletedDetailsCount?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllInTransistDetailsCount(ID: Guid): Observable<number  | string> {
    return this._httpClient.get<number>(`${this.baseAddress}api/TransactionDetails/GetAllInTransistDetailsCount?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllExceptionDetailsCount(ID: Guid): Observable<number  | string> {
    return this._httpClient.get<number>(`${this.baseAddress}api/TransactionDetails/GetAllExceptionDetailsCount?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }
  

  GetTransactionDetailsByID(ID: number, GID: Guid): Observable<TransDetailsByID | string> {
    return this._httpClient.get<TransDetailsByID>(`${this.baseAddress}api/TransactionDetails/GetTransactionDetailsByID?ID=${ID}&UserID=${GID}`)
      .pipe(catchError(this.errorHandler));
  }
  
  GetTransactionDetailsByValue(Value: string, GID: Guid): Observable<TransactionDetails[] | string> {
    return this._httpClient.get<TransactionDetails[]>(`${this.baseAddress}api/TransactionDetails/GetTransactionDetailsByValue?Value=${Value}&UserID=${GID}`)
      .pipe(catchError(this.errorHandler));
  }
  
  UpdateTransactionDetails(transactionDetails: TransactionDetails): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Account/UpdateApp`,
      transactionDetails,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeleteTransactionDetails(transactionDetails: TransactionDetails): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Account/DeleteApp`,
      transactionDetails,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }
}
