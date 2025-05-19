import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiculoFormularioComponent } from './veiculo-formulario.component';

describe('VeiculoFormularioComponent', () => {
  let component: VeiculoFormularioComponent;
  let fixture: ComponentFixture<VeiculoFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeiculoFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeiculoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
