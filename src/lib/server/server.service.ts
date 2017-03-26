import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import { Plex } from '@andes/plex/src/lib/core/service';
import { Options } from './options';

// Constantes
const defaultOptions: Options = { params: null, showError: true };

@Injectable()
export class Server {
    private baseURL: string;

    constructor(private http: Http, private Plex: Plex) { }

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

    private prepareOptions(options: Options): RequestOptions {
        let result = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': window.sessionStorage.getItem('jwt') ? 'JWT ' + window.sessionStorage.getItem('jwt') : null
            }),
        });
        if (options && options.params) {
            result.search = new URLSearchParams();
            for (let param in options.params) {
                if (options.params[param]) {
                    result.search.set(param, options.params[param]);
                }
            }
        }
        return result;
    }

    private handleError(error: any, options: Options) {
        let message = error ? error.json().message : 'La aplicación no pudo comunicarse con el servidor. Por favor revise su conexión a Internet.';
        if (!options || options.showError) {
            this.Plex.modal({ title: 'Error ' + (error.status || 'desconocido'), content: message, showCancel: false });
        }
        return Observable.throw(message);
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
        return this.http.get(this.getAbsoluteURL(url), this.prepareOptions(options))
            .map((res: Response) => this.parse(res.text()))
            .catch((err: any, caught: Observable<any>) => this.handleError(err, options));
    }

    post(url: string, body: any, options: Options = null): Observable<any> {
        return this.http.post(this.getAbsoluteURL(url), this.stringify(body), this.prepareOptions(options))
            .map((res: Response) => this.parse(res.text()))
            .catch((err: any, caught: Observable<any>) => this.handleError(err, options));
    }

    put(url: string, body: any, options: Options = defaultOptions): Observable<any> {
        return this.http.put(this.getAbsoluteURL(url), this.stringify(body), this.prepareOptions(options))
            .map((res: Response) => this.parse(res.text()))
            .catch((err: any, caught: Observable<any>) => this.handleError(err, options));
    }

    patch(url: string, body: any, options: Options = defaultOptions): Observable<any> {
        return this.http.patch(this.getAbsoluteURL(url), this.stringify(body), this.prepareOptions(options))
            .map((res: Response) => this.parse(res.text()))
            .catch((err: any, caught: Observable<any>) => this.handleError(err, options));
    }

    delete(url: string, options: Options = defaultOptions): Observable<any> {
        return this.http.delete(this.getAbsoluteURL(url), this.prepareOptions(options))
            .map((res: Response) => this.parse(res.text()))
            .catch((err: any, caught: Observable<any>) => this.handleError(err, options));
    }
}
