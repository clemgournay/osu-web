import { Point } from '@models/point';
import { HitObject } from '@models/hitobject';

export class HitCircle extends HitObject {

  constructor(point: Point, ms: number, soundType: number) {
    super(point, ms, soundType);
  }


}
