import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class ServerService {
    private headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) }); // Create a request option

    constructor(private http: Http) { }

    private parse(data: any): any {
        // Parsea fechas de formato .NET en objetos Date
        var rvalidchars = /^[\],:{}\s]*$/;
        var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
        var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
        var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
        var dateISO = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.,]\d+)?Z/i;
        var dateNet = /\/Date\((-?\d+)(?:-\d+)?\)\//i;

        var replacer = function (key, value) {
            if (typeof (value) === "string") {
                if (dateISO.test(value)) {
                    return new Date(value);
                }
                if (dateNet.test(value)) {
                    return new Date(parseInt(dateNet.exec(value)[1], 10));
                }
            }
            return value;
        };

        if (data && typeof (data) == "string" && rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, ""))) {
            return window['JSON'].parse(data, replacer);
        }
        else {
            return data;
        }
    }

    private handleError(error: any) {
        console.log(error.json());
        return Observable.throw(error.json().error || 'Server error');
    }

    private stringifyBody(body: any) {
        return JSON.stringify(body); // Stringify payload
    }

    get(url: string, params: any): Observable<any> {
        let searchParams = new URLSearchParams();
        if (params != null)
            for (let param in params) {
                searchParams.set(param, params[param]);
            }

        return this.http.get(url, { search: searchParams })
            .map((res: Response) => this.parse(res.text()))
            .catch(this.handleError);
    }

    post(url: string, body: any): Observable<any> {
        return this.http.post(url, this.stringifyBody(body), this.options) // ...using post request
            .map((res: Response) => this.parse(res.text())) // ...and calling .json() on the response to return data
            .catch(this.handleError); //...errors if any
    }

    put(url: string, body: any): Observable<any> {
        return this.http.put(url, this.stringifyBody(body), this.options) // ...using post request
            .map((res: Response) => this.parse(res.text())) // ...and calling .json() on the response to return data
            .catch(this.handleError); //...errors if any
    }
}