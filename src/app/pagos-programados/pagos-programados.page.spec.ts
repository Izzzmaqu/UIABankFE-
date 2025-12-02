import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagosProgramadosPage } from './pagos-programados.page';

describe('PagosProgramadosPage', () => {
  let component: PagosProgramadosPage;
  let fixture: ComponentFixture<PagosProgramadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PagosProgramadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
