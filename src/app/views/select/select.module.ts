import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeatmapService } from '@services/beatmap.service';
import { LoaderService } from '@services/loader.service';

import { SelectComponent } from './select.component';

@NgModule({
  declarations: [
    SelectComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SelectComponent
  ],
  providers: [BeatmapService]
})
export class SelectModule {}
