import { HitCircle } from '@models/hitcircle';
import { Slider } from '@models/slider';

export class BeatmapData {
  General?: Object;
  TimingPoints?: Array<string>;
  Events?: Array<string>;
  HitObjects?: Array<HitCircle | Slider>;
}
