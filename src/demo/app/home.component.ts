import { Component } from '@angular/core';
import { Server } from '../../lib/server/server.service';

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent {
  public url: string = 'http://localhost:3002/api/pais';
  public data: any;

  constructor(private server: Server) { }

  callAPI(){
    this.server.get(this.url).subscribe((data) => this.data = data);    
  }
}