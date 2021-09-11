

import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pause',
  templateUrl: './pause.component.html',
  styleUrls: ['./pause.component.scss']
})
export class PauseComponent {

  @Input('ms') ms: number;

  shown: boolean = false;

  @Output() continue = new EventEmitter();
  @Output() restart = new EventEmitter();

  constructor(private router: Router) {
  }

  show() {
    this.shown = true;
  }

  hide() {
    this.shown = false;
  }

  goTo(view: string) {
    this.router.navigateByUrl(view);
  }

}
