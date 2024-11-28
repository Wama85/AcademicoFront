import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { Estudiante } from '../../interfaces/estudiante';
import { MensajeService } from '../mensaje/mensaje.component';
import { EstudiantesAdminService } from '../../servicios/estudiantes-admin.service';
import { MatNativeDateModule } from '@angular/material/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectionColorService } from '../../servicios/selection-color.service';


// Tipo extendido con la propiedad 'seleccionado'
interface EstudianteConSeleccion extends Estudiante {
  seleccionado: boolean;
}

@Component({
  selector: 'app-formulario-asignar-estudiantes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './formulario-asignar-materia-estudiante.component.html',
  styleUrls: ['./formulario-asignar-materia-estudiante.component.sass'],
})
export class FormularioAsignarMateriaEstudianteComponent {
  selectedColor: string = '';
  estudiantes: EstudianteConSeleccion[] = []; // Lista extendida de estudiantes
  seleccionados: Estudiante[] = []; // Lista de seleccionados con el formato original
  fechaInscripcion: Date = new Date(); // Definir la propiedad 'fechaInscripcion'

  constructor(
    private colorService: SelectionColorService,
    public dialogRef: MatDialogRef<FormularioAsignarMateriaEstudianteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly mensajeService: MensajeService
  ) {
    this.cargarEstudiantes(data.estudiantes || []);
  }

  ngOnInit() {
    this.colorService.currentColor$.subscribe(color => {
      this.selectedColor = color; // Actualiza el color recibido
      console.log('Color recibido en Login:', this.selectedColor);
    });
  }

  getColorClass(): string {
    switch (this.selectedColor) {
      case 'verde':
        return 'color-verde';
      case 'amarillo':
        return 'color-amarillo';
      default:
        return 'color-azul';
    }
  }
  
  // Cargar estudiantes con la propiedad 'seleccionado'
  cargarEstudiantes(estudiantes: Estudiante[]) {
    console.log('Estudiantes cargados:', estudiantes);

    this.estudiantes = estudiantes.map(est => ({
      ...est,
      seleccionado: false, // Se agrega la propiedad 'seleccionado'
    }));
  }

  onAdd() {
    // Filtra solo los seleccionados
    this.seleccionados = this.estudiantes
      .filter(est => est.seleccionado) 
      .map(est => ({
        id_estudiante: est.id_estudiante,
        nombre: est.nombre,
        apellido: est.apellido,
        email: est.email,
        foto: est.foto,
        paralelo: est.paralelo,
      })); 

      console.log(this.seleccionados)
    // Validar selección
    

    // Validar que se haya seleccionado una fecha de inscripción


    this.dialogRef.close({
      estudiantesSeleccionados: this.seleccionados,
      fechaInscripcion: this.fechaInscripcion,
    });

  }

  onCheckboxChange(estudiante: EstudianteConSeleccion) {

  }

  onCancel() {
    this.dialogRef.close();
  }
}
