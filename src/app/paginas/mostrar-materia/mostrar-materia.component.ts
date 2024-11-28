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
  materiasFiltradas:MateriaAsignadaDocente[]=[];

  
  materiaAsignada: any;
  searchTerm: string = '';
  
  anios:string[]=[];
  selectedYear?: number ;
  filtrarMateriasAnio(){

    this.materiasFiltradas=this.materias.filter((materia:MateriaAsignadaDocente)=>
      materia.anio===this.selectedYear
    )
  }
  filtrarAnios(){
    this.anios=[...new Set(this.materias.map((materia)=>materia.anio.toString()))]
    console.log(this.anios)
  }
  
  onYearChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedYear = +selectElement.value;
    // this.materiasFiltradasAnio=this.materias;
    // this.filtrarMateriasAnio()
    // this.filtrarAnios();
    this.actualizar();
  }
  actualizar(){
    this.servicioInscripcion.obtenerMaterias(this.servicioAutenticacion.getUserId()).subscribe(
      (response: MateriaAsignadaDocente[]) => {
        console.log('Datos recibidos:', response);
        this.materias = response; // Asigna los datos cuando la respuesta es recibida
        this.materiasFiltradas=this.materias;
        this.filtrarAnios()
        if(!this.selectedYear){
          this.selectedYear=+this.anios[0];
        }
        this.filtrarMateriasAnio()
      },
      error => {
        console.error('Error en la petición GET:', error);
      }
    );
  }

  ngOnInit(): void {
    this.actualizar();
    // this.selectedYear=+this.anios[0];

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
  
  filtrarMaterias() {

    // this.materias=this.materiasFiltradasAnio;
    console.log("hola")
    this.filtrarMateriasAnio();
    this.materiasFiltradas=this.materiasFiltradas.filter(materia =>
      materia.materia?.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }



}
