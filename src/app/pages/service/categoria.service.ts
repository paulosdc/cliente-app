import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../model/Cliente';
import { Categoria } from '../../model/Categoria';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private baseUrl = 'http://localhost:8080/categoria';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.baseUrl);
  }
  
}