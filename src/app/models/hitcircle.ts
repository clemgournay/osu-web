import { Coordinates } from '@models/coordinates';
import { HitObject } from '@models/hitobject';

export class HitCircle extends HitObject {

  size: number = 50;
  radius: number = 25;
  screenSize: number = 0;
  screenRadius: number = 0;
  approachCircleSize: number;
  approachCircleScreenSize: number = 0;
  approachCircleShow: boolean = true;

  constructor(pos: Coordinates, ms: number, comboNB: number, soundType: number) {
    super(pos, ms, comboNB, soundType);
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

  isCoorInside(coor: Coordinates): boolean {
    if (
      (coor.x - this.screenPos.x) * (coor.x - this.screenPos.x) +
      (coor.y - this.screenPos.y) * (coor.y - this.screenPos.y) <=
      this.screenRadius * this.screenRadius
    )
      return true;
    else
      return false;
  }



}
