import { distinctUntilChanged, map, scan, filter, publishReplay, refCount } from 'rxjs/operators';
import { pipe } from 'rxjs';

export function notNull() {
    return filter(user => !!user);
}

export function onlyNull() {
    return filter(user => !user);
}

export function mergeObject() {
    return scan((acc, curr) => Object.assign({}, acc, curr), {});
}

export function asObject(key, fn) {
    return map(value => {
        const obj = {};
        obj[key] = value ? fn(value) : null;
        return obj;
    });
}
const replacer = (key, value) => value === null ? undefined : value;
export function distincObject() {
    return distinctUntilChanged((a, b) => {
        return JSON.stringify(a, replacer) === JSON.stringify(b, replacer);
    });
}

export function cache() {
    return pipe(
        publishReplay(1),
        refCount()
    );
}


