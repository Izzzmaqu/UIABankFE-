import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from '../../services/api-http.service';
import {
  CuentaDto,
  AbrirCuentaRequest,
  CuentasFiltro,
} from '../models/cuenta.model';

@Injectable({
  providedIn: 'root',
})
export class CuentasService {
  // ApiHttpService ya hace: baseUrl + '/' + url
  // y baseUrl viene de environment.apiBaseUrl
  constructor(private apiHttp: ApiHttpService) {}

  abrirCuenta(request: AbrirCuentaRequest): Observable<CuentaDto> {
    // POST https://.../api/cuentas
    return this.apiHttp.post<CuentaDto>('cuentas', request);
  }

  obtenerPorId(id: string): Observable<CuentaDto> {
    // GET https://.../api/cuentas/{id}
    return this.apiHttp.get<CuentaDto>(`cuentas/${id}`);
  }

  obtenerPorCliente(clienteId: string): Observable<CuentaDto[]> {
    // GET https://.../api/cuentas/por-cliente/{clienteId}
    return this.apiHttp.get<CuentaDto[]>(`cuentas/por-cliente/${clienteId}`);
  }

  buscar(filtro: CuentasFiltro): Observable<CuentaDto[]> {
    const params: any = {};

    if (filtro.clienteId) {
      params.clienteId = filtro.clienteId;
    }
    if (filtro.tipo !== undefined) {
      params.tipo = filtro.tipo;
    }
    if (filtro.moneda !== undefined) {
      params.moneda = filtro.moneda;
    }
    if (filtro.estado !== undefined) {
      params.estado = filtro.estado;
    }

    // GET https://.../api/cuentas?clienteId=...&tipo=...
    return this.apiHttp.get<CuentaDto[]>('cuentas', { params });
  }

  bloquear(id: string): Observable<void> {
    // PUT https://.../api/cuentas/{id}/bloquear
    return this.apiHttp.put<void>(`cuentas/${id}/bloquear`, {});
  }

  cerrar(id: string): Observable<void> {
    // PUT https://.../api/cuentas/{id}/cerrar
    return this.apiHttp.put<void>(`cuentas/${id}/cerrar`, {});
  }
}