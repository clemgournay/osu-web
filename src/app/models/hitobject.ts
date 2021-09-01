import { Point } from '@models/point';

export class HitObject {
  point: Point;
  ms: number;
  soundType: number;
  opacity: number;

  constructor(point: Point, ms: number, soundType: number) {
    this.point = point;
    this.ms = ms;
    this.soundType = soundType;
    this.opacity = 0;
  }

  fadeIn(frameRate: number, duration: number) {

  }

}
