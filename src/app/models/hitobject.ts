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

}
