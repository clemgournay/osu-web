import { Component, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { HTMLElementSize } from '@models/html-element-size';
import { Beatmap } from '@models/beatmap';

import { BeatmapService } from '@services/beatmap.service';


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
  diffIndex: number;
  previousTime: number = 0;
  clock: number = 0;
  clockRate: number = 1;

  constructor(
    private router: Router
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras.state) {
      this.beatmap = nav.extras.state.beatmap;
      this.diffIndex = nav.extras.state.diff;
      console.log(this.beatmap)
      console.log(this.beatmap.difficulties[this.diffIndex]);
    } else {
      //this.router.navigateByUrl('select');
    }
  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    const ctx = this.canvas.getContext('2d');
    if (ctx) this.ctx = ctx;
    setTimeout(this.init.bind(this));
  }

  init() {
    this.resize();
    this.draw();
    this.update(0);
  }

  update(currentTime: number) {
    /*const deltaTime = Math.min(currentTime - this.previousTime, 1000 / 10) * this.clockRate;
    this.previousTime = currentTime;
    this.clock += Math.floor(deltaTime);*/
    this.draw();
    window.requestAnimationFrame(this.update.bind(this));
  }

  resize() {
    this.canvasSize.width = window.screen.width;
    this.canvasSize.height = window.screen.height;
  }

  draw() {

    this.ctx.fillStyle = 'blue';
    this.drawHitcircle(200, 300, 50, 'red');
    this.drawHitcircle(400, 550, 50, 'blue');


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
