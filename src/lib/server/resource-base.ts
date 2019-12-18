import { Server } from './server.service';
import { Observable } from 'rxjs';


export abstract class ResourceBaseHttp<T = any> {
    protected abstract url: string;

    constructor(protected server: Server) { }

    save(data): Observable<T> {
        if (!data.id) {
            return this.create(data);
        } else {
            return this.update(data.id, data);
        }
    }

    get(id): Observable<T> {
        return this.server.get(`${this.url}/${id}`, { showError: false });
    }

    find(query = {}): Observable<T[]> {
        return this.server.get(this.url, { params: query });
    }

    create(body): Observable<T> {
        return this.server.post(this.url, body);
    }

    update(id, body): Observable<T> {
        return this.server.patch(`${this.url}/${id}`, body);
    }

    delete(id): Observable<T> {
        return this.server.delete(`${this.url}/${id}`);
    }

}
