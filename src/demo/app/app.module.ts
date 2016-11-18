import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { PlexModule } from 'andes-plex/src/lib/module';
import { PlexService } from 'andes-plex/src/lib/core/service';
import { routing, appRoutingProviders } from './app.routing';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

@NgModule({
 declarations: [
   AppComponent,
   HomeComponent
 ],
 imports: [
   BrowserModule,
   FormsModule,
   HttpModule,
   PlexModule,
   routing
 ],
 providers: [
   PlexService,  
   appRoutingProviders  
 ],
 bootstrap: [AppComponent]
})
export class AppModule { }