import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TransactionBasedOnValueService implements Resolve<any>
{
    routeParams: any;
    baseAddress: string;
    product: any[];
    onProductsChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient, private _authService: AuthService
    )
    {
        // Set the defaults
        this.baseAddress = _authService.baseAddress;
        this.onProductsChanged = new BehaviorSubject({});
    }


    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getProduct()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get product
     *
     * @returns {Promise<any>}
     */
    getProduct(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id === 'new' )
            {
                this.onProductsChanged.next(false);
                resolve(false);
            }
            else
            {
                this._httpClient.get(`${this.baseAddress}api/TransactionDetails/GetTransactionDetailsByValue?Value=${this.routeParams.id}`)
                    .subscribe((response: any) => {
                        this.product = response;
                        this.onProductsChanged.next(this.product);
                        resolve(response);
                    }, reject);
            }
        });
    }
}
