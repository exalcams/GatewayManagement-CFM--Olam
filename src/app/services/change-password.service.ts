import { Injectable } from '@angular/core';
import { ChangePassword } from 'app/models/change-password';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ForgotPassword } from 'app/models/forgot-password';
import { EMailModel } from 'app/models/email-model';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  baseAddress: string;
  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseAddress = _authService.baseAddress;
  }

  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || 'Server Error');
  }


  ChangePassword(changePassword: ChangePassword): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Account/ChangePassword`,
      changePassword,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  ForgotPassword(forgotPassword: ForgotPassword): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Account/ForgotPassword`,
      forgotPassword,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  SendLinkToMail(eMailModelmail: EMailModel): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Account/SendLinkToMail`,
      eMailModelmail,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }
}
