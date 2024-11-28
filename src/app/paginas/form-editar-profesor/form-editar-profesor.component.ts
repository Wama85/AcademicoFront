import { Component,Inject, NgModule } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Profesor } from '../../interfaces/profesor';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProfesorService } from '../../servicios/profesor.service';
import { updateMetadata } from '@angular/fire/storage';
import { SelectionColorService } from '../../servicios/selection-color.service';
import * as bcrypt from 'bcryptjs'


@Component({
  selector: 'app-form-editar-profesor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './form-editar-profesor.component.html',
  styleUrl: './form-editar-profesor.component.sass'
})
export class FormEditarProfesorComponent {
  selectedColor: string = '';
  profesor: Profesor;
  profesores: Profesor[] = [];
  plainPassword: string = ''; 



  constructor(
    private colorService: SelectionColorService,
    public dialogRef: MatDialogRef<FormEditarProfesorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Profesor,
    private profesorService: ProfesorService
  ) {
    this.profesor = { ...data };
    this.profesorService.getProfesores().subscribe({
      next: (profesores) => (this.profesores = profesores),
      error: (error) => console.error('Error al obtener los profesores:', error),
    });
     this.plainPassword = '';
    
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
  
  idProfesorExiste(id: number): boolean {
    return this.profesores.some((profesor) => profesor.id_profesor === id);
  }

  async  guardar() {
    let updatedPassword = this.profesor.password;
     if (this.plainPassword.trim()) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(this.plainPassword.trim(), salt);
    }
    const profesorData = {
      id_profesor: this.profesor.id_profesor,
      nombre: this.profesor.nombre,
      apellido: this.profesor.apellido,
      email: this.profesor.email,
      password: updatedPassword
    };

   
      this.profesorService.updateProfesor(this.profesor.id_profesor, profesorData).subscribe({
        next: (updatedProfesor) => {
          console.log('Profesor actualizado:', updatedProfesor);
          this.dialogRef.close(updatedProfesor);
        },
        error: (error) => {
          console.error('Error al actualizar el profesor:', error);
        },
      });
    
     
  }

  cancelar() {
    this.dialogRef.close();
  }
}
