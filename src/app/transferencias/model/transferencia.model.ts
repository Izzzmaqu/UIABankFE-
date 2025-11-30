
export interface Transferencia {
  id?: number;
  cuentaOrigen: string;
  cuentaDestino: string;
  monto: number;
  moneda: string;
  estado?: string;
  fechaProgramada?: string;
  idempotencyKey?: string;
}
