import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Beatmap } from '@models/beatmap';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class SoundService {

  baseURL: string = environment.apiURL;
  sounds: any = {};

  constructor(
    private http: HttpClient
  ) {}

  loadMusic(beatmap: Beatmap, callback: any) {
    this.sounds[beatmap.orgID] = new Audio();
    this.sounds[beatmap.orgID].src = `${this.baseURL}/beatmaps/${beatmap.orgID}/music`;
    this.sounds[beatmap.orgID].oncanplay = function() {
      this.id = beatmap.orgID;
      this.loaded = true;
      callback();
    }
  }

  loadSound(beatmap: Beatmap, callback: any) {
  }

  play(id: string) {
    this.sounds[id].play();
  }

}
