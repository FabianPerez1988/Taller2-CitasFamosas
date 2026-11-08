
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/angular';

import { Citas, Cita } from '../servicios/citas';
import { ConfiguracionService } from '../servicios/configuracion';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    RouterLink
  ],
})
export class HomePage {

  citaActual = signal<Cita | undefined>(undefined);
  cargando = signal(true);
  permitirEliminar = signal(false);

  constructor(
    private citasService: Citas,
    private configuracionService: ConfiguracionService
  ) {}

  async ionViewWillEnter() {
    await this.cargarConfiguracion();
    await this.cargarCita();
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

  async cargarCita() {
    this.cargando.set(true);

    try {
      await this.citasService.cargarCitasIniciales();

      const cita =
        await this.citasService.obtenerCitaAleatoria();

      this.citaActual.set(cita);

    } catch (error) {
      console.error('Error al cargar la cita:', error);
      this.citaActual.set(undefined);

    } finally {
      this.cargando.set(false);
    }
  }

  async cambiarCita() {
    await this.cargarCita();
  }

  async eliminarCitaActual() {

    const cita = this.citaActual();

    if (!cita || this.cargando()) {
      return;
    }

    await this.cargarConfiguracion();

    if (!this.permitirEliminar()) {
      alert('La eliminación de citas está desactivada.');
      return;
    }

    const confirmar = confirm(
      '¿Estás seguro de que deseas eliminar esta cita?'
    );

    if (!confirmar) {
      return;
    }

    this.cargando.set(true);

    try {
      await this.citasService.eliminarCita(cita.id);

      this.citaActual.set(undefined);

      await this.cargarCita();

    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      alert('No se pudo eliminar la cita.');

    } finally {
      this.cargando.set(false);
    }
  }
}
