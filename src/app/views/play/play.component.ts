

import { Component, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { PlayArea } from '@models/play-area';
import { Beatmap } from '@models/beatmap';
import { BeatmapDifficulty } from '@models/beatmap-difficulty';
import { Asset } from '@models/asset';
import { BeatmapData } from '@models/beatmap-data';
import { HitCircle } from '@models/hitcircle';
import { Slider } from '@models/slider';

import { BeatmapService } from '@services/beatmap.service';
import { LoaderService } from '@services/loader.service';
import { SoundService } from '@services/sound.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements AfterViewInit {

  @ViewChild('canvas') canvasRef: ElementRef;
  canvas: HTMLCanvasElement;
  canvasSize: {width: number, height: number} =  {width: 0, height: 0};
  ctx: CanvasRenderingContext2D;
  beatmap: Beatmap;
  difficulty: BeatmapDifficulty;
  data: BeatmapData;
  hitObjects: Array<HitCircle | Slider>;
  music: HTMLAudioElement;
  startMS: number = 0;
  lastMS: number = 0;
  assets: any = {images: [], sounds: []};
  ms: number;
  lineIndex: number = 0;
  playArea: PlayArea = {width: 0, height: 0, left: 0, top: 0};
  osuArea: PlayArea = {width: 500, height: 500, left: 0, top: 0};

  constructor(
    private router: Router,
    private beatmapService: BeatmapService,
    private loaderService: LoaderService,
    private soundService: SoundService
  ) {
    this.init();
  }

  init() {
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras.state) {
      this.beatmap = nav.extras.state.beatmap;
      const diffIndex = nav.extras.state.diff;
      this.difficulty = this.beatmap.difficulties[diffIndex];
      console.log('[BEATMAP]', this.beatmap)
      console.log('[DIFFICULTY]', this.difficulty);
      this.load();
    } else if (localStorage.selection) {
      const selection = JSON.parse(localStorage.selection);
      this.beatmap = selection.beatmap;
      const diffIndex = selection.diff;
      this.difficulty = this.beatmap.difficulties[diffIndex];
      console.log('[BEATMAP]', this.beatmap)
      console.log('[DIFFICULTY]', this.difficulty);
      this.load();
    } else {
      this.router.navigateByUrl('select');
    }
  }

  async load() {
    const dataResp = await this.beatmapService.getDiffData(this.beatmap, this.difficulty.id).toPromise();
    if (dataResp.status === 'success') {
      this.data = this.beatmapService.parseOSU(dataResp.data);
      if (this.data.HitObjects) this.hitObjects = this.data.HitObjects;
      console.log('[BEATMAP DATA]', this.data);

      const assets: Array<Asset> = [
        {id: 'music', filename: this.beatmap.audioFilename, type: 'sound'},
        {id: 'bg', filename: this.beatmap.backgroundFilename, type: 'image'}
      ];
      this.loaderService.load(this.beatmap, assets, (loadedAssets: Array<Asset>) => {
        console.log(loadedAssets);
        this.assets = loadedAssets;
        this.soundService.setSounds(this.assets.sounds);
        this.run();
        //this.canvas.style.backgroundImage = 'url(' + this.assets.images['bg'].data.src + ')'
      });

    }  else {
      alert('Une erreur est survenue. Veuillez réessayer');
      this.router.navigateByUrl('select');
    }
  }

  run() {
    //this.soundService.play('music');
    this.update(0);
  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    const ctx = this.canvas.getContext('2d');
    if (ctx) this.ctx = ctx;
    setTimeout(this.initView.bind(this));
  }

  initView() {
    this.resize();
    this.draw();

  }

  update(currentTime: number) {
    this.ms = Math.floor(currentTime - this.startMS);

    if (this.hitObjects) {
      this.hitObjects.forEach((hitObject: HitCircle | Slider) => {
        if (this.ms >= hitObject.ms - 500 && this.ms <= hitObject.ms + 500) {
          if (hitObject instanceof HitCircle) {
            if (this.ms >= hitObject.ms - 500 && this.ms <= hitObject.ms) {
              hitObject.opacity += 0.05;
              if (hitObject.opacity > 1) hitObject.opacity = 1;
            } else if (this.ms >= hitObject.ms && this.ms <= hitObject.ms + 500) {
              hitObject.opacity -= 0.05;
              if (hitObject.opacity < 0) hitObject.opacity = 0;
            }
          }
        }
      });
    }
    this.draw();
    this.lastMS = this.ms;
    window.requestAnimationFrame(this.update.bind(this));
  }

  getFrameRate() {
    return this.ms - this.lastMS;
  }

  resize() {
    this.canvasSize.width = window.innerWidth;
    this.canvasSize.height = window.innerHeight;
    if (this.canvasSize.width > this.canvasSize.height) {
      this.playArea.height = this.canvasSize.height;
      this.playArea.width = this.playArea.height;
      this.playArea.left = (this.canvasSize.width/2) - (this.playArea.width/2);
      this.playArea.top = 0;
    } else {
      this.playArea.width = this.canvasSize.width;
      this.playArea.height = this.playArea.width;
      this.playArea.left = 0;
      this.playArea.top = (this.canvasSize.height/2) - (this.playArea.height/2);
    }
    console.log(this.playArea)

  }

  draw() {
    this.ctx.fillStyle = 'blue';

    if (this.hitObjects) {
      this.hitObjects.forEach((hitObject: HitCircle | Slider) => {
        if (hitObject instanceof HitCircle) {
          this.drawHitcircle(hitObject);
        }
      });
    }
  }

  drawHitcircle(hitCircle: HitCircle) {
    if (hitCircle.opacity > 0) {
      this.ctx.beginPath();
      this.ctx.globalAlpha = hitCircle.opacity;
      this.ctx.fillStyle = 'blue';
      let sizeMultipler = this.playArea.width * 0.5;

      const screenX = Math.floor((hitCircle.point.x * this.playArea.width) / this.osuArea.width);
      const screenY = Math.floor((hitCircle.point.y * this.playArea.height) / this.osuArea.height);
      console.log(screenX, screenY);

      this.ctx.arc(this.playArea.left + screenX, this.playArea.top + screenY, sizeMultipler * 0.1,  0, 2*Math.PI);
      this.ctx.fill();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(e: Event) {
    this.resize();
  }

}
