import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ServerResponse } from './definitions/ServerResponse';

@Injectable({
  providedIn: 'root'
})
export class GuessService {
  private BASE_URL = `/guess`;

  constructor(private http: HttpClient) { }

  submit(word: string): Observable<ServerResponse.GuessResponse> {
    const url = `${this.BASE_URL}/${word}`;
    console.log(url);
    return this.http.get<ServerResponse.GuessResponse>(url);
  }
}
