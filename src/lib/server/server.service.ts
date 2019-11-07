// import { RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import { Plex } from '@andes/plex';
import { Options } from './options';
import { finalize, map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Constantes
const defaultOptions: Options = { params: null, showError: true, showLoader: true };

@Injectable()
export class Server {
    private baseURL: string;

    constructor(private http: HttpClient, private plex: Plex) { }

    private parse(data: any): any {
        let rvalidchars = /^[\],:{}\s]*$/;
        let rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
        let rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
        let rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
        let dateISO = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.,]\d+)?Z/i;
        let dateNet = /\/Date\((-?\d+)(?:-\d+)?\)\//i;

        let replacer = function (key, value) {
            if (typeof (value) === 'string') {
                if (dateISO.test(value)) {
                    return new Date(value);
                }
                if (dateNet.test(value)) {
                    return new Date(parseInt(dateNet.exec(value)[1], 10));
                }
            }
            return value;
        };

        if (data && typeof (data) === 'string'
            && rvalidchars.test(data.replace(rvalidescape, '@').replace(rvalidtokens, ']').replace(rvalidbraces, ''))) {
            return window['JSON'].parse(data, replacer);
        } else {
            return data;
        }
    }

    private stringify(object: any) {
        return JSON.stringify(object);
    }

    private prepareOptions(options: Options) {
        const result: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': window.sessionStorage.getItem('jwt') ? 'JWT ' + window.sessionStorage.getItem('jwt') : ''
            }),
        };
        if (options && options.params) {
            result.params = new HttpParams();
            for (let param in options.params) {
                if (options.params[param] !== undefined) {
                    if (Array.isArray(options.params[param])) {
                        (options.params[param] as Array<any>).forEach((value) => {
                            result.params = result.params.append(param, value);
                        });
                    } else {
                        if (options.params[param] instanceof Date) {
                            result.params = result.params.set(param, (options.params[param] as Date).toISOString());
                        } else {
                            result.params = result.params.set(param, options.params[param]);
                        }
                    }
                }
            }
        }
        return result;
    }

    private updateLoader(show: boolean, options: Options) {
        if (!options || options.showLoader || (options.showLoader === undefined)) {
            if (show) {
                this.plex.showLoader();
            } else {
                this.plex.hideLoader();
            }
        }
    }

    private handleError(error: any, options: Options) {
        let message = (error && JSON.parse(error.error).message) || 'La aplicación no pudo comunicarse con el servidor. Por favor revise su conexión a la red.';
        if (!options || options.showError || (options.showError === undefined)) {
            // El código 400 es usado para enviar mensaje de validación al usuario
            if (error.status === 400) {
                this.plex.info('warning', `<div class="text-muted small pt-3">Código de error: ${error.status}</div>`, message);
            } else {
                this.plex.info('danger', `${message}<div class="text-muted small pt-3">Código de error: ${error.status}</div>`, 'No se pudo conectar con el servidor');
            }
        }
        return throwError(message);
    }

    private getAbsoluteURL(url: string) {
        if (url.toLowerCase().startsWith('http')) {
            return url;
        } else {
            return this.baseURL + url;
        }
    }

    setBaseURL(baseURL: string) {
        this.baseURL = baseURL;
    }

    get(url: string, options: Options = defaultOptions): Observable<any> {
        this.updateLoader(true, options);
        return this.http.get(this.getAbsoluteURL(url), this.prepareOptions(options)).pipe(
            finalize(() => this.updateLoader(false, options)),
            map((res: any) => this.parse(res)),
            catchError((err: any) => this.handleError(err, options))
        );
    }

    post(url: string, body: any, options: Options = null): Observable<any> {
        this.updateLoader(true, options);
        return this.http.post(this.getAbsoluteURL(url), this.stringify(body), this.prepareOptions(options)).pipe(
            finalize(() => this.updateLoader(false, options)),
            map((res: any) => this.parse(res)),
            catchError((err: any) => this.handleError(err, options))
        );
    }

    put(url: string, body: any, options: Options = defaultOptions): Observable<any> {
        this.updateLoader(true, options);
        return this.http.put(this.getAbsoluteURL(url), this.stringify(body), this.prepareOptions(options)).pipe(
            finalize(() => this.updateLoader(false, options)),
            map((res: any) => this.parse(res)),
            catchError((err: any) => this.handleError(err, options))
        );
    }

    patch(url: string, body: any, options: Options = defaultOptions): Observable<any> {
        this.updateLoader(true, options);
        return this.http.patch(this.getAbsoluteURL(url), this.stringify(body), this.prepareOptions(options)).pipe(
            finalize(() => this.updateLoader(false, options)),
            map((res: any) => this.parse(res)),
            catchError((err: any) => this.handleError(err, options))
        );
    }

    delete(url: string, options: Options = defaultOptions): Observable<any> {
        this.updateLoader(true, options);
        return this.http.delete(this.getAbsoluteURL(url), this.prepareOptions(options)).pipe(
            finalize(() => this.updateLoader(false, options)),
            map((res: any) => this.parse(res)),
            catchError((err: any) => this.handleError(err, options))
        );
    }
}
