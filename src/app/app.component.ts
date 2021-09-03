import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  mousedown: boolean = false;

  onMousedown(e: any) {
    if (e.which !== 2) {
      this.mousedown = true;
    }
  }

  onMouseup(e: any){
    if (e.which !== 2) {
      this.mousedown = false;
    }
  }

}
