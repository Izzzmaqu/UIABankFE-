import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from '../../services/api-http.service';
import { Transferencia } from '../model/transferencia.model';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {

  private baseUrl = 'Transferencia';


  private programadaUrl = 'api/TransferenciaProgramada';

  constructor(private apiHttp: ApiHttpService) {}

  //(RF-D2 + Idempotency-Key opcional)
  crear(transferencia: Transferencia, idempotencyKey?: string): Observable<any> {
    const options = idempotencyKey
      ? { headers: { 'Idempotency-Key': idempotencyKey } }
      : undefined;

    return this.apiHttp.post(`${this.baseUrl}/crear`, transferencia, options);
  }

  // GET /Transferencia/usuario/{usuarioId}
  listarPorUsuario(usuarioId: number): Observable<Transferencia[]> {
    return this.apiHttp.get<Transferencia[]>(
      `${this.baseUrl}/usuario/${usuarioId}`
    );
  }

  // GET /Transferencia/{id}
  obtenerPorId(id: number): Observable<Transferencia> {
    return this.apiHttp.get<Transferencia>(`${this.baseUrl}/${id}`);
  }

  // POST /Transferencia/ejecutar (pRF-D2)
  ejecutar(
    transferencia: Transferencia,
    idempotencyKey: string
  ): Observable<any> {
    const options = {
      headers: { 'Idempotency-Key': idempotencyKey }
    };

    return this.apiHttp.post(
      `${this.baseUrl}/ejecutar`,
      transferencia,
      options
    );
  }

  // POST /api/TransferenciaProgramada/programar
  programar(transferencia: Transferencia): Observable<any> {
    return this.apiHttp.post(
      `${this.programadaUrl}/programar`,
      transferencia
    );
  }

  // GET /api/TransferenciaProgramada/programadas/usuario/{usuarioId}
  listarProgramadasPorUsuario(usuarioId: number): Observable<Transferencia[]> {
    return this.apiHttp.get<Transferencia[]>(
      `${this.programadaUrl}/programadas/usuario/${usuarioId}`
    );
  }

  // PUT /api/TransferenciaProgramada/programadas/{id}/cancelar
  cancelarProgramada(id: number): Observable<any> {
    return this.apiHttp.put(
      `${this.programadaUrl}/programadas/${id}/cancelar`,
      {}
    );
  }
}
