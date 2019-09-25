import { Injectable } from '@angular/core';
import { AuthenticationDetails } from 'app/models/authentication-details';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ChangePassword } from 'app/models/change-password';
import { ForgotPassword } from 'app/models/forgot-password';
import { EMailModel } from 'app/models/email-model';
import { Guid } from 'guid-typescript';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseAddress: string;
  clientId: string;
  constructor(private _httpClient: HttpClient) {
    // this.baseAddress = 'http://10.60.40.12:8868/v1/'; // Olam server( username: OLAM-NG-SCFMSF) and (Pass:password123#)
    // this.baseAddress = 'http://172.29.0.101:8868/v1/'; //Production server IP (Cloud Server)
    //  this.baseAddress = 'http://sgtcx-truckmgmt.olamdomain.com:8868/v1/'; //Production server IP (Cloud Server)Singapore
    // this.baseAddress = 'http://106.51.44.153:8868/v1/'; // Exalca Public IP
    // this.baseAddress = 'http://192.168.0.25:6544/v1/';   // Exalca Private IP
    // this.baseAddress = 'http://localhost:6544/';      // local host
    // this.clientId = 'ngAuthApp';
    //this.baseAddress = 'http://localhost:4010/';
    this.baseAddress = environment.baseAddress;
    this.clientId = environment.clientId;
  }

  // Error Handler

  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error.error_description || error.error || error.message || 'Server Error');
  }

  errorHandler1(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || 'Server Error');
  }

  login(userName: string, password: string): Observable<any> {
    // tslint:disable-next-line:prefer-const
    let data = `grant_type=password&username=${userName}&password=${password}&client_id=${this.clientId}`;
    return this._httpClient.post<any>(`${this.baseAddress}token`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).pipe(catchError(this.errorHandler));
  }

  GetIPAddress(): Observable<any> {
    return this._httpClient
      .get<any>('https://freegeoip.net/json/?callback').pipe(
        map(response => response || {}),
        catchError(this.errorHandler1)
      );
  }


  SignOut(UserID: Guid): Observable<any> {
    return this._httpClient.get<any>(`${this.baseAddress}api/Master/SignOut?UserID=${UserID}`,
    ).pipe(catchError(this.errorHandler1));
  }

  ChangePassword(changePassword: ChangePassword): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/ChangePassword`,
      changePassword,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler1));
  }

  ForgotPassword(forgotPassword: ForgotPassword): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/ForgotPassword`,
      forgotPassword,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler1));
  }

  SendResetLinkToMail(eMailModelmail: EMailModel): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/SendResetLinkToMail`,
      eMailModelmail,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler1));
  }
}
