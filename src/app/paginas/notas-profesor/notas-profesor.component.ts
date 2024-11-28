import {ChangeDetectionStrategy, Component,inject, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MateriasProfesorService} from '../../servicios/materias-profesor.service';
import {Materia} from '../../interfaces/materia';
import {MateriaAsignadaDocente} from '../../interfaces/materia-asignada-docente';
import {RouterModule} from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { CommonModule } from '@angular/common';
import { SelectionColorService } from '../../servicios/selection-color.service';
@Component({
  selector: 'app-notas-profesor',
  standalone: true,
  imports: [MatCardModule, MatButtonModule,RouterModule, CommonModule],
  templateUrl: './notas-profesor.component.html',
  styleUrl: './notas-profesor.component.sass'
})
export class NotasProfesorComponent implements OnInit {
  selectedColor: string = '';
  servicioMateriasProfesor:MateriasProfesorService=inject(MateriasProfesorService);
  materias:MateriaAsignadaDocente[]=[];
  materiasFiltradas:MateriaAsignadaDocente[]=[];

  authService: AuthService = inject(AuthService);

  constructor(
    private colorService: SelectionColorService,
  ) {}
  
  ngOnInit(): void {
    const idProfesor = this.authService.getUserId();
     this.servicioMateriasProfesor.obtenerMaterias().subscribe(
       response => {
         console.log('Datos recibidos:', response);
         this.materias = response.filter(materia => materia.profesor?.id_profesor === idProfesor); // Asigna los datos cuando la respuesta es recibida
        //  this.materias = response.filter(materia => materia.profesor?.id_profesor === idProfesor); // Asigna los datos cuando la respuesta es recibida
         console.log('Materias asignadas:', this.materias);
         this.materiasFiltradas=this.materias;
         this.filtrarMateriasAnio();
         this.filtrarAnios()
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
  
  anios:string[]=[];
  selectedYear: number = 2024;
  filtrarMateriasAnio(){
    this.materias=this.materiasFiltradas.filter((materia:MateriaAsignadaDocente)=>
      materia.anio===this.selectedYear
    )
  }
  filtrarAnios(){
    this.anios=[...new Set(this.materiasFiltradas.map((materia)=>materia.anio.toString()))]
    console.log(this.anios)
  }
  
  onYearChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedYear = +selectElement.value;
    console.log(this.selectedYear)
    this.filtrarMateriasAnio()
    console.log(this.materias)
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
}
