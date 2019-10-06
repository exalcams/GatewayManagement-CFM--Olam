import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthenticationDetails } from 'app/models/authentication-details';
import { Guid } from 'guid-typescript';
import { catchError } from 'rxjs/operators';
import { TransactionReportDetails, ReportFilters, StageWiseReportDetails } from 'app/models/report';
@Injectable({
  providedIn: 'root'
})
export class ReportService {

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

  GetAllReports(ID: Guid): Observable<TransactionReportDetails[] | string> {
    return this._httpClient.get<TransactionReportDetails[]>(`${this.baseAddress}api/Report/GetAllReports?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllTransactionReportsLast100(ID: Guid): Observable<TransactionReportDetails[] | string> {
    return this._httpClient.get<TransactionReportDetails[]>(`${this.baseAddress}api/Report/GetAllTransactionReportsLast100?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllTransactionReports(ID: Guid): Observable<TransactionReportDetails[] | string> {
    return this._httpClient.get<TransactionReportDetails[]>(`${this.baseAddress}api/Report/GetAllTransactionReports?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }
  

  GetAllReportsBasedOnVehicleNoFilter(reportFilters: ReportFilters): Observable<TransactionReportDetails[] | string> {
    return this._httpClient.post<TransactionReportDetails[]>(`${this.baseAddress}api/Report/GetAllReportsBasedOnVehicleNoFilter`, reportFilters)
      .pipe(catchError(this.errorHandler));
  }

  GetAllReportsBasedOnDateFilter(reportFilters: ReportFilters): Observable<TransactionReportDetails[] | string> {
    return this._httpClient.post<TransactionReportDetails[]>(`${this.baseAddress}api/Report/GetAllReportsBasedOnDateFilter`, reportFilters)
      .pipe(catchError(this.errorHandler));
  }

  GetAllStageWiseReports(ID: Guid): Observable<StageWiseReportDetails[] | string> {
    return this._httpClient.get<StageWiseReportDetails[]>(`${this.baseAddress}api/Report/GetAllStageWiseReports?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllStageWiseReportsBasedOnDateFilter(reportFilters: ReportFilters): Observable<StageWiseReportDetails[] | string> {
    return this._httpClient.post<StageWiseReportDetails[]>(`${this.baseAddress}api/Report/GetAllStageWiseReportsBasedOnDateFilter`, reportFilters)
      .pipe(catchError(this.errorHandler));
  }

  GetAllVehicleNos(ID: Guid): Observable<string[] | string> {
    return this._httpClient.get<string[]>(`${this.baseAddress}api/Report/GetAllVehicleNos?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

}

