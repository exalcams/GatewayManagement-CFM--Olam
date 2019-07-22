import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { QRequestObj, QApproveObj } from 'app/models/GatewayModel';
import { VendorOrVehicleNoObj } from 'app/models/VendorOrVehicleNoObj';
import { QueueDetails, StackDetails } from 'app/models/transaction-details';
import { AuthenticationDetails } from 'app/models/authentication_details';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

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


  // QApprove
  PostQApprove(QApprove: QApproveObj): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/G_Queue/PostQApproves`,
      QApprove,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }

  GetAllVendorsOrVehicleNos(option: string, ID: Guid): Observable<any[] | string> {
    return this._httpClient.get<any[]>(`${this.baseAddress}api/G_Queue/GetAllVendorOrVehicleNos?UserID=${ID}&Option=${option}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllVendors(ID: Guid): Observable<any[] | string> {
    return this._httpClient.get<any[]>(`${this.baseAddress}api/G_Queue/GetAllVendors?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  //   G_QApprove/GetAllQApproves
  GetAllQApproves(ID: Guid): Observable<QApproveObj[] | string> {
    return this._httpClient.get<QApproveObj[]>(`${this.baseAddress}api/G_Queue/GetAllQRequests?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  PutQApprove(QApprove: QApproveObj): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/G_Queue/PutQRequests`,
      QApprove,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  // DeleteRole(role: RoleWithApp): Observable<any> {
  //   return this._httpClient.post<any>(`${this.baseAddress}api/Account/DeleteRole`,
  //     role,
  //     {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json'
  //       })
  //     })
  //     .pipe(catchError(this.errorHandler));
  // }

  // QRequest
  PostQRequest(QRequest: QRequestObj): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/G_Queue/PostQRequests`,
      QRequest,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }

  PutQRequest(QRequest: QRequestObj): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/G_Queue/PutQRequests`,
      QRequest,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  //   G_QApprove/GetAllQApproves
  GetAllQueues(ID: Guid): Observable<QueueDetails[] | string> {
    return this._httpClient.get<QueueDetails[]>(`${this.baseAddress}api/G_Queue/GetAllQueues?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllStacks(ID: Guid): Observable<StackDetails[] | string> {
    return this._httpClient.get<StackDetails[]>(`${this.baseAddress}api/G_Queue/GetAllStacks?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  moveSelectedItemDetailsAbove(stack: StackDetails): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/G_Queue/MoveUpOrderAndGetAllStacks`,
      stack,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }
}
