
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonToggle,
  IonButton
} from '@ionic/angular';

import { ConfiguracionService } from '../../servicios/configuracion';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonToggle,
    IonButton,
    CommonModule,
    FormsModule
  ],
})
export class ConfiguracionPage implements OnInit {

  permitirEliminar: boolean = true;
  configuracionCargada: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router,
    private configuracionService: ConfiguracionService
  ) {}

  volverInicio() {
    this.router.navigateByUrl('/home');
  }

  async ngOnInit() {
    try {
      const valor =
        await this.configuracionService.obtenerPermitirEliminar();

      this.zone.run(() => {
        this.permitirEliminar = valor;
        this.configuracionCargada = true;
        this.cd.detectChanges();
      });

    } catch (error) {
      console.error(
        'Error al cargar la configuración:',
        error
      );

      this.zone.run(() => {
        this.configuracionCargada = true;
        this.cd.detectChanges();
      });
    }
  }

  async guardarConfiguracion(valor: boolean) {

    this.permitirEliminar = valor;

    try {
      await this.configuracionService.guardarPermitirEliminar(valor);

      console.log(
        'Configuración guardada:',
        valor
      );

    } catch (error) {
      console.error(
        'Error al guardar la configuración:',
        error
      );
    }
  }
}
