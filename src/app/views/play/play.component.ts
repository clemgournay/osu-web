
import { Component, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { HTMLElementSize } from '@models/html-element-size';
import { Beatmap } from '@models/beatmap';
import { BeatmapDifficulty } from '@models/beatmap-difficulty';
import { BeatmapData } from '@models/beatmap-data';

import { BeatmapService } from '@services/beatmap.service';
import { SoundService } from '@services/sound.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements AfterViewInit {

  @ViewChild('canvas') canvasRef: ElementRef;
  canvas: HTMLCanvasElement;
  canvasSize: HTMLElementSize =  {width: 0, height: 0};
  ctx: CanvasRenderingContext2D;
  beatmap: Beatmap;
  difficulty: BeatmapDifficulty;
  data: BeatmapData;
  hitObjects: Array<string>;
  music: HTMLAudioElement;
  startMS: number;
  ms: number;
  lineIndex: number = 0;

  constructor(
    private router: Router,
    private beatmapService: BeatmapService,
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
      console.log('[BEATMAP DATA]', this.data);
      this.soundService.loadMusic(this.beatmap, this.onLoaded.bind(this));
    }  else {
      alert('Une erreur est survenue. Veuillez réessayer');
      this.router.navigateByUrl('select');
    }
  }

  onLoaded() {
    //this.soundService.play(this.beatmap.orgID);
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
    this.update(0);
  }

  update(currentTime: number) {
    if(!this.startMS) this.startMS = currentTime;
    this.ms = Math.floor(currentTime - this.startMS);

    /*const hitObjectMS = parseInt(this.hitObjects[this.lineIndex][2]);

    const line = this.hitObjects[this.lineIndex];

    if (this.ms >= hitObjectMS) {

      const x = parseInt(line[0]);
      const y = parseInt(line[1]);

      const color = 'red';
      this.ctx.beginPath();
      this.drawHitcircle(x, y, 50, color);
      this.ctx.closePath();


      this.lineIndex++;
      if (this.lineIndex === this.hitObjects.length - 1) {
        console.log('end');
      }
    }*/

    this.draw();
    window.requestAnimationFrame(this.update.bind(this));
  }

  resize() {
    this.canvasSize.width = window.screen.width;
    this.canvasSize.height = window.screen.height;
  }

  draw() {

    this.ctx.fillStyle = 'blue';
    //this.drawHitcircle(200, 300, 50, 'red');
    //this.drawHitcircle(400, 550, 50, 'blue');


  }

  drawHitcircle(x: number, y: number, size: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.arc(x, y, size, 0, 360, false);
    this.ctx.fill();
  }

  @HostListener('window:resize', ['$event'])
  onResize(e: Event) {
    this.resize();
  }

}
