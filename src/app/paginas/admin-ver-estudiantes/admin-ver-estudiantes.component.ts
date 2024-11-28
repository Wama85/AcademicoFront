import { Component, OnInit ,inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {EstudiantesAdminService} from '../../servicios/estudiantes-admin.service'
import {Estudiante} from'../../interfaces/estudiante'
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ParaleloService } from '../../servicios/paralelo.service';
import {Paralelo} from '../../interfaces/paralelo';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import {MensajeService} from '../mensaje/mensaje.component'
import { SelectionColorService } from '../../servicios/selection-color.service';
@Component({
  selector: 'app-admin-ver-estudiantes',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './admin-ver-estudiantes.component.html',
  styleUrl: './admin-ver-estudiantes.component.sass'
})
export class AdminVerEstudiantesComponent implements OnInit {
  selectedColor: string = '';
  estudiantes: Estudiante[] = [];
  mostrarFormulario = false;
  editando = false;
  estudiante: Estudiante = {
    id_estudiante: 0,
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    paralelo: { nombre:'', id:0, paralelo:''}, 
    foto: ''
  };
  paraleloInput: string = '';
  paralelos:Paralelo[]=[];
  paraleloSelec?:Paralelo;
  password?:string;
  filtroNombre:string = "";
  filtroapellido: string = "";

  constructor(
    private colorService: SelectionColorService,
    private estudiantesService: EstudiantesAdminService,
    private paraleloService: ParaleloService,
    private mensajeService:MensajeService
  ) {}

  ngOnInit(): void {
    this.obtenerEstudiantes();
    this.obtenerParalelos();
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
  
  obtenerParalelos(){
    this.paraleloService.getParalelo().subscribe(
      (data) => {this.paralelos = data
        this.paraleloSelec= this.paralelos[0]
      },
      (error) => console.error('Error al obtener estudiantes:', error)
    );
  }

  obtenerEstudiantes(): void {
    this.estudiantesService.obtenerListaEstudiantes().subscribe(
      (data) => (this.estudiantes = data),
      (error) => console.error('Error al obtener estudiantes:', error)
    );
  }

  actualizarParalelo(event:any){
    console.log(event.target)

    console.log(event.target.value)
    this.paraleloSelec=this.paralelos.find(paralelo=>paralelo.paralelo==event.target.value)
    console.log(this.paraleloSelec)

    // para

  }
  abrirFormulario(): void {
    this.mostrarFormulario = true;

    this.editando = false;
    this.estudiante = { id_estudiante: 0, nombre: '', apellido: '', email: '', password: '',   paralelo: { nombre:'', id:0, paralelo:''}, foto: '../../../assets/img/avatar3.png' };

    // Obtener el último ID y generar el nuevo ID
    // this.estudiantesService.obtenerUltimoEstudiante().subscribe(
    //   (ultimoEstudiante) => {
    //     const nuevoId = ultimoEstudiante ? ultimoEstudiante.id_estudiante + 1 : 1;
    //     this.estudiante.id_estudiante = nuevoId;
    //   },
    //   (error) => console.error('Error al obtener el último estudiante:', error)
    // );
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }

  generarEmailYPassword(): void {
    if(this.editando){
      return;
    }
    if (this.estudiante.nombre && this.estudiante.apellido) {
      const nombreLower = this.estudiante.nombre.toLowerCase();
      const apellidoLower = this.estudiante.apellido.toLowerCase();
      this.estudiante.email = `${nombreLower}.${apellidoLower}@example.com`;
      this.estudiante.password = 'password123';
    }
  }

guardarEstudiante(): void {

  // Verificar si paraleloInput tiene un valor
  if (
    !this.estudiante.nombre &&
    !this.estudiante.apellido &&
    !this.estudiante.email &&
    !this.estudiante.password 
  ) {
    // console.error("El campo paralelo está vacío");
    this.mostrarFormulario=false;
    this.mensajeService.mostrarMensajeError("Error!!!","Complete todos los campos")
    return;
  }

  // Obtener el ID del paralelo por el nombre proporcionado en paraleloInput

        this.estudiante.paralelo=this.paraleloSelec ;
        if (this.editando) {
          if(this.estudiante.password==""){
            delete this.estudiante.password
          }
          // Actualizar estudiante
          this.estudiantesService.actualizarEstudiante(this.estudiante.id_estudiante, this.estudiante).subscribe(
            () => {
              console.log("Estudiante actualizado correctamente");
              this.obtenerEstudiantes();
              this.cerrarFormulario();
              this.mensajeService.mostrarMensajeExito("Exito!!!","Estudiante editado correctamente")
              
             
            },
            (error) => {
              console.error('Error al actualizar estudiante:', error);
              this.mensajeService.mostrarMensajeError("Error!!!","No se edito al estudiante")
            }
          );
        } else {
          // Agregar nuevo estudiante
          this.estudiantesService.addEstudiante(this.estudiante).subscribe(
            () => {
              this.obtenerEstudiantes();
              this.cerrarFormulario();
              this.mensajeService.mostrarMensajeExito("Exito!!!","Estudiante agregado correctamente")
            },
            (error) => {console.error('Error al agregar estudiante:', error)
              this.mensajeService.mostrarMensajeError("Error!!!","No se agrego al estudiante")

            }
          );
        }
}

  

  editarEstudiante(id: number): void {
    this.estudiantesService.obtenerEstudiantePorId(id).subscribe(
      (data) => {
        this.estudiante = data;
        // this.paraleloInput = data.paralelo?.paralelo || '';
        // this.password="";
        this.paraleloSelec=this.estudiante.paralelo;
        this.estudiante.password="";
        this.mostrarFormulario = true;
        this.editando = true;
        console.log(this.paraleloSelec)
      },
      (error) => console.error('Error al obtener estudiante:', error)
    );
  }

  get estudiantesFiltrados(): Estudiante[]{
    return this.estudiantes.filter(estudiante =>
    (this.filtroNombre? estudiante.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()):true) &&
    (this.filtroapellido? estudiante.apellido.toLowerCase().includes(this.filtroapellido.toLowerCase()):true)
  
  )
  }

}
