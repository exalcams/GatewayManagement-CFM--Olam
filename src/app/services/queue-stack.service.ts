import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { QRequestDetails, QApproveDetails } from 'app/models/gateway-model';
import { QueueDetails, StackDetails } from 'app/models/transaction-details';
import { AuthenticationDetails } from 'app/models/authentication-details';
import { Guid } from 'guid-typescript';

@Injectable({
    providedIn: 'root'
})
export class QueueStackService {

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

    GetAllQueues(ID: Guid): Observable<QueueDetails[] | string> {
        return this._httpClient.get<QueueDetails[]>(`${this.baseAddress}api/Queue/GetAllQueues?UserID=${ID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllStacks(ID: Guid): Observable<StackDetails[] | string> {
        return this._httpClient.get<StackDetails[]>(`${this.baseAddress}api/Queue/GetAllStacks?UserID=${ID}`)
            .pipe(catchError(this.errorHandler));
    }

    PublicReAnnouncement(ID: Guid, TransID: number): Observable<string | string> {
        return this._httpClient.get<string>(`${this.baseAddress}api/Queue/PublicReAnnouncement?UserID=${ID}&TransID=${TransID}`)
            .pipe(catchError(this.errorHandler));
    }

    RemoveFromQueueAddToStack(ID: Guid, TransID: number, Reason: string): Observable<string | string> {
        return this._httpClient.get<string>(`${this.baseAddress}api/TransactionDetails/RemoveFromQueueAddToStack?UserID=${ID}&TransID=${TransID}&Reason=${Reason}`)
            .pipe(catchError(this.errorHandler));
    }

    MoveSelectedItemDetailsAbove(stack: StackDetails): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/Queue/MoveUpOrderAndGetAllStacks`,
            stack,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    GetAllVendorsOrVehicleNos(option: string, ID: Guid): Observable<any[] | string> {
        return this._httpClient.get<any[]>(`${this.baseAddress}api/Queue/GetAllVendorOrVehicleNos?UserID=${ID}&Option=${option}`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllVendors(ID: Guid): Observable<any[] | string> {
        return this._httpClient.get<any[]>(`${this.baseAddress}api/Queue/GetAllVendors?UserID=${ID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllQApproves(ID: Guid): Observable<QApproveDetails[] | string> {
        return this._httpClient.get<QApproveDetails[]>(`${this.baseAddress}api/Queue/GetAllQRequests?UserID=${ID}`)
            .pipe(catchError(this.errorHandler));
    }

    PutQApprove(QApprove: QApproveDetails): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/Queue/PutQRequests`,
            QApprove,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    PostQApprove(QApprove: QApproveDetails): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/Queue/PostQApproves`,
            QApprove,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            });
    }

    PostQRequest(QRequest: QRequestDetails): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/Queue/PostQRequests`,
            QRequest,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            });
    }

    PutQRequest(QRequest: QRequestDetails): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}api/Queue/PutQRequests`,
            QRequest,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

}
