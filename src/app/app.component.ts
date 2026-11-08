
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit
} from '@angular/core';

import {
  IonApp,
  IonRouterOutlet
} from '@ionic/angular';

import { BaseDatos } from './servicios/base-datos';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp,
    IonRouterOutlet
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit {

  constructor(private baseDatos: BaseDatos) {}

  async ngOnInit() {
    try {
      await this.baseDatos.inicializar();

      console.log(
        'SQLite inicializado correctamente'
      );

    } catch (error) {
      console.error(
        'Error al inicializar SQLite:',
        error
      );
    }
  }
}
