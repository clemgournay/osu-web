import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { Beatmap } from '@models/beatmap';
import { ServerResp } from '@models/server-resp';

import { BeatmapService } from '@services/beatmap.service';

@Component({
  selector: 'app-beatmaps',
  templateUrl: './beatmaps.component.html',
  styleUrls: ['./beatmaps.component.scss']
})
export class BeatmapsComponent {

  beatmaps: Array<Beatmap> = [];

  @ViewChild('file') file: ElementRef;

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

  join(arr: Array<string>, separator: string) {
    return arr.join(separator);
  }

  onSelectFile(e: any) {
    const files: Array<File> = [];
    for (let i = 0; i < e.target.files.length; i++) {
      files.push(e.target.files[i]);
    }
    this.beatmapService.add(files).subscribe((resp: ServerResp) => {
      e.target.value = '';
      if (resp.status === 'success') {
        resp.data.forEach((beatmap: Beatmap) => {
          this.beatmaps.push(beatmap);
        })
      }
    });
  }

  remove(i: number) {
    this.beatmapService.delete(this.beatmaps[i]).subscribe();
    this.beatmaps.splice(i, 1);
  }

  goTo(view: string) {
    this.router.navigateByUrl(view);
  }


}
