
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  private readonly clave = 'permitirEliminar';

  constructor() {}

  // Recupera la preferencia guardada.
  async obtenerPermitirEliminar(): Promise<boolean> {
    const resultado = await Preferences.get({
      key: this.clave
    });

    // Si no existe una preferencia, se permite eliminar.
    return resultado.value === null
      ? true
      : resultado.value === 'true';
  }

  // Guarda la preferencia seleccionada por el usuario.
  async guardarPermitirEliminar(valor: boolean): Promise<void> {
    await Preferences.set({
      key: this.clave,
      value: String(valor)
    });
  }
}
