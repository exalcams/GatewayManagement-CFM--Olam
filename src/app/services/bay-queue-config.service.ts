import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Subject, Observable, throwError } from 'rxjs';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BayQueueConfigDetails } from 'app/models/gateway-model';
import { Guid } from 'guid-typescript';

@Injectable({
    providedIn: 'root'
})
export class BayQueueConfigService {
    baseAddress: string;
    NotificationEvent: Subject<any>;

    constructor(private _httpClient: HttpClient, private _authService: AuthService) {
        this.baseAddress = _authService.baseAddress;
        this.NotificationEvent = new Subject();
    }

    GetNotification(): Observable<any> {
        return this.NotificationEvent.asObservable();
    }

    TriggerNotification(eventName: string): void {
        this.NotificationEvent.next(eventName);
    }

    errorHandler(error: HttpErrorResponse): Observable<string> {
        return throwError(error.error || error.message || 'Server Error');
    }

    getAllBayGroup(ID: Guid): Observable<string[] | string> {
        return this._httpClient.get<string[]>(`${this.baseAddress}api/BayQueueConfig/GetAllBayGroup?UserID=${ID}`).pipe(catchError(this.errorHandler));
    }
    getAllBays(ID: Guid): Observable<string[] | string> {
        return this._httpClient.get<string[]>(`${this.baseAddress}api/BayQueueConfig/GetAllBays?UserID=${ID}`).pipe(catchError(this.errorHandler));
    }
    getBayNameByGrp(groupName: string, ID: Guid): Observable<string[] | string> {
        return this._httpClient
            .get<string[]>(`${this.baseAddress}api/BayQueueConfig/GetBayNameByGroupName?groupName=${groupName}&UserID=${ID}`)
            .pipe(catchError(this.errorHandler));
    }
    getBayTypeByBayName(bayName: string, ID: Guid): Observable<string[] | string> {
        return this._httpClient
            .get<string[]>(`${this.baseAddress}api/BayQueueConfig/GetBayTypeByBayName?bayName=${bayName}&UserID=${ID}`)
            .pipe(catchError(this.errorHandler));
    }
    
    getAllBayType(ID: Guid): Observable<string[] | string> {
        return this._httpClient.get<string[]>(`${this.baseAddress}api/BayQueueConfig/GetAllBayType?UserID=${ID}`).pipe(catchError(this.errorHandler));
    }

    getAllBayPlant(): Observable<string[] | string> {
        return this._httpClient.get<string[]>(`${this.baseAddress}api/BayQueueConfig/GetAllBayPlant`).pipe(catchError(this.errorHandler));
    }

    getAllBayQueueConfigHeader(ID: Guid): Observable<BayQueueConfigDetails[] | string> {
        return this._httpClient
            .get<BayQueueConfigDetails[]>(`${this.baseAddress}api/BayQueueConfig/GetAllBayQueueConfigHeader?UserID=${ID}`)
            .pipe(catchError(this.errorHandler));
    }

    createBayQueueConfig(configData: BayQueueConfigDetails): Observable<any> {
        return this._httpClient
            .post<BayQueueConfigDetails>(`${this.baseAddress}api/BayQueueConfig/SaveBayQueueConfig`, configData)
            .pipe(catchError(this.errorHandler));
    }

    updateBayQueueConfig(configData: BayQueueConfigDetails): Observable<any> {
        return this._httpClient
            .post<BayQueueConfigDetails>(`${this.baseAddress}api/BayQueueConfig/UpdateBayQueueConfig`, configData)
            .pipe(catchError(this.errorHandler));
    }

    deleteBayQueueConfig(configData: BayQueueConfigDetails): Observable<any> {
        return this._httpClient
            .post<BayQueueConfigDetails>(`${this.baseAddress}api/BayQueueConfig/DeleteBayQueueConfig`, configData)
            .pipe(catchError(this.errorHandler));
    }
}
