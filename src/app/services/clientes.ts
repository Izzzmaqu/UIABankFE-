import { Injectable } from '@angular/core';
import { ApiHttpService } from './api-http.service';
import { Observable } from 'rxjs';

export interface Cliente {
  id?: number;
  identificacion: string;
  nombreCompleto: string;
  telefono: string;
  correo: string;
  fechaCreacion?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ClientesService {

  constructor(private api: ApiHttpService) {}

  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.api.post<Cliente>('api/Clientes', cliente);
  }

  obtenerClientes(): Observable<Cliente[]> {
    return this.api.get<Cliente[]>('api/Clientes');
  }

  obtenerClientePorId(id: number): Observable<Cliente> {
    return this.api.get<Cliente>(`api/Clientes/${id}`);
  }

  actualizarCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.api.put<Cliente>(`api/Clientes/${id}`, cliente);
  }
}
