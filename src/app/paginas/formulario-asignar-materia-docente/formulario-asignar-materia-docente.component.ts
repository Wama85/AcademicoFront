import { Component ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'; 
import {Profesor} from '../../interfaces/profesor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MensajeService} from '../mensaje/mensaje.component'
import { SelectionColorService } from '../../servicios/selection-color.service';
@Component({
  selector: 'app-formulario-asignar-materia-docente',
  standalone: true,
  imports: [CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,

  ],
  templateUrl: './formulario-asignar-materia-docente.component.html',
  styleUrl: './formulario-asignar-materia-docente.component.sass'
})
export class FormularioAsignarMateriaDocenteComponent {
  selectedColor: string = '';
  profesor?: Profesor;
  profesores: Profesor[];
  fecha:Date;
  
  constructor(
    private colorService: SelectionColorService,
    public dialogRef: MatDialogRef<FormularioAsignarMateriaDocenteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private readonly mensajeService:MensajeService
  ) {
    this.profesores= data.profesores || '';
    this.fecha = data.fecha || new Date();
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
  
  onAdd() {
    if(!this.profesor){
      this.mensajeService.mostrarMensajeError("Error!!","Debe asignar un profesor para la materia");
      return;
    }
    this.dialogRef.close({
      profesor: this.profesor,
      fecha: this.fecha,
    });
    this.mensajeService.mostrarMensajeExito("Exito!!","Se asigno al profesor con exito!!")
  }

  onCancel() {
    this.dialogRef.close();
  }


}
