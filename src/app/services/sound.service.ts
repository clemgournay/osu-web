import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Beatmap } from '@models/beatmap';
import { Asset } from '@models/asset';

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

  setSounds(sounds: any) {
    for (let id in sounds) {
      this.sounds[id] = sounds[id].data;
    }
  }

  play(id: string) {
    this.sounds[id].play();
  }

  pause(id: string) {
    this.sounds[id].pause();
  }

  stop(id: string) {
    this.pause(id);
    this.sounds[id].currentTime = 0;
  }

}
