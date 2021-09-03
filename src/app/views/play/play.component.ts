

import { Component, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { PlayArea } from '@models/play-area';
import { Beatmap } from '@models/beatmap';
import { BeatmapDifficulty } from '@models/beatmap-difficulty';
import { Asset } from '@models/asset';
import { BeatmapData } from '@models/beatmap-data';
import { Coordinates } from '@models/coordinates';
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
  aspectRatio: number = 0;
  loopID: number;
  score: number = 0;
  circleApproachDuration: number = 800;
  clickPos: Coordinates | null = null;

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

      this.loaderService.loadSkin('default', (loadedAssets: any) => {
        this.assets = loadedAssets;
        console.log(loadedAssets);
        this.loaderService.loadAssets(this.beatmap, assets, (loadedAssets: any) => {
          for (let id in loadedAssets.images) this.assets.images[id] = loadedAssets.images[id];
          for (let id in loadedAssets.sounds) this.assets.sounds[id] = loadedAssets.sounds[id];
          console.log('[ASSETS]', this.assets);
          this.canvas.style.backgroundImage = 'url(' + this.assets.images['bg'].data.src + ')'
          this.soundService.setSounds(this.assets.sounds);
          this.run();
        });
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

      const perfectRange = (10 * this.circleApproachDuration) / 100;
      const goodRange = (20 * this.circleApproachDuration) / 100;
      const okRange = (30 * this.circleApproachDuration) / 100;

      this.hitObjects.forEach((hitObject: HitCircle | Slider) => {

        /* Animations */
        if (this.ms >= hitObject.ms - this.circleApproachDuration && this.ms <= hitObject.ms + this.circleApproachDuration) {
          if (hitObject instanceof HitCircle) {
            const hitCircle = hitObject;
            if ((this.ms >= hitObject.ms - this.circleApproachDuration && this.ms < hitCircle.ms)) {
              hitCircle.approach(this.getFrameRate(), this.circleApproachDuration);
            } else if ((this.ms >= hitCircle.ms && this.ms <= hitCircle.ms + this.circleApproachDuration)) {
              hitCircle.disappear(this.getFrameRate(), this.circleApproachDuration);
            }
          }
        }

        /* Scoring */
        if (!hitObject.done) {
          if (this.clickPos) {
            if (hitObject instanceof HitCircle) {
              const hitCircle = hitObject;
              if (hitCircle.isCoorInside(this.clickPos)) {
                if (
                  this.ms >= hitCircle.ms - perfectRange && this.ms <= hitCircle.ms ||
                  this.ms >= hitCircle.ms && this.ms <= hitCircle.ms + perfectRange
                ) {
                  hitCircle.clicked = true;
                  hitCircle.done = true;
                  hitCircle.score = 300;
                  this.score += 300;
                } else if (
                  this.ms >= hitCircle.ms - goodRange && this.ms <= hitCircle.ms - perfectRange ||
                  this.ms >= hitCircle.ms + perfectRange && this.ms <= hitCircle.ms + goodRange
                ) {
                  hitCircle.clicked = true;
                  hitCircle.done = true;
                  hitCircle.score = 100;
                  this.score += 100;
                } else if (
                  this.ms >= hitCircle.ms - okRange && this.ms <= hitCircle.ms - goodRange ||
                  this.ms >= hitCircle.ms + goodRange && this.ms <= hitCircle.ms + okRange
                ) {
                  hitCircle.clicked = true;
                  hitCircle.done = true;
                  hitCircle.score = 50;
                  this.score += 50;
                } else {
                  hitCircle.score = 0;
                  hitCircle.clicked = true;
                  hitCircle.done = true;
                }
              }
            }
          } else {
            if (hitObject instanceof HitCircle) {
              const hitCircle = hitObject;
              if (!hitCircle.clicked && this.ms >= hitCircle.ms + okRange) {
                hitCircle.score = 0;
                hitCircle.done = true;
              }
            }
          }
        }

      });
    }
    this.draw();
    this.lastMS = this.ms;
    this.loopID = window.requestAnimationFrame(this.update.bind(this));
  }

  getFrameRate() {
    return this.ms - this.lastMS;
  }

  resize() {
    this.canvasSize.width = window.innerWidth;
    this.canvasSize.height = window.innerHeight;
    this.aspectRatio = this.canvasSize.width/this.canvasSize.height;
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
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = 'blue';

    if (this.hitObjects) {
      this.hitObjects.forEach((hitObject: HitCircle | Slider) => {
        if (hitObject instanceof HitCircle) {
          this.drawHitcircle(hitObject);
        }
      });
    }
    this.ctx.globalAlpha = 1;
  }

  drawHitcircle(hitCircle: HitCircle) {
    if (hitCircle.visible) {

      const multiplier = this.aspectRatio * 1.8;
      hitCircle.screenPos.x = Math.floor((hitCircle.pos.x * this.playArea.width) / this.osuArea.width);
      hitCircle.screenPos.y = Math.floor((hitCircle.pos.y * this.playArea.height) / this.osuArea.height);
      hitCircle.screenSize = hitCircle.size * multiplier;
      hitCircle.screenRadius = (hitCircle.screenSize/2);
      hitCircle.approachCircleScreenSize = hitCircle.approachCircleSize * multiplier;

      this.ctx.beginPath();
      this.ctx.globalAlpha = hitCircle.opacity;

      /* Approach Circle */
      if (hitCircle.approachCircleShow) {
        this.ctx.drawImage(
          this.assets.images['approach-circle'].data,
          (this.playArea.left + hitCircle.screenPos.x) - (hitCircle.approachCircleScreenSize/2),
          (this.playArea.top + hitCircle.screenPos.y) - (hitCircle.approachCircleScreenSize/2),
          hitCircle.approachCircleScreenSize, hitCircle.approachCircleScreenSize
        );
      }

      if (hitCircle.score === undefined || (hitCircle.score !== undefined && hitCircle.score > 0)) {

         /* Main circle */
        this.ctx.fillStyle = 'blue';
        this.ctx.arc(
          this.playArea.left + hitCircle.screenPos.x,
          this.playArea.top + hitCircle.screenPos.y,
          hitCircle.screenSize * 0.4,
          0, 2*Math.PI
        );
        this.ctx.fill();
        this.ctx.drawImage(
          this.assets.images['hitcircle-overlay'].data,
          (this.playArea.left + hitCircle.screenPos.x) - (hitCircle.screenSize/2),
          (this.playArea.top + hitCircle.screenPos.y) - (hitCircle.screenSize/2),
          hitCircle.screenSize, hitCircle.screenSize
        );

        /* Score */
        let image;
        switch(hitCircle.score) {
          case 50:
            image = this.assets.images['hit50'].data;
            break;
          case 100:
            image = this.assets.images['hit100'].data;
            break;
          case 300:
            image = this.assets.images['hit300'].data;
            break;
        }
        if (image) {
          const width = hitCircle.screenSize * 0.7;
          const height = width * (image.height/image.width);
          this.ctx.drawImage(
            image,
            (this.playArea.left + hitCircle.screenPos.x) - (width/2),
            (this.playArea.top + hitCircle.screenPos.y) - (height/2),
            width, height
          );
        }
      } else if (hitCircle.score !== undefined && hitCircle.score === 0) {
        const size = hitCircle.screenSize * 0.8;
        this.ctx.drawImage(
          this.assets.images['hit0'].data,
          (this.playArea.left + hitCircle.screenPos.x) - (size/2),
          (this.playArea.top + hitCircle.screenPos.y) - (size/2),
          size, size
        );
      }
      this.ctx.closePath();
    }
  }

  onMousedown(e: any) {
    if (e.which !== 2) {
      const x = e.pageX - this.playArea.left;
      const y = e.pageY - this.playArea.top;
      this.clickPos = {x, y};
    }
  }

  onMouseup(e: any) {
    if (e.which !== 2) {
      this.clickPos = null;
    }
  }

  preventContextMenu() {
    return false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(e: Event) {
    this.resize();
  }

  @HostListener('window:blur', ['$event'])
  onBlur() {
    //window.cancelAnimationFrame(this.loopID);
  }

  @HostListener('window:focus', ['$event'])
  onFocus() {
    //this.update(this.ms);
  }


  reset() {
    this.startMS = 0;
    this.lastMS = 0;
    this.ms = 0;
    this.soundService.stop('music');
  }

  ngOnDestroy() {
    this.reset();
    window.cancelAnimationFrame(this.loopID);
  }

}
