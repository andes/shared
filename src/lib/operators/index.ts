import { distinctUntilChanged, map, scan, filter, publishReplay, refCount } from 'rxjs/operators';
import { pipe, OperatorFunction } from 'rxjs';

export function notNull<T>() {
    return filter<T>(user => !!user);
}

export function onlyNull<T>() {
    return filter<T>(user => !user);
}

export function mergeObject() {
    return scan((acc, curr) => Object.assign({}, acc, curr), {});
}

export function asObject<T, R = any>(key, fn = null) {
    return map<T, R>(value => {
        fn = fn || ((t) => t);
        const obj = {};
        obj[key] = value ? fn(value) : null;
        return obj as R;
    });
}

const replacer = (key, value) => value === null ? undefined : value;
export function distincObject<T>() {
    return distinctUntilChanged<T>((a, b) => {
        return JSON.stringify(a, replacer) === JSON.stringify(b, replacer);
    });
}

export function cache<T>(): OperatorFunction<T, T> {
    return pipe(
        publishReplay(1),
        refCount()
    );
}


