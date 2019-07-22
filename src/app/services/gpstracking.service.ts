import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { GPSTrackingObj } from 'app/models/GatewayModel';

@Injectable({
  providedIn: 'root'
})
export class GPSTrackingService {

  baseAddress: string;
  NotificationEvent: Subject<any>;

    GetNotification(): Observable<any> {
        return this.NotificationEvent.asObservable();
    }

    TriggerNotification(eventName: string): void {
        this.NotificationEvent.next(eventName);
    }

  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseAddress = _authService.baseAddress;
    this.NotificationEvent = new Subject();
  }

  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || 'Server Error');
  }


  // // Role
  // CreateRole(role: GPSTrackingObj): Observable<any> {
  //   return this._httpClient.post<any>(`${this.baseAddress}api/Account/CreateRole`,
  //     role,
  //     {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json'
  //       })
  //     });
  // }

  GetAllRoles(): Observable<GPSTrackingObj[] | string> {
    return this._httpClient.get<GPSTrackingObj[]>(`${this.baseAddress}api/G_GPSTracking/GetAllTruckDetails`)
      .pipe(catchError(this.errorHandler));
  }

  // UpdateRole(role: RoleWithApp): Observable<any> {
  //   return this._httpClient.post<any>(`${this.baseAddress}api/Account/UpdateRole`,
  //     role,
  //     {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json'
  //       })
  //     })
  //     .pipe(catchError(this.errorHandler));
  // }

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

}
