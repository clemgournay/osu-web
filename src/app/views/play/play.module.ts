import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PauseModule } from '@components/pause/pause.module';

import { PlayComponent } from './play.component';

@NgModule({
  declarations: [
    PlayComponent
  ],
  imports: [
    CommonModule,
    PauseModule
  ],
  exports: [
    PlayComponent
  ]
})
export class PlayModule { }
