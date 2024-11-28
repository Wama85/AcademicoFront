import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Storage, ref, uploadBytesResumable, getDownloadURL, percentage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Material } from "../../../../interfaces/material";
import { MaterialService } from "../../../../servicios/material.service";
import { ActivatedRoute } from '@angular/router';
import { MensajeService } from '../../../mensaje/mensaje.component';
import { SelectionColorService } from '../../../../servicios/selection-color.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export default class HomeComponent implements OnInit, OnDestroy {
  selectedColor: string = '';
  progress = '0%';
  downloadURL: string | undefined;
  file!: File;
  private readonly _storage = inject(Storage);
  subscription: Subscription | undefined;
  mensajeSubidaArchivo: string = "";

  tipoMaterial: string = 'Teorico';
  nombreMaterial: string = '';
  currentMaterialId: number | null = null;

  showForm: boolean = false;
  materiales: Material[] = [];

  servicioMateriales: MaterialService = inject(MaterialService);
  id_unidad?: number;
  route: ActivatedRoute = inject(ActivatedRoute);
  mensajeService: MensajeService = inject(MensajeService);

  constructor(private colorService: SelectionColorService) {
    this.id_unidad = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.servicioMateriales.getMaterialesDeUnidad(this.id_unidad).subscribe(
      response => {
        console.log('Datos recibidos:', response);
        this.materiales = response;
      },
      error => {
        console.error('Error en la petición GET:', error);
      }
    );

    this.colorService.currentColor$.subscribe(color => {
      this.selectedColor = color;
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

  changeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      if (this.file.type !== 'application/pdf') {
        this.mensajeService.mostrarMensajeError("ERROR!!", "Error Formato Invalido, solo se debe subir PDFs");
        return;
      }
      this.uploadFile();
    }
  }

  uploadFile() {
    const storageRef = ref(this._storage, `uploads/${this.file.name}`);
    const task = uploadBytesResumable(storageRef, this.file);

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = percentage(task).subscribe(
      async ({ progress }) => {
        this.progress = `${progress}%`;
        if (progress === 100) {
          this.downloadURL = await getDownloadURL(storageRef);
          console.log('Download URL:', this.downloadURL);
          this.mensajeSubidaArchivo = "¡Archivo agregado correctamente!";
        }
      }
    );
  }

  confirm() {
    const newMaterial: Material = {
      id_material: this.currentMaterialId !== null ? this.currentMaterialId : this.materiales.length + 1,
      tipo: this.tipoMaterial,
      nombre: this.nombreMaterial,
      url: this.downloadURL,
      id_unidad: this.id_unidad,
    };

    if (this.currentMaterialId !== null) {
      this.servicioMateriales.actualizarMaterial(this.currentMaterialId, newMaterial).subscribe(
        response => {
          const index = this.materiales.findIndex(mat => mat.id_material === this.currentMaterialId);
          if (index !== -1) {
            console.log(this.downloadURL);
            console.log(response);
            this.materiales[index] = response;
            this.mensajeService.mostrarMensajeExito("ACTUALIZACION EXITOSA!!", "Se actualizo correctamente el material");
          }
          this.resetForm();
        },
        error => {
          console.error('Error al actualizar el material:', error);
        }
      );
    } else {
      this.servicioMateriales.guardadMaterial(newMaterial).subscribe(
        idMaterial => {
          console.log('Material guardado con ID:', idMaterial);
          this.servicioMateriales.encontrarMaterial(idMaterial).subscribe(
            (material: Material) => {
              this.materiales.push(material);
              this.mensajeService.mostrarMensajeExito("SUBIDA DE ARCHIVO EXITOSA!!", "Se subio el archivo correctamente");
              this.resetForm();
            }
          );
        },
        error => {
          console.error('Error al guardar el material:', error);
        }
      );
    }

    this.showForm = false;
    this.downloadURL = '';
  }

  cancel() {
    this.resetForm();
    this.showForm = false;
  }

  toggleForm(material?: Material) {
    this.mensajeSubidaArchivo = "";
    this.showForm = !this.showForm;

    if (material) {
      this.currentMaterialId = material.id_material || null;
      this.tipoMaterial = material.tipo;
      this.nombreMaterial = material.nombre;
      this.downloadURL = material.url;
    } else {
      this.resetForm();
    }
  }

  goToMaterial(material: Material) {
    window.open('/api' + material.url, '_blank');
  }

  resetForm() {
    this.nombreMaterial = '';
    this.tipoMaterial = 'Teorico';
    this.downloadURL = undefined;
    this.progress = '0%';
    this.currentMaterialId = null;
  }

  eliminarMaterial(id: number | undefined) {
    if (id !== undefined) {
      this.servicioMateriales.eliminarMaterial(id).subscribe(
        () => {
          this.materiales = this.materiales.filter(material => material.id_material !== id);
          console.log('Material eliminado');
        },
        error => {
          console.error('Error al eliminar el material:', error);
        }
      );
    } else {
      console.error('ID de material es undefined');
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
