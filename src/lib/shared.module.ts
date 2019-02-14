import { NgModule, ModuleWithProviders } from '@angular/core';
import { Server } from './server/server.service';
import { FechaPipe } from './pipes/fecha.pipe';
import { HoraPipe } from './pipes/hora.pipe';
import { EdadPipe } from './pipes/edad.pipe';
import { EnumerarPipe } from './pipes/enumerar.pipe';
import { FromNowPipe } from './pipes/fromNow.pipe';
import { Html2TextPipe } from './pipes/html.pipe';
import { NombrePipe } from './pipes/nombre.pipe';
import { PluralizarPipe } from './pipes/pluralizar.pipe';
import { SexoPipe } from './pipes/sexo.pipe';

@NgModule({
    declarations: [
        FechaPipe,
        HoraPipe,
        EdadPipe,
        EnumerarPipe,
        FromNowPipe,
        Html2TextPipe,
        NombrePipe,
        PluralizarPipe,
        SexoPipe
    ],
    exports: [
        FechaPipe,
        HoraPipe,
        EdadPipe,
        EnumerarPipe,
        FromNowPipe,
        Html2TextPipe,
        NombrePipe,
        PluralizarPipe,
        SexoPipe
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                Server
            ]
        }
    }
}
