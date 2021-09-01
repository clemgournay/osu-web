import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Asset } from '@models/asset';
import { Beatmap } from '@models/beatmap';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class LoaderService {

  baseURL: string = environment.apiURL;
  beatmapAssets: any = {};

  constructor(
    private http: HttpClient
  ) {}

  async load(beatmap: Beatmap, assets: Array<Asset>, callback: any) {
    if (!this.beatmapAssets[beatmap.orgID]) {
      this.beatmapAssets[beatmap.orgID] = {sounds: {}, images: {}};
      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];
        switch(asset.type) {
          case 'image':
            const imageSRC = `${this.baseURL}/beatmaps/${beatmap.orgID}/file/${asset.filename}`;
            const image = await this.loadImage(imageSRC);
            asset.data = image;
            this.beatmapAssets[beatmap.orgID].images[asset.id] = asset;
            break;
          case 'music':
            const musicSRC = `${this.baseURL}/beatmaps/${beatmap.orgID}/music`;
            const music = await this.loadAudio(musicSRC);
            asset.data = music;
            this.beatmapAssets[beatmap.orgID].sounds[asset.id] = asset;
            break;
          case 'sound':
            const soundSRC = `${this.baseURL}/beatmaps/${beatmap.orgID}/file/${asset.filename}`;
            const sound = await this.loadAudio(soundSRC);
            asset.data = sound;
            this.beatmapAssets[beatmap.orgID].sounds[asset.id] = asset;
            break;
        }
      }
      callback(this.beatmapAssets[beatmap.orgID]);
    } else {
      callback(this.beatmapAssets[beatmap.orgID]);
    }

  }

  loadImage(src: string) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  loadAudio(src: string) {
    return new Promise((resolve, reject) => {
      let audio = new Audio()
      audio.oncanplay = () => resolve(audio);
      audio.onerror = reject;
      audio.src = src;
    });
  }

}
