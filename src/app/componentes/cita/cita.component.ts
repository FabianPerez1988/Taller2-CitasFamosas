
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonItem,
  IonLabel,
  IonButton
} from '@ionic/angular';

import { Cita } from '../../servicios/citas';

@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonItem,
    IonLabel,
    IonButton
  ]
})
export class CitaComponent {

  @Input({ required: true })
  cita!: Cita;

  @Input()
  permitirEliminar: boolean = false;

  @Output()
  solicitarEliminar = new EventEmitter<number>();

  eliminar() {
    this.solicitarEliminar.emit(this.cita.id);
  }
}
