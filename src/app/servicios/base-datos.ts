
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection
} from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class BaseDatos {

  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;

  private inicializacion: Promise<void> | null = null;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async inicializar(): Promise<void> {

    if (this.db) {
      return;
    }

    if (this.inicializacion) {
      return this.inicializacion;
    }

    this.inicializacion = this.crearBaseDatos();

    try {
      await this.inicializacion;
    } catch (error) {
      this.inicializacion = null;
      throw error;
    }
  }

  private async crearBaseDatos(): Promise<void> {

    if (Capacitor.getPlatform() === 'web') {

      await customElements.whenDefined('jeep-sqlite');

      const jeepSqlite = document.querySelector('jeep-sqlite');

      if (!jeepSqlite) {
        throw new Error(
          'No se encontró el componente jeep-sqlite'
        );
      }

      await (jeepSqlite as any).componentOnReady();

      await this.sqlite.initWebStore();
    }

    const conexion = await this.sqlite.createConnection(
      'citas_famosas',
      false,
      'no-encryption',
      1,
      false
    );

    await conexion.open();

    await conexion.execute(`
      CREATE TABLE IF NOT EXISTS citas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        texto TEXT NOT NULL,
        autor TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS configuracion_bd (
        clave TEXT PRIMARY KEY,
        valor TEXT NOT NULL
      );
    `);

    // Para instalaciones que ya tienen citas guardadas,
    // registrar que la carga inicial fue realizada.
    const resultado = await conexion.query(
      'SELECT COUNT(*) AS total FROM citas'
    );

    const total = Number(resultado.values?.[0]?.total ?? 0);

    if (total > 0) {
      await conexion.run(
        `INSERT OR IGNORE INTO configuracion_bd (clave, valor)
         VALUES (?, ?)`,
        ['citas_inicializadas', 'true']
      );
    }

    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.saveToStore('citas_famosas');
    }

    this.db = conexion;

    console.log('Base de datos SQLite inicializada');
  }

  obtenerConexion(): SQLiteDBConnection {

    if (!this.db) {
      throw new Error(
        'La base de datos todavía no está inicializada'
      );
    }

    return this.db;
  }

  async guardarCambios(): Promise<void> {

    await this.inicializar();

    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.saveToStore('citas_famosas');
    }
  }
}
