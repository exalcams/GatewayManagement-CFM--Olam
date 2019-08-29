import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthenticationDetails } from 'app/models/authentication_details';
import { Guid } from 'guid-typescript';
import { catchError } from 'rxjs/operators';
import { ReportFilters } from 'app/models/report';
import { GatewayStatusDetails } from 'app/models/gatewayStatus';
@Injectable({
  providedIn: 'root'
})
export class GatewayStatusService {

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

  GetAllGatewayStatusDetails(ID: Guid): Observable<GatewayStatusDetails[] | string> {
    return this._httpClient.get<GatewayStatusDetails[]>(`${this.baseAddress}api/TransactionDetails/GetAllGatewayStatusDetails?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllDetailsBasedOnFilter(reportFilters: ReportFilters): Observable<GatewayStatusDetails[] | string> {
    return this._httpClient.post<GatewayStatusDetails[]>(`${this.baseAddress}api/TransactionDetails/GetAllDetailsBasedOnFilter`, reportFilters)
      .pipe(catchError(this.errorHandler));
  }
}

