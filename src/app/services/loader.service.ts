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
  skinAssets: any = {};
  beatmapAssets: any = {};

  constructor(
    private http: HttpClient
  ) {}

  async loadSkin(skin: string, callback: any) {
    const assets: Array<Asset> = [
      {id: 'hitcircle-overlay', filename: 'hitcircleoverlay.png', type: 'image'},
      {id: 'approach-circle', filename: 'approachcircle.png', type: 'image'},
      {id: 'hit0', filename: 'hit0.png', type: 'image'},
      {id: 'hit50', filename: 'hit50.png', type: 'image'},
      {id: 'hit100', filename: 'hit100.png', type: 'image'},
      {id: 'hit300', filename: 'hit300.png', type: 'image'},
      /*{id: 'count1', filename: 'count1.png', type: 'image'},
      {id: 'count2', filename: 'count2.png', type: 'image'},
      {id: 'count3', filename: 'count3.png', type: 'image'},
      {id: 'count4', filename: 'count4.png', type: 'image'},
      {id: 'count5', filename: 'count5.png', type: 'image'},
      {id: 'count6', filename: 'count6.png', type: 'image'},
      {id: 'count7', filename: 'count7.png', type: 'image'},
      {id: 'count8', filename: 'count8.png', type: 'image'},
      {id: 'count9', filename: 'count9.png', type: 'image'}*/
    ];
    if (!this.skinAssets[skin]) {
      this.skinAssets[skin] = {sounds: {}, images: {}};
      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];
        switch(asset.type) {
          case 'image':
            const imageSRC = `assets/skins/${skin}/${asset.filename}`;
            const image = await this.loadImage(imageSRC);
            asset.data = image;
            this.skinAssets[skin].images[asset.id] = asset;
            break;
        }
      }
      callback(this.skinAssets[skin]);
    } else {
      callback(this.skinAssets[skin]);
    }
  }

  async loadAssets(beatmap: Beatmap, assets: Array<Asset>, callback: any) {
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
