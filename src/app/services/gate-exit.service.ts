import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { AuthenticationDetails } from 'app/models/authentication-details';
import { Guid } from 'guid-typescript';
import { GateExitDetails } from 'app/models/gate-exit';

@Injectable({
    providedIn: 'root'
})
export class GateExitService {

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

    ManualGateExit(gateExit: GateExitDetails): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/TransactionDetails/ManualGateExit`,
            gateExit,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            });
    }

}
