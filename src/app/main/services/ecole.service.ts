import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Ecole } from '../models/ecole.model';
@Injectable({
  providedIn: 'root'
})
export class EcoleService {

  readonly baseURL = 'http://localhost:8081/ecoles';

  constructor(private http: HttpClient) { }

  postEcole(ecole: Ecole) {
    return this.http.post(this.baseURL, ecole);
  }

  getEcoleList(keyword) {
    let params = new HttpParams();
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    return this.http.get(this.baseURL, { params });
  }

  putEcole(ecole: Ecole) {
    return this.http.put(this.baseURL + `/${ecole.id}`, ecole);
  }

  deleteEcole(id: string) {
    return this.http.delete(this.baseURL + `/${id}`);
  }

  getEcoleById(id: string) {
    return this.http.get(this.baseURL + `/${id}`);
  }
}