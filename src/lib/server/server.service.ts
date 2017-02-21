import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Options } from './options';

@Injectable()
export class Server {
    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });

    constructor(private http: Http) { }

    private parse(data: any): any {
        // Parsea fechas de formato .NET en objetos Date
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
        let result = new RequestOptions();
        if (options && options.params) {
            result.search = new URLSearchParams()
            for (let param in options.params) {
                if (options.params[param]) {
                    result.search.set(param, options.params[param]);
                }
            }
        }
        return result;
    }

    private handleError(error: any, options: Options) {
        console.log(error.json());
        return Observable.throw(error.json().error || 'Server error');
    }

    get(url: string, options: Options = null): Observable<any> {
        return this.http.get(url, this.prepareOptions(options))
            .map((res: Response) => this.parse(res.text()))
            .catch((err: any, caught: Observable<any>) => this.handleError(err, options));
    }

    post(url: string, body: any, options: Options = null): Observable<any> {
        return this.http.post(url, this.stringify(body), this.options)
            .map((res: Response) => this.parse(res.text()))
            .catch((err: any, caught: Observable<any>) => this.handleError(err, options));
    }

    put(url: string, body: any, options: Options = null): Observable<any> {
        return this.http.put(url, this.stringify(body), this.options)
            .map((res: Response) => this.parse(res.text()))
            .catch((err: any, caught: Observable<any>) => this.handleError(err, options));
    }

    patch(url: string, body: any, options: Options = null): Observable<any> {
        return this.http.patch(url, this.stringify(body), this.options)
            .map((res: Response) => this.parse(res.text()))
            .catch((err: any, caught: Observable<any>) => this.handleError(err, options));
    }

    delete(url: string, options: Options = null): Observable<any> {
        return this.http.delete(url)
            .map((res: Response) => this.parse(res.text()))
            .catch((err: any, caught: Observable<any>) => this.handleError(err, options));
    }
}
