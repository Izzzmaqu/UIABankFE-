import { Injectable } from '@angular/core';
import { ApiHttpService } from './api-http.service';
import { Observable } from 'rxjs';

export interface Proveedor {
  id?: number;
  nombre: string;
  tipoServicio: string;
  formatoContrato: string;
  longitudMinima: number;
  longitudMaxima: number;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {

  constructor(private api: ApiHttpService) {}

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.api.get<Proveedor[]>('api/Proveedores');
  }

  obtenerProveedorPorId(id: number): Observable<Proveedor> {
    return this.api.get<Proveedor>(`api/Proveedores/${id}`);
  }

  crearProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.api.post<Proveedor>('api/Proveedores', proveedor);
  }

  actualizarProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    return this.api.put<Proveedor>(`api/Proveedores/${id}`, proveedor);
  }

  eliminarProveedor(id: number): Observable<any> {
    return this.api.delete(`api/Proveedores/${id}`);
  }
}
