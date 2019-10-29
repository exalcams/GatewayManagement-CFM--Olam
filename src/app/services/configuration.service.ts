import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { ConfigurationDetails, StationConfigurationDetails } from 'app/models/gateway-model';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

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

  //   Configuration/GetAllConfigurations
  GetAllConfigurations(ID: Guid): Observable<ConfigurationDetails[] | string> {
    return this._httpClient.get<ConfigurationDetails[]>(`${this.baseAddress}api/Configuration/GetAllConfigurations?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllStationConfigurations(ID: Guid): Observable<StationConfigurationDetails[] | string> {
    return this._httpClient.get<StationConfigurationDetails[]>(`${this.baseAddress}api/Configuration/GetAllStationConfigurations?UserID=${ID}`)
      .pipe(catchError(this.errorHandler));
  }

  GetStationConfigurationsBasedOnType(ID: Guid, Type: string): Observable<StationConfigurationDetails[] | string> {
    return this._httpClient.get<StationConfigurationDetails[]>(`${this.baseAddress}api/Configuration/GetStationConfigurationsBasedOnType?UserID=${ID}&Type=${Type}`)
      .pipe(catchError(this.errorHandler));
  }
  // configuration
  PostConfiguration(configuration: ConfigurationDetails): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Configuration/PostConfigurations`,
      configuration,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }

  PutConfiguration(configuration: ConfigurationDetails): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Configuration/PutConfigurations`,
      configuration,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

}
