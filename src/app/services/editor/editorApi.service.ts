import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CodeRequest } from '../../models/dto/codeRequest';

@Injectable({
  providedIn: 'root'
})
export class EditorApiService {

  baseUrl: string = 'http://localhost:8080/api/v1'
  constructor(private http: HttpClient) { }

  execute(code: CodeRequest): Observable<String>{
    return this.http.post(`${this.baseUrl}/run`, code, {responseType : 'text'});
  }
}