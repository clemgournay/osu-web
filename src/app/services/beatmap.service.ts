import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Beatmap } from '@models/beatmap';
import { BeatmapData } from '@models/beatmap-data';
import { Point } from '@models/point';
import { HitCircle } from '@models/hitcircle';
import { Slider } from '@models/slider';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class BeatmapService {

  baseURL: string = environment.apiURL + '/beatmaps';

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}`, environment.apiOptions).pipe((catchError((e) => throwError(e))));
  }

  getByID(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/${id}`, environment.apiOptions).pipe((catchError((e) => throwError(e))));
  }

  add(files: Array<File>): Observable<any> {
    const formData = new FormData();
    files.forEach((file: File) => {
      formData.append(`beatmap`, file);
    });
    return this.http.post<any>(`${this.baseURL}`, formData, environment.apiOptions).pipe((catchError((e) => throwError(e))));
  }

  getDiffData(beatmap: Beatmap, diffID: string): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/${beatmap.orgID}/${diffID}`).pipe((catchError((e) => throwError(e))));
  }

  delete(beatmap: Beatmap): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/${beatmap._id}`).pipe((catchError((e) => throwError(e))));
  }

  parseOSU(content: string) {
    const data: any = {};

    const rows = content.split('\r\n');
    let currCategory: any;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (row[0]==='[') {
        const category = row.replace(/\[/g, '').replace(/\]/g, '');
        data[category] = {};
        currCategory = category;
      } else {

        const partsDot = row.split(':');
        const partsComma = row.split(',');

        if (row[0] !== '/') {
          if (currCategory === 'HitObjects' || currCategory === 'TimingPoints' || currCategory === 'Events') {
            if (Object.keys(data[currCategory]).length === 0) {
              data[currCategory] = [];
            }

            const partsComma = row.split(',');
            const rightPart: Array<any> = [];

            partsComma.forEach((item: string) => {
              let itemFormatted: string | number = item.replace(/^\s+/g, '').trim();
              if (currCategory === 'HitObjects' && item.split('|').length < 2) itemFormatted = parseInt(item);
              rightPart.push(itemFormatted);
            });
            data[currCategory].push(rightPart);

          } if (partsDot.length > 1 && partsComma.length > 1) {
            const leftPart = partsDot[0].replace(/^\s+/g, '');
            const rightPart = partsDot[1].split(',');
            rightPart.forEach((item) => {
              item = item.replace(/^\s+/g, '').trim();
            });
            data[currCategory][leftPart] = rightPart;
          } else if (partsDot.length > 1) {
            const leftPart = partsDot[0].replace(/^\s+/g, '').trim();
            const rightPart = partsDot[1].replace(/^\s+/g, '').trim();
            data[currCategory][leftPart] = rightPart;
          }
        }
      }
    }

    return this.formatHitObjects(data);
  }

  formatHitObjects(data: BeatmapData) {
    if (data.HitObjects) {
      data.HitObjects.forEach((row: any, index: number) => {
        if (row.length <= 5) {
          if (data.HitObjects && data.HitObjects[index]) {
            const point: Point = {x: row[0], y: row[1]};
            data.HitObjects[index] = new HitCircle(point, row[2], row[3]);
          }
        } else if (row.length >= 8) {
          if (data.HitObjects && data.HitObjects[index]) {
            const point: Point = {x: row[0], y: row[1]};
            const bezierItems = row[5].split('|');
            bezierItems.shift();
            const bezierPoints: Array<Point> = [];
            bezierItems.forEach((couple: string) => {
              const points = couple.split(':');
              const bezierPoint = new Point(parseInt(points[0]), parseInt(points[1]));
              bezierPoints.push(bezierPoint);
            });
            data.HitObjects[index] = new Slider(point, row[2], row[3], bezierPoints, row[5]);
          }
        }

      });
    }
    return data;
  }

}
