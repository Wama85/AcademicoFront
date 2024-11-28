import { Component, OnInit } from '@angular/core';
import { Profesor } from '../../interfaces/profesor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ProfesorService } from '../../servicios/profesor.service';
import { MatDialog } from '@angular/material/dialog';
import { FormEditarProfesorComponent } from '../form-editar-profesor/form-editar-profesor.component';
import { SelectionColorService } from '../../servicios/selection-color.service';
import { FormCrearProfesorComponent } from '../form-crear-profesor/form-crear-profesor.component';

@Component({
  selector: 'app-ver-lista-profesores',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './ver-lista-profesores.component.html',
  styleUrl: './ver-lista-profesores.component.sass'
})
export class VerListaProfesoresComponent implements OnInit {
  selectedColor: string = '';
  profesores: Profesor[] = [];
  profesoresFiltrados: Profesor[] = [];
  terminoBusqueda: string = '';
  profesorSeleccionado: Profesor | null = null; 

  constructor(private colorService: SelectionColorService,private profesorService: ProfesorService,public dialog: MatDialog) {}
  
  ngOnInit(): void {
    this.getProfesores();
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
  
  getProfesores() {
    this.profesorService.getProfesores().subscribe(
      (data: Profesor[]) => {
        this.profesores = data;
        this.profesoresFiltrados=data;
        console.log('profesores:',this.profesores);
      },
      (error) => {
        console.error('Error al obtener los profesores:', error);
      }
    );
  }
  editarProfesor(profesor: Profesor) {
    const dialogRef = this.dialog.open(FormEditarProfesorComponent, {
      width: '300px',
      data: profesor
    });

    dialogRef.afterClosed().subscribe((result: Profesor | undefined) => {
      if (result) {
        this.actualizarProfesor(result.id_profesor, result);
      }
    });
  }
  
  actualizarProfesor(id: number, profesorData: Partial<Profesor>) {
    this.profesorService.updateProfesor(id, profesorData).subscribe(
      (updatedProfesor) => {
        console.log('Profesor actualizado:', updatedProfesor);
        this.getProfesores();
      },
      (error) => {
        console.error('Error al actualizar el profesor:', error);
      }
    );
  }
  filtrarProfesores(): void {
    const termino = this.terminoBusqueda.toLowerCase(); 
    this.profesoresFiltrados = this.profesores.filter(profesor =>
      profesor.nombre.toLowerCase().includes(termino) ||
      profesor.apellido.toLowerCase().includes(termino) 
    );
  }
  guardarCambios() {
    if (this.profesorSeleccionado) {
      this.profesorService.updateProfesor(this.profesorSeleccionado.id_profesor, this.profesorSeleccionado).subscribe(
        (updatedProfesor) => {
          console.log('Profesor actualizado:', updatedProfesor);
          this.getProfesores(); 
          this.profesorSeleccionado = null; 
        },
        (error) => {
          console.error('Error al actualizar el profesor:', error);
        }
      );
    }
  }
  cancelarEdicion() {
    this.profesorSeleccionado = null;
  }
  crearProfesor() {
    const nuevoProfesor: Profesor = { id_profesor: 0, nombre: ' ', apellido: ' ', email: ' '};
    const dialogRef = this.dialog.open(FormCrearProfesorComponent, {
      width: '300px',
      data: nuevoProfesor
    });

    dialogRef.afterClosed().subscribe((result: Profesor | undefined) => {
      if (result) {
        this.profesorService.addProfesor(result).subscribe(
          () => this.getProfesores(),
          (error) => console.error('Error al añadir el profesor:', error)
        );
      }
    });
  }
  eliminarProfesor(id: number): void {
    console.log(`Eliminar profesor con ID: ${id}`);
    if (confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
      this.profesorService.deleteProfesor(id).subscribe({
        next: () => {
          console.log('Profesor eliminado con exito.');
          this.getProfesores();
        },
        error: (error) => {
          console.error('Error al eliminar el profesor:', error);
        },
      });
    }
  }
  
  
}
