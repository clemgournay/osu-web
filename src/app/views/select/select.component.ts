import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Beatmap } from '@models/beatmap';
import { ServerResp } from '@models/server-resp';

import { BeatmapService } from '@services/beatmap.service';


@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {

  beatmaps: Array<Beatmap> = [];

  constructor(
    private router: Router,
    private beatmapService: BeatmapService
  ) {
    this.getBeatmaps();
  }

  async getBeatmaps() {
    const resp: ServerResp = await this.beatmapService.getAll().toPromise();
    if (resp.status === 'success') {
      this.beatmaps = resp.data;
      console.log('[BEATMAPS]', this.beatmaps);
    } else {
      console.error(resp.error);
    }
  }

  play(beatmap: Beatmap, index: number) {
    const selection = {beatmap: beatmap, diff: index};
    localStorage.selection = JSON.stringify(selection);
    this.router.navigateByUrl('play', {state: selection});
  }


}
