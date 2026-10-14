import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { DetalleComponent } from './pages/detalle/detalle.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { CrudComponent } from './pages/crud/crud.component';

/** Rutas de la aplicación: cada página HTML de la Entrega 2 es ahora un componente. */
export const routes: Routes = [
  { path: '',            component: HomeComponent,      title: 'El Caleño | Tu periódico digital del Valle del Cauca' },
  { path: 'noticias',    component: NoticiasComponent,  title: 'Noticias | El Caleño' },
  { path: 'noticia/:id', component: DetalleComponent,   title: 'Detalle de noticia | El Caleño' },
  { path: 'favoritos',   component: FavoritosComponent, title: 'Mis Favoritos | El Caleño' },
  { path: 'contacto',    component: ContactoComponent,  title: 'Contacto | El Caleño' },
  { path: 'redaccion',   component: CrudComponent,      title: 'Redacción | El Caleño' },
  { path: '**', redirectTo: '' },
];
