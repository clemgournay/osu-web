import { Point } from '@models/point';
import { HitObject } from '@models/hitobject';


export class Slider extends HitObject {
  curves: Array<Point>;
  endSoundType: number;

  constructor(point: Point, ms: number, startSoundType: number, curves: Array<Point>, endSoundType: number) {
    super(point, ms, startSoundType);
    this.curves = curves;
    this.endSoundType = endSoundType;
  }
}
