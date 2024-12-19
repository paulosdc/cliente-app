import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../model/Cliente';

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
    return this.http.delete<string>(`${this.baseUrl}/${cliente.id}`, { });
  }

  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`, { });
  }

  updateCliente(id: number, cliente: Cliente): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${id}`, cliente, { responseType: 'text' as 'json' });
  }

  criarCliente(cliente: Cliente): Observable<string> {
    return this.http.post<string>(this.baseUrl, cliente, { responseType: 'text' as 'json' });
  }
  
}