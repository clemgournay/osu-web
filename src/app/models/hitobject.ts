import { Coordinates } from '@models/coordinates';

export class HitObject {
  pos: Coordinates;
  screenPos: Coordinates;
  ms: number;
  soundType: number;
  opacity: number;
  showing: boolean;
  hiding: boolean;
  visible: boolean;
  clicked: boolean;
  comboNB: number;
  score: number | undefined;
  done: boolean;
  size: number = 50;
  radius: number = 25;
  screenSize: number = 0;
  screenRadius: number = 0;
  approachCircleSize: number;
  approachCircleScreenSize: number = 0;
  approachCircleShow: boolean = true;

  constructor(pos: Coordinates, ms: number, comboNB: number, soundType: number) {
    this.pos = pos;
    this.screenPos = {x: 0, y: 0};
    this.ms = ms;
    this.soundType = soundType;
    this.opacity = 0;
    this.showing = true;
    this.hiding = false;
    this.visible = false;
    this.clicked = false;
    this.comboNB = comboNB;
    this.done = false;
    this.approachCircleSize = this.size * 3;
  }

  fadeIn(frameRate: number, duration: number) {
    this.showing = true;
    this.visible = true;
    const inc = (100 * frameRate) / duration;
    this.opacity += (inc/100);
    if (this.opacity > 1) {
      this.opacity = 1;
      this.showing = false;
    }
  }

  fadeOut(frameRate: number, duration: number) {
    this.hiding = true;
    const inc = (100 * frameRate) / duration;
    this.opacity -= (inc/100);
    if (this.opacity < 0) {
      this.opacity = 0;
      this.hiding = false;
      this.visible = false;
    }
  }

  hide() {
    this.opacity = 0;
    this.visible = false;
  }

  show() {
    this.opacity = 1;
    this.visible = true;
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

  setSize(size: number) {
    this.size = size;
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
