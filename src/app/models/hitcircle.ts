import { Coordinates } from '@models/coordinates';
import { HitObject } from '@models/hitobject';

export class HitCircle extends HitObject {

  constructor(pos: Coordinates, ms: number, comboNB: number, soundType: number) {
    super(pos, ms, comboNB, soundType);
  }



}
