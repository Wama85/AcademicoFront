import { Component } from '@angular/core';
import {MateriaService} from '../../servicios/materia.service';
import {Materia} from '../../interfaces/materia';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MensajeService } from '../mensaje/mensaje.component';
import {FormularioAgregarMateriaComponent} from '../formulario-agregar-materia/formulario-agregar-materia.component';
import {ParaleloService} from '../../servicios/paralelo.service';
import {Paralelo} from '../../interfaces/paralelo'
import type { Profesor } from '../../interfaces/profesor';
import {MateriasProfesorService} from '../../servicios/materias-profesor.service'
import { Estudiante } from '../../interfaces/estudiante';
import { SelectionColorService } from '../../servicios/selection-color.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-materias-administrador',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './materias-administrador.component.html',
  styleUrl: './materias-administrador.component.sass'
})
export class MateriasAdministradorComponent {
  selectedColor: string = '';
  materias:Materia[]=[];
  paralelos:Paralelo[]=[];
  searchTerm: string = '';
  profesores:Profesor[]=[];
  estudiantes:Estudiante[]=[];

  constructor(
    private colorService: SelectionColorService,
    private servicioMaterias: MateriaService,
    private dialog: MatDialog,
    private mensajeService: MensajeService,
    private paraleloService: ParaleloService,
    // private profesorService: ProfesorService,
    private materiasProfesorService: MateriasProfesorService,
    // private estudiantesAdminService: EstudiantesAdminService,
    // private inscripcionService: InscripcionService
  ){
    servicioMaterias.getMaterias().subscribe(
      response=>{
        this.materias=response;
        let materiasProfesores:any=[];
        // this.materiasProfesorService.obtenerMaterias().subscribe(
        //   response=>{
        //     // materiasProfesores=response;
        //     // this.materias.forEach(materia=>{
        //     //   let materiaAsignada=materiasProfesores.find((materiaProfesor:any)=>materiaProfesor.materia.id_materia=== materia.id_materia);
        //     //   materia.profesorAsignado=materiaAsignada?.profesor;
        //     //   materia.id=materiaAsignada?.id_dicta
        //     // })

            console.log("resp-mats",response)
        //   },
        //   error=>{
        //     console.log(error)
        //   }
        // )

        // console.log(response)
      },
      error=>{
        console.log(error)
      }
    )
    paraleloService.getParalelo().subscribe(
      response=>{
        this.paralelos=response;
        console.log("resp",response)
      },
      error=>{
        console.log(error)
      }
    )
    // profesorService.getProfesores().subscribe(
    //   response=>{
    //     this.profesores=response;
    //     console.log("resp",response)
    //   },
    //   error=>{
    //     console.log(error)
    //   }
    // )

    // this.estudiantesAdminService.obtenerListaEstudiantes().subscribe(
    //   response => {
    //     this.estudiantes = response; // Asegúrate de que `response` contenga estudiantes válidos
    //     console.log('Lista de estudiantes cargada:', this.estudiantes);
    //   },
    //   error => {
    //     console.error('Error al cargar estudiantes:', error);
    //   }
    // );

  }

  addNewMateria() {
    const dialogRef = this.dialog.open(FormularioAgregarMateriaComponent, {
      width: '300px',
      data: 
      { name: '', paralelos: this.paralelos }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        let materia:Materia={
          id:0,
          id_materia:0,
          nombre:result.name,
          paralelo:result.paralelo,
          area:"ciencias",
          id_paralelo:result.paralelo.id_paralelo,
          profesorAsignado:undefined
        }
        this.servicioMaterias.postMateria(materia).subscribe(
          response=>{
            console.log("resp",response)
            materia.id_materia=response.id_materia
            materia.id=response.id_materia
            this.materias.push(materia)
            this.mensajeService.mostrarMensajeExito("Exito!!","Se agrego correctamente la materia.");
          },
          error=>{
            console.log(error);
            this.mensajeService.mostrarMensajeError("Error!!","Ocurrio un problema al agregar la materia.");

          }
        )
      }
    });

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

  // asignarProfesor(materiaSeleccionada:Materia) {
  //   console.log(materiaSeleccionada);
  //   const dialogRef = this.dialog.open(FormularioAsignarMateriaDocenteComponent, {
  //     width: '320px',
  //     data: 
  //     { fecha: new Date().toISOString(), profesores:this.profesores}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       let materiaAsignada:any={
  //         id_dicta:0,
  //         materia:materiaSeleccionada,
  //         profesor:result.profesor,
  //         fecha:result.fecha.split("T")[0]

  //       }
  //       console.log(materiaAsignada);
  //       this.materiasProfesorService.agregarMateriaAsignada(materiaAsignada).subscribe(
  //         response=>{
  //           console.log("resp",response)
  //           let indice=this.materias.findIndex(materia=>materia.id_materia===response.materia?.id_materia)
  //           this.materias[indice].profesorAsignado=response.profesor;
  //           this.materias[indice].id=response.id_dicta;

  //         },
  //         error=>{
  //           console.log(error)
  //         }
  //       )

  //     }
  //   });

  // }


  // asignarEstudiante(materia:any) {

  //   let dialogRef = null;

  //   let id_dicta: number=materia.id
  //   if(!id_dicta){
  //     this.mensajeService.mostrarMensajeError(
  //       'Error',
  //       'Debe asignar un docente a la materia para asignar estudiantes.'
  //     );
  //     return;
  //   }
  //   console.log("materia",materia)
  //   console.log('Estudiantes enviados al formulario:', this.estudiantes);
  //   console.log('ID de la materia asignada:', id_dicta);
  //   if (this.estudiantes && this.estudiantes.length > 0) {
      
  //     dialogRef = this.dialog.open(FormularioAsignarMateriaEstudianteComponent, {
  //       width: '500px',
  //       data: {
  //         estudiantes: this.estudiantes, 
  //         id_dicta: id_dicta, 
  //       },
  //     });
  //   } else {
  //     console.error('No hay estudiantes disponibles');
  //   }
  
  //   // Aquí solo se ejecuta después de que dialogRef se haya definido
  //   if (dialogRef) {
  //     dialogRef.afterClosed().subscribe((result) => {
  //       if(result.estudiantesSeleccionados.length==0){
  //         this.mensajeService.mostrarMensajeError(
  //           'Error',
  //           'Debe asignar al menos un estudiante.'
  //         );
  //         return;
  //       }
  //       if (result && result.estudiantesSeleccionados.length > 0) {
  //         console.log('Estudiantes seleccionados para asignar:', result);
  
  //         const fechaInscripcion = result.fechaInscripcion;
  
  //         const asignaciones = result.estudiantesSeleccionados.map((estudiante: Estudiante) => ({
  //           id_dicta,
  //           id_estudiante: estudiante.id_estudiante,
  //           fecha_inscripcion: fechaInscripcion.toISOString().split("T")[0],
  //           anio: new Date(fechaInscripcion).getFullYear(),
  //         }));
          
  //         // return;
  //         // Llamar al servicio para asignar los estudiantes
  //         // this.inscripcionService.asignarEstudiantes(asignaciones).subscribe(
  //         //   (response) => {
  //         //     console.log('Estudiantes asignados con éxito:', response);
  //         //     this.mensajeService.mostrarMensajeExito(
  //         //       'Asignación Exitosa',
  //         //       'Los estudiantes se asignaron correctamente a la materia.'
  //         //     );
  //         //   },
  //         //   (error) => {
  //         //     console.error('Error al asignar estudiantes:', error);
  //         //     this.mensajeService.mostrarMensajeError(
  //         //       'Error',
  //         //       'Hubo un problema al asignar los estudiantes. Intenta de nuevo.'
  //         //     );
  //         //   }
  //         // );
  //       }
  //     });
  //   }
  // }
  
  

  
  get filteredMaterias(): Materia[] {
    return this.materias.filter(materia =>
      materia.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }





}
