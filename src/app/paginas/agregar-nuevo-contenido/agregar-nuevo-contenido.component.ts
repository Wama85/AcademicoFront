import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormularioAgregarContenidoComponent } from '../formulario-agregar-contenido/formulario-agregar-contenido.component';
import { FormularioEditarContenidoComponent } from '../formulario-editar-contenido/formulario-editar-contenido.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Unidad } from '../../interfaces/unidad';
import { UnidadService } from '../../servicios/unidad.service';
import { MateriasProfesorService } from '../../servicios/materias-profesor.service';
import { MateriaAsignadaDocente } from '../../interfaces/materia-asignada-docente';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MensajeService } from '../mensaje/mensaje.component';
import { SelectionColorService } from '../../servicios/selection-color.service';

@Component({
  selector: 'app-agregar-nuevo-contenido',
  standalone: true,
  templateUrl: './agregar-nuevo-contenido.component.html',
  styleUrls: ['./agregar-nuevo-contenido.component.sass'],
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    RouterLink,
  ]
})
export class AgregarNuevoContenidoComponent implements OnInit {
  selectedColor: string = '';
  cardCounter = 1;
  unidades: Unidad[] = [];
  showForm = false;
  newModuleName = '';
  newModuleImageUrl = '';
  materiaAsignada?: MateriaAsignadaDocente;
  messages: any[] = [];
  id_dicta: number;
  unidadServicio: UnidadService = inject(UnidadService);
  materiaAsignadaServicio: MateriasProfesorService = inject(MateriasProfesorService);
  route: ActivatedRoute = inject(ActivatedRoute);

  constructor(
    private colorService: SelectionColorService,
    private dialog: MatDialog,
    private router: Router,
    private mensajeService: MensajeService
  ) {
    this.id_dicta = this.route.snapshot.params['id_dicta'];
  }

  ngOnInit(): void {
    this.colorService.currentColor$.subscribe(color => {
      this.selectedColor = color;
      console.log('Color recibido:', this.selectedColor);
    });

    this.materiaAsignadaServicio.obtenerMateriaAsignada(this.id_dicta).subscribe(
      response => {
        console.log('Datos recibidos:', response);
        this.materiaAsignada = response;
        console.log('Materia:', this.materiaAsignada);
      },
      error => {
        console.error('Error en la petición GET:', error);
      }
    );

    this.unidadServicio.getUnidadesDeMateriAsignada(this.id_dicta).subscribe(
      response => {
        console.log('Datos recibidos:', response);
        this.unidades = response;
        console.log('Unidades:', this.unidades);
      },
      error => {
        console.error('Error en la petición GET:', error);
      }
    );
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

  addNewModule() {
    const dialogRef = this.dialog.open(FormularioAgregarContenidoComponent, {
      width: '300px',
      data: { name: '', imageUrl: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let nuevaUnidad: Unidad = {
          id_dicta: this.id_dicta,
          nombre: result.name || `Nuevo Contenido ${this.cardCounter}`,
          trimestre: '1er',
          imagen_url: result.imageUrl || 'default-image-url.jpg',
          descripcion: undefined,
          imagen: undefined
        };
        this.mensajeService.mostrarMensajeExito("¡Éxito!", 'Se ha agregado con éxito un nuevo contenido');
        console.log(nuevaUnidad);
        this.unidadServicio.guardarUnidadDeMateriAsignada(nuevaUnidad).subscribe(
          response => {
            console.log('Respuesta:', response);
            nuevaUnidad.id_unidad = response;
            this.unidades.push(nuevaUnidad);
            this.cardCounter++;
            this.resetForm();
          },
          error => {
            console.error('Error:', error);
            this.mensajeService.mostrarMensajeError('¡Error!', 'Algo ha pasado');
          }
        );
      }
    });
  }

  editCard(id?: number) {
    const cardToEdit = this.unidades.find(card => card.id_unidad === id);
    if (!cardToEdit) return;

    const dialogRef = this.dialog.open(FormularioEditarContenidoComponent, {
      width: '300px',
      data: {
        name: cardToEdit.nombre,
        imageUrl: cardToEdit.imagen_url
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.unidades.findIndex(card => card.id_unidad === id);
        if (index !== -1) {
          let unidad: Unidad = this.unidades[index];
          unidad.imagen_url = result.imageUrl;
          unidad.nombre = result.name;
          this.unidadServicio.editarUnidad(unidad.id_unidad || 0, unidad).subscribe(
            response => {
              this.mensajeService.mostrarMensajeExito("¡Éxito!", 'Se ha editado con éxito el contenido');
              console.log(response);
            },
            error => {
              console.error('Error:', error);
              this.mensajeService.mostrarMensajeError('¡Error!', 'Algo ha pasado');
            }
          );
        }
      }
    });
  }

  deleteCard(id?: number) {
    this.unidadServicio.eliminarUnidad(id || 0).subscribe(
      response => {
        this.unidades = this.unidades.filter(card => card.id_unidad !== id);
        if (this.unidades.length === 0) {
          this.cardCounter = 1;
        }
        this.mensajeService.mostrarMensajeExito("¡Éxito!", 'Se eliminó el contenido con éxito');
        console.log(response);
      },
      error => {
        console.error('Error:', error);
        this.mensajeService.mostrarMensajeError('¡Error!', 'Algo ha pasado');
      }
    );
  }

  dirigirAContenido(id?: number) {
    this.router.navigate(['/home/agregar-material-docente', id]);
  }

  cancel() {
    this.showForm = false;
    this.resetForm();
  }

  private resetForm() {
    this.newModuleName = '';
    this.newModuleImageUrl = '';
  }
}
