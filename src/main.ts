
import { bootstrapApplication } from '@angular/platform-browser';

import {
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';

import {
  IonicRouteStrategy,
  provideIonicAngular
} from '@ionic/angular';

import { defineCustomElements } from 'jeep-sqlite/loader';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Registrar el componente web necesario para SQLite
defineCustomElements(window);

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    provideIonicAngular(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding()
    ),
  ],
}).catch(error => console.error(error));
