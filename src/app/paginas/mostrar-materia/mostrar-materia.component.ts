import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MateriaAsignadaDocente } from '../../interfaces/materia-asignada-docente';
import { MateriasProfesorService } from '../../servicios/materias-profesor.service';
import {InscripcionService} from '../../servicios/inscripcion.service';
import {AuthService} from '../../servicios/auth.service';
import { SelectionColorService } from '../../servicios/selection-color.service';

@Component({
  selector: 'app-mostrar-materia',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './mostrar-materia.component.html',
  styleUrls: ['./mostrar-materia.component.sass'] 
})
export class MostrarMateriaComponent implements OnInit {
  selectedColor: string = '';
  servicioMateriasProfesor:MateriasProfesorService=inject(MateriasProfesorService);
  servicioInscripcion:InscripcionService=inject(InscripcionService);
  servicioAutenticacion:AuthService=inject(AuthService);

  constructor(
    private colorService: SelectionColorService,
  ) {}

  materias:MateriaAsignadaDocente[]=[];
  materiaAsignada: any;
  searchTerm: string = '';


  ngOnInit(): void {
    this.servicioInscripcion.obtenerMaterias(this.servicioAutenticacion.getUserId()).subscribe(
      (response: MateriaAsignadaDocente[]) => {
        console.log('Datos recibidos:', response);
        this.materias = response; // Asigna los datos cuando la respuesta es recibida
      },
      error => {
        console.error('Error en la petición GET:', error);
      }
    );
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
  
  get filteredMaterias(): MateriaAsignadaDocente[] {
    return this.materias.filter(materia =>
      materia.materia?.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }



}
