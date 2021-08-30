import { HitCircle } from '@models/hitcircle';

export class BeatmapData {
  General?: Object;
  TimingPoints?: Array<string>;
  Events?: Array<string>;
  HitObjects?: Array<string | number | HitCircle>;
}
