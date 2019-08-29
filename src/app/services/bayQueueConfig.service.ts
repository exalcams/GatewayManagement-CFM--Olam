import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Subject, Observable, throwError } from 'rxjs';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BayQueueConfig } from 'app/models/GatewayModel';

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

    getAllBayGroup(): Observable<string[] | string> {
        return this._httpClient.get<string[]>(`${this.baseAddress}api/BayQueueConfig/GetAllBayGroup`).pipe(catchError(this.errorHandler));
    }
    getAllBays(): Observable<string[] | string> {
        return this._httpClient.get<string[]>(`${this.baseAddress}api/BayQueueConfig/GetAllBays`).pipe(catchError(this.errorHandler));
    }
    getBayNameByGrp(groupName): Observable<string[] | string> {
        return this._httpClient
            .get<string[]>(`${this.baseAddress}api/BayQueueConfig/GetBayNameByGroupName?groupName=${groupName}`)
            .pipe(catchError(this.errorHandler));
    }

    getAllBayType(): Observable<string[] | string> {
        return this._httpClient.get<string[]>(`${this.baseAddress}api/BayQueueConfig/GetAllBayType`).pipe(catchError(this.errorHandler));
    }

    getAllBayPlant(): Observable<string[] | string> {
        return this._httpClient.get<string[]>(`${this.baseAddress}api/BayQueueConfig/GetAllBayPlant`).pipe(catchError(this.errorHandler));
    }

    getAllBayQueueConfigHeader(): Observable<BayQueueConfig[] | string> {
        return this._httpClient
            .get<BayQueueConfig[]>(`${this.baseAddress}api/BayQueueConfig/GetAllBayQueueConfigHeader`)
            .pipe(catchError(this.errorHandler));
    }

    createBayQueueConfig(configData: BayQueueConfig): Observable<any> {
        return this._httpClient
            .post<BayQueueConfig>(`${this.baseAddress}api/BayQueueConfig/SaveBayQueueConfig`, configData)
            .pipe(catchError(this.errorHandler));
    }

    updateBayQueueConfig(configData: BayQueueConfig): Observable<any> {
        return this._httpClient
            .post<BayQueueConfig>(`${this.baseAddress}api/BayQueueConfig/UpdateBayQueueConfig`, configData)
            .pipe(catchError(this.errorHandler));
    }

    deleteBayQueueConfig(configData: BayQueueConfig): Observable<any> {
        return this._httpClient
            .post<BayQueueConfig>(`${this.baseAddress}api/BayQueueConfig/DeleteBayQueueConfig`, configData)
            .pipe(catchError(this.errorHandler));
    }
}
