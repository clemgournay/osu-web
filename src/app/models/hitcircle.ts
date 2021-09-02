import { Point } from '@models/point';
import { HitObject } from '@models/hitobject';

export class HitCircle extends HitObject {

  size: number = 50;
  approachCircleSize: number;
  approachCircleShow: boolean = true;

  constructor(point: Point, ms: number, soundType: number) {
    super(point, ms, soundType);
    this.approachCircleSize = this.size * 3;
  }

  setSize(size: number) {
    this.size = size;
  }


  approach(frameRate: number, duration: number) {
    this.fadeIn(frameRate, duration);
    this.reduceApproachCircle(frameRate, duration);
  }

  disappear(frameRate: number, duration: number) {
    this.fadeOut(frameRate, duration);
    this.approachCircleShow = false;
  }

  reduceApproachCircle(frameRate: number, duration: number) {
    const diff = (this.size * 3) - this.size;
    let inc = (diff * frameRate) / duration;
    this.approachCircleSize -= inc;
    if (this.approachCircleSize < this.size) {
      this.approachCircleSize = this.size;
    }
  }



}
