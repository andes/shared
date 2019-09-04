/**
 * Cachea el resultado de una request de forma automatica.
 * Se puede determinar la KEY de cache.
 */
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

export function Cache({ key }) {
    let _cache: any = {};
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const fn = descriptor.value as Function;
        descriptor.value = function (...args) {
            const objectKey = key ? (typeof key === 'string' ? args[0][key] : args[0]) : 'default';
            if (!_cache[objectKey]) {
                return fn.apply(this, args).pipe(tap(x => _cache[objectKey] = x));
            } else {
                return of(_cache[objectKey]);
            }
        };
        return descriptor;
    };
}
