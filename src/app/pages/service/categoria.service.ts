import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../model/Cliente';
import { Categoria } from '../../model/Categoria';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private baseUrl = 'https://cliente-api-6acace0cf8b7.herokuapp.com/categoria';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.baseUrl);
  }

  criarCategoria(categoria: Categoria): Observable<string> {
    return this.http.post<string>(this.baseUrl, categoria, { responseType: 'text' as 'json' });
  }

  atualizarCategoria(categoria: Categoria): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${categoria.id}`, categoria, { responseType: 'text' as 'json' });
  }

  deletarCategoria(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${id}`, { responseType: 'text' as 'json' });
  }
}