import { TipoCuenta, Moneda, EstadoCuenta } from './enums-cuenta.model';

export interface CuentaDto {
  id: string;
  numero: string;
  tipo: TipoCuenta;
  moneda: Moneda;
  estado: EstadoCuenta;
  saldo: number;
  clienteId: string;
}

export interface AbrirCuentaRequest {
  clienteId: string;
  tipo: TipoCuenta;
  moneda: Moneda;
  saldoInicial: number;
}

export interface CuentasFiltro {
  clienteId?: string;
  tipo?: TipoCuenta;
  moneda?: Moneda;
  estado?: EstadoCuenta;
}