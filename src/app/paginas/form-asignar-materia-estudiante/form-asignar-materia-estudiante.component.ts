import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inscripcion } from '../../interfaces/Inscripcion';
@Component({
  selector: 'app-form-asignar-materia-estudiante',
  standalone: true,
  imports: [],
  templateUrl: './form-asignar-materia-estudiante.component.html',
  styleUrl: './form-asignar-materia-estudiante.component.sass'
})
export class FormAsignarMateriaEstudianteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Inscripcion) {}
}
