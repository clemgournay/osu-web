export class Beatmap {
  _id: string;
  orgID: string;
  title: string;
  artist: string;
  source: string;
  tags: string;
  audioFilename: string;
  backgroundFilename: string;
  difficulties: Array<any>;
  updload_date: Date;
}
