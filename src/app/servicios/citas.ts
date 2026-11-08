
import { Injectable } from '@angular/core';
import { BaseDatos } from './base-datos';

export interface Cita {
  id: number;
  texto: string;
  autor: string;
}

@Injectable({
  providedIn: 'root'
})
export class Citas {

  constructor(private baseDatos: BaseDatos) {}

  // Obtener todas las citas desde SQLite
  async obtenerCitas(): Promise<Cita[]> {

    await this.baseDatos.inicializar();

    const db = this.baseDatos.obtenerConexion();

    const resultado = await db.query(
      'SELECT id, texto, autor FROM citas ORDER BY id'
    );

    return (resultado.values || []) as Cita[];
  }

  // Obtener una cita aleatoria desde SQLite
  async obtenerCitaAleatoria(): Promise<Cita | undefined> {

    await this.baseDatos.inicializar();

    const db = this.baseDatos.obtenerConexion();

    const resultado = await db.query(
      'SELECT id, texto, autor FROM citas ORDER BY RANDOM() LIMIT 1'
    );

    return resultado.values?.[0] as Cita | undefined;
  }

  // Agregar una nueva cita
  async agregarCita(texto: string, autor: string): Promise<void> {

    const frase = texto.trim();
    const nombreAutor = autor.trim();

    if (frase.length < 5 || nombreAutor.length < 2) {
      throw new Error(
        'La frase debe tener al menos 5 caracteres y el autor al menos 2.'
      );
    }

    await this.baseDatos.inicializar();

    const db = this.baseDatos.obtenerConexion();

    await db.run(
      'INSERT INTO citas (texto, autor) VALUES (?, ?)',
      [frase, nombreAutor]
    );

    await this.baseDatos.guardarCambios();
  }

  // Eliminar una cita por su ID
  async eliminarCita(id: number): Promise<void> {

    await this.baseDatos.inicializar();

    const db = this.baseDatos.obtenerConexion();

    await db.run(
      'DELETE FROM citas WHERE id = ?',
      [id]
    );

    await this.baseDatos.guardarCambios();
  }

  // Insertar las citas originales solamente una vez
  async cargarCitasIniciales(): Promise<void> {

    await this.baseDatos.inicializar();

    const db = this.baseDatos.obtenerConexion();

    // Verificar si ya se realizó la carga inicial
    const resultado = await db.query(
      `SELECT valor FROM configuracion_bd
       WHERE clave = ?`,
      ['citas_inicializadas']
    );

    // Si ya fueron cargadas, no insertarlas nuevamente
    if (resultado.values && resultado.values.length > 0) {
      return;
    }

    // Citas originales de la aplicación
    const citasIniciales = [
      ['El tiempo sin ti... Es empo', 'Charly Badulaque'],
      ['¿Me puedo dar un lujo?', 'Profesor Rossa'],
      ['Mi mamá me los compró', 'Paul Vásquez']
    ];

    // Guardar las citas originales en SQLite
    for (const [texto, autor] of citasIniciales) {

      await db.run(
        'INSERT INTO citas (texto, autor) VALUES (?, ?)',
        [texto, autor]
      );
    }

    // Registrar que las citas iniciales ya fueron cargadas
    await db.run(
      `INSERT INTO configuracion_bd (clave, valor)
       VALUES (?, ?)`,
      ['citas_inicializadas', 'true']
    );

    // Guardar los cambios permanentemente
    await this.baseDatos.guardarCambios();

    console.log('Citas iniciales registradas correctamente');
  }
}
