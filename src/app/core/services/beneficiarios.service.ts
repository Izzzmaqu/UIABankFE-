import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from '../../services/api-http.service';
import {
  BeneficiarioDto,
  RegistrarBeneficiarioRequest,
  BeneficiariosFiltro,
} from '../models/beneficiario.model';

@Injectable({
  providedIn: 'root',
})
export class BeneficiariosService {
  constructor(private apiHttp: ApiHttpService) {}

  registrar(request: RegistrarBeneficiarioRequest): Observable<BeneficiarioDto> {
    // POST https://.../api/beneficiarios
    return this.apiHttp.post<BeneficiarioDto>('beneficiarios', request);
  }

  confirmar(id: string, clienteId: string): Observable<void> {
    // POST https://.../api/beneficiarios/{id}/confirmar?clienteId=...
    return this.apiHttp.post<void>(`beneficiarios/${id}/confirmar`, null, {
      params: { clienteId },
    });
  }

  actualizarAlias(id: string, alias: string): Observable<void> {
    // PUT https://.../api/beneficiarios/{id}/alias
    return this.apiHttp.put<void>(`beneficiarios/${id}/alias`, { alias });
  }

  eliminar(id: string, clienteId: string): Observable<void> {
    // DELETE https://.../api/beneficiarios/{id}?clienteId=...
    return this.apiHttp.delete<void>(`beneficiarios/${id}`, {
      params: { clienteId },
    });
  }

  obtenerPorId(id: string, clienteId: string): Observable<BeneficiarioDto> {
    // GET https://.../api/beneficiarios/{id}?clienteId=...
    return this.apiHttp.get<BeneficiarioDto>(`beneficiarios/${id}`, {
      params: { clienteId },
    });
  }

  obtenerPorCliente(filtro: BeneficiariosFiltro): Observable<BeneficiarioDto[]> {
    const params: any = {
      clienteId: filtro.clienteId,
    };

    if (filtro.alias) params.alias = filtro.alias;
    if (filtro.banco) params.banco = filtro.banco;
    if (filtro.pais) params.pais = filtro.pais;

    // GET https://.../api/beneficiarios?clienteId=...&alias=...
    return this.apiHttp.get<BeneficiarioDto[]>('beneficiarios', { params });
  }
}