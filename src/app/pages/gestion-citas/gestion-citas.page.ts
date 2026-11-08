
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonList
} from '@ionic/angular';

import { Citas, Cita } from '../../servicios/citas';
import { CitaComponent } from '../../componentes/cita/cita.component';
import { ConfiguracionService } from '../../servicios/configuracion';

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.page.html',
  styleUrls: ['./gestion-citas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonList,
    CitaComponent
  ]
})
export class GestionCitasPage {

  listaCitas = signal<Cita[]>([]);
  nuevaFrase: string = '';
  nuevoAutor: string = '';
  permitirEliminar = signal(false);

  constructor(
    private citasService: Citas,
    private router: Router,
    private configuracionService: ConfiguracionService
  ) {}

  async ionViewWillEnter() {
    await this.cargarCitas();
    await this.cargarConfiguracion();
  }

  volverInicio() {
    this.router.navigateByUrl('/home');
  }

  async cargarCitas() {
    try {
      const citas = await this.citasService.obtenerCitas();
      this.listaCitas.set(citas);
    } catch (error) {
      console.error('Error al cargar las citas:', error);
    }
  }

  async cargarConfiguracion() {
    try {
      const valor =
        await this.configuracionService.obtenerPermitirEliminar();

      this.permitirEliminar.set(valor);

    } catch (error) {
      console.error('Error al cargar configuración:', error);
      this.permitirEliminar.set(false);
    }
  }

  async agregarCita() {
    const frase = this.nuevaFrase.trim();
    const autor = this.nuevoAutor.trim();

    if (frase.length < 5 || autor.length < 2) {
      alert(
        'La frase debe tener al menos 5 caracteres y el autor al menos 2.'
      );
      return;
    }

    try {
      await this.citasService.agregarCita(frase, autor);

      this.nuevaFrase = '';
      this.nuevoAutor = '';

      await this.cargarCitas();

    } catch (error) {
      console.error('Error al agregar cita:', error);
      alert('No se pudo guardar la cita.');
    }
  }

  async eliminarCita(id: number) {
    await this.cargarConfiguracion();

    if (!this.permitirEliminar()) {
      alert(
        'La eliminación de citas está desactivada en Configuración.'
      );
      return;
    }

    const confirmar = confirm(
      '¿Estás seguro de que deseas eliminar esta cita?'
    );

    if (!confirmar) {
      return;
    }

    try {
      await this.citasService.eliminarCita(id);
      await this.cargarCitas();

    } catch (error) {
      console.error('Error al eliminar cita:', error);
      alert('No se pudo eliminar la cita.');
    }
  }
}
