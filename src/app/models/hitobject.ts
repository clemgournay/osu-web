import { Point } from '@models/point';

export class HitObject {
  point: Point;
  ms: number;
  soundType: number;
  opacity: number;
  showing: boolean;
  hiding: boolean;

  constructor(point: Point, ms: number, soundType: number) {
    this.point = point;
    this.ms = ms;
    this.soundType = soundType;
    this.opacity = 0;
    this.showing = true;
    this.hiding = false;
  }

  fadeIn(frameRate: number, duration: number) {
    const inc = (100 * frameRate) / duration;
    this.opacity += (inc/100);
    if (this.opacity > 1) this.opacity = 1;
  }

  fadeOut(frameRate: number, duration: number) {
    const inc = (100 * frameRate) / duration;
    this.opacity -= (inc/100);
    if (this.opacity < 0) this.opacity = 0;
  }

}
