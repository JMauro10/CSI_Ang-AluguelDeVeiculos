import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cliente} from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  url: string = 'http://localhost:8080'

  constructor(private http: HttpClient) { }

  incluirCliente(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.url + '/cliente', cliente);
  }

  listarCliente():Observable<Cliente[]>{
    return this.http.get<Cliente[]>(this.url + '/cliente');
  }

  deletarClienteById(id: number): Observable<void>{
    return this.http.delete<void>(this.url + '/cliente/' + id);
  }

  atualizarCliente(cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(this.url + '/cliente', cliente);
  }
}
