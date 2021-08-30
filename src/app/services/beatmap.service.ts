import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Beatmap } from '@models/beatmap';
import { BeatmapData } from '@models/beatmap-data';

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

    const lines = content.split('\r\n');
    let currCategory: any;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line[0]==='[') {
        const category = line.replace(/\[/g, '').replace(/\]/g, '');
        data[category] = {};
        currCategory = category;
      } else {

        const partsDot = line.split(':');
        const partsComma = line.split(',');

        if (line[0] !== '/') {
          if (currCategory === 'HitObjects' || currCategory === 'TimingPoints' || currCategory === 'Events') {
            if (Object.keys(data[currCategory]).length === 0) {
              data[currCategory] = [];
            }

            const partsComma = line.split(',');
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

    console.log(data);
    return data;
  }

}
