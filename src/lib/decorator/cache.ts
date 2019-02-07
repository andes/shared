// Prototipo de Decorador cache. Proximamente se implementa de forma global.
import { Observable } from 'rxjs/Rx';

export function Cache ({key}) {
    let _cache: any = {};
    return function ( target: any, propertyKey: string, descriptor: PropertyDescriptor ) {
        const fn = descriptor.value as Function;
        descriptor.value = function (...args) {
            const objectKey = key ? (typeof key === 'string' ? args[0][key] : args[0]) : 'default';
            if (!_cache[objectKey]) {
                return fn.call(this, args).do(x => _cache[objectKey] = x);
            } else {
                return new Observable(resultado => resultado.next(_cache[objectKey]));
            }
        };
        return descriptor;
    };
}
