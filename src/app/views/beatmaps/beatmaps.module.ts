import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeatmapService } from '@services/beatmap.service';

import { BeatmapsComponent } from './beatmaps.component';

@NgModule({
  declarations: [
    BeatmapsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BeatmapsComponent
  ],
  providers: [
    BeatmapService
  ]
})
export class BeatmapsModule { }
