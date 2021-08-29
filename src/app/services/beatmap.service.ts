import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Beatmap } from '@models/beatmap';

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

  delete(beatmap: Beatmap): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/${beatmap._id}`, environment.apiOptions).pipe((catchError((e) => throwError(e))));
  }


}
