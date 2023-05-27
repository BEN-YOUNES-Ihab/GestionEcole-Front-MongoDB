import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classe } from '../models/classe.model';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {

  private baseUrl = 'http://localhost:3000/classes';

  constructor(private http: HttpClient) { }

  addClasseByEcoleId(id: number, classe: Classe): Observable<Classe> {
    return this.http.post<Classe>(`${this.baseUrl}/addClasseByEcoleId/${id}`, classe);
  }

  getClassesByEcoleId(ecoleId: number, classeName?: string, page?: number, size?: number): Observable<any> {
    let params = new HttpParams();
    params = params.set('ecole_id', ecoleId.toString());
    if (classeName) {
      params = params.set('nom', classeName);
    }
    if (page) {
      params = params.set('page', page.toString());
    }
    if (size) {
      params = params.set('size', size.toString());
    }
    return this.http.get<any>(`${this.baseUrl}/getClasses`, { params });
  }

  updateClasse(classe: Classe): Observable<Object> {
    return this.http.put(`${this.baseUrl}/updateClasse/${classe._id}`, classe);
  }

  deleteClasse(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteClasse/${id}`, { responseType: 'text' });
  }

}