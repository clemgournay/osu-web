import { Coordinates } from '@models/coordinates';
import { HitObject } from '@models/hitobject';


export class Slider extends HitObject {
  curves: Array<Coordinates>;
  endSoundType: number;

  constructor(pos: Coordinates, ms: number, startSoundType: number, curves: Array<Coordinates>, endSoundType: number) {
    super(pos, ms, startSoundType);
    this.curves = curves;
    this.endSoundType = endSoundType;
  }
}
