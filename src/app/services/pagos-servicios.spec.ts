import { Injectable } from '@angular/core';
import { ApiHttpService } from './api-http.service';
import { Observable } from 'rxjs';

export interface PagoServicio {
  id?: number;
  proveedorId: number;
  numeroContrato: string;
  monto: number;
  cuentaOrigenId: number;
  fechaProgramada?: Date;
  estado?: string;
  numeroReferencia?: string;
  fechaCreacion?: Date;
}

export interface RealizarPagoRequest {
  proveedorId: number;
  numeroContrato: string;
  monto: number;
  cuentaOrigenId: number;
  fechaProgramada?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PagosServiciosService {

  constructor(private api: ApiHttpService) {}

  realizarPago(pago: RealizarPagoRequest): Observable<any> {
    return this.api.post('api/PagosServicios', pago);
  }

  obtenerPagos(): Observable<PagoServicio[]> {
    return this.api.get<PagoServicio[]>('api/PagosServicios');
  }

  obtenerPagosProgramados(): Observable<PagoServicio[]> {
    return this.api.get<PagoServicio[]>('api/PagosServicios/programados');
  }

  cancelarPago(id: number): Observable<any> {
    return this.api.delete(`api/PagosServicios/${id}/cancelar`);
  }

  descargarComprobante(id: number): Observable<Blob> {
    return this.api.get(`api/PagosServicios/${id}/comprobante`, { responseType: 'blob' });
  }
}
