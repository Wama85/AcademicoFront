import { Component, OnInit , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PerfilEstudianteService } from '../../servicios/perfil-estudiante.service';
import { Estudiante } from '../../interfaces/estudiante';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MensajeService } from '../mensaje/mensaje.component';
import { SelectionColorService } from '../../servicios/selection-color.service';

import * as bcrypt from 'bcryptjs';


@Component({
  selector: 'app-perfil-estudiante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './perfil-estudiante.component.html',
  styleUrls: ['./perfil-estudiante.component.sass']


})
export class PerfilEstudianteComponent implements OnInit {
  selectedColor: string = '';
  estudiantes: Estudiante[] = [];
  estudianteSeleccionado: Estudiante | null = null;
  idEstudiante: number | null = null;
  estudianteForm: FormGroup;
  imagenSeleccionada: File | null = null;
  imagenURL: string | null = null;


  constructor(
    private colorService: SelectionColorService,
    private perfilEstudianteService: PerfilEstudianteService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private mensajeService: MensajeService

  ) {
    this.estudianteForm = this.fb.group({
      foto: [],
      nombre: [{ value: '', disabled: true }],
      apellido: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      currentPassword: [''],
      newPassword: [''],
      repeatNewPassword: ['']
    },
    { validators: this.passwordsMatchValidator });
  }
  passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const repeatNewPassword = form.get('repeatNewPassword')?.value;
    return newPassword === repeatNewPassword ? null : { mismatch: true };
  }

  selectAvatar(avatar: string): void {
    this.imagenURL = avatar;
    this.estudianteForm.patchValue({ foto: avatar });
    if (this.idEstudiante) {
      localStorage.setItem(`foto_${this.idEstudiante}`, avatar);
    }
  }

  ngOnInit(): void {
    this.colorService.currentColor$.subscribe(color => {
      this.selectedColor = color; // Actualiza el color recibido
      console.log('Color recibido en Login:', this.selectedColor);
    });
    this.obtenerIdEstudiante();

    if (this.idEstudiante) {
      const storedImage = localStorage.getItem(`foto_${this.idEstudiante}`);
      if (storedImage) {
        this.imagenURL = storedImage; // Usar la URL almacenada
        this.estudianteForm.patchValue({ foto: storedImage });
      }



    }
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

  obtenerIdEstudiante(): void {
    this.route.paramMap.subscribe(params => {
      this.idEstudiante = +params.get('id')!;
      console.log('ID del estudiante:', this.idEstudiante);
      this.obtenerDetallesEstudiante();
    });
  }

  obtenerDetallesEstudiante(): void {
    if (this.idEstudiante) {
      this.perfilEstudianteService.obtenerEstudiantePorId(this.idEstudiante).subscribe({
        next: (data: Estudiante) => {
          this.estudianteSeleccionado = data;
          this.establecerVarloresFormulario(data);
          this.imagenURL = data.foto || '../../../assets/img/silueta.png';
        },
        error: (error) => {
          console.error('Error al obtener el estudiante:', error);
        }
      });
    }
  }
establecerVarloresFormulario(data: Estudiante): void{
  this.estudianteForm.patchValue({
    nombre:data.nombre,
    apellido:data.apellido,
    email:data.email

  });
}

async onGuardar(): Promise<void> {
  if (this.estudianteForm.valid && this.idEstudiante && this.estudianteSeleccionado) {
    const estudianteEditado = { ...this.estudianteForm.value };
    const currentPassword = estudianteEditado.currentPassword;
    const newPassword = estudianteEditado.newPassword;
    const repeatNewPassword = estudianteEditado.repeatNewPassword;

    console.log("Contraseña actual ingresada:", currentPassword);
    console.log("Contraseña en la base de datos:", this.estudianteSeleccionado.password);

    // Validar contraseña actual antes de cualquier otro cambio
    if (this.estudianteSeleccionado.password) {
      const passwordCorrecta = await bcrypt.compare(currentPassword, this.estudianteSeleccionado.password);

      if (!passwordCorrecta && currentPassword!="") {
        this.mensajeService.mostrarMensajeError("¡Error!", "La contraseña actual es incorrecta.");
        return; // Detener el proceso si la contraseña es incorrecta
      }
    } else {
      console.error("No se encontró la contraseña en estudianteSeleccionado.");
      return;
    }

    // Si los campos de nueva contraseña están vacíos, omitir el cambio de contraseña
    if (!newPassword && !repeatNewPassword) {
      delete estudianteEditado.password; // No modificar la contraseña
    } else {
      // Validar que las nuevas contraseñas coincidan
      if (newPassword !== repeatNewPassword) {
        this.mensajeService.mostrarMensajeError("¡Error!", "Las nuevas contraseñas no coinciden.");
        return;
      }

      // Validar longitud mínima de la nueva contraseña
      if (newPassword.length < 8) {
        this.mensajeService.mostrarMensajeError("¡Error!", "La nueva contraseña debe tener al menos 8 caracteres.");
        return;
      }

      // Encriptar la nueva contraseña antes de guardar
      const salt = await bcrypt.genSalt(10);
      estudianteEditado.password = await bcrypt.hash(newPassword, salt);
    }

    // Actualizar el estudiante en el servicio si todas las validaciones pasan
    // location.reload();
    this.perfilEstudianteService.actualizarEstudiante(this.idEstudiante, estudianteEditado).subscribe({
      next: (response) => {
        console.log('Estudiante actualizado:', response);
        this.mensajeService.mostrarMensajeExitoConCallback('¡Éxito!', "Los cambios se realizaron exitosamente").then((result) => {
          if (result.isConfirmed) {
            location.reload(); 
          }
        });;
    
      },
      error: (error) => {
        console.error('Error al actualizar el estudiante:', error);
        this.mensajeService.mostrarMensajeError("¡Error!", "Algo ha ocurrido");
      }
    });
  }
}















}
