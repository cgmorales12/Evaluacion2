import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { EventosComponent } from './components/eventos/eventos';
import { ParticipantesComponent } from './components/participantes/participantes';
import { InscripcionesComponent } from './components/inscripciones/inscripciones';
import { CitasComponent } from './components/citas/citas';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'participantes', component: ParticipantesComponent },
  { path: 'inscripciones', component: InscripcionesComponent },
  { path: 'citas', component: CitasComponent }
];