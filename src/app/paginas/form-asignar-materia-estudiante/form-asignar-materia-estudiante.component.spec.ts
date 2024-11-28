import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAsignarMateriaEstudianteComponent } from './form-asignar-materia-estudiante.component';

describe('FormAsignarMateriaEstudianteComponent', () => {
  let component: FormAsignarMateriaEstudianteComponent;
  let fixture: ComponentFixture<FormAsignarMateriaEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAsignarMateriaEstudianteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormAsignarMateriaEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
