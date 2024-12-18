import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../model/Cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private baseUrl = 'http://localhost:8080/cliente';

  constructor(private http: HttpClient) {}

  getClientes(page: number, size: number): Observable<Cliente[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Cliente[]>(this.baseUrl, { params });
  }

  desativarCliente(cliente: Cliente): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${cliente.id}`, { cliente });
  }
}