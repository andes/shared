import { scan, filter, map } from 'rxjs/operators';
import { NavigationStart, NavigationEnd, Event } from '@angular/router';
import { Observable, pipe } from 'rxjs';

export function onRouterUpdate(events: Observable<Event>) {
    return pipe(
        scan((acc: any, e) => {
            if (e instanceof NavigationStart) {
                acc.stated = e.navigationTrigger;
                acc.ready = false;
            }
            if (e instanceof NavigationEnd) {
                acc.ready = true;
            }
            return acc;
        }, {}),
        filter((acc: any) => acc.ready),
        filter((acc: any) => acc.stated === 'popstate'),
        map(() => null)
    )
}
