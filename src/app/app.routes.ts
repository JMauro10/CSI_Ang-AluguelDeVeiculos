import { Routes } from '@angular/router';
import {ClienteFormularioComponent} from './componentes/cliente-formulario/cliente-formulario.component';
import {VeiculoFormularioComponent} from './componentes/veiculo-formulario/veiculo-formulario.component';

export const routes: Routes = [
  {path: 'cliente-formulario', component: ClienteFormularioComponent},
  {path: 'veiculo-formulario', component: VeiculoFormularioComponent},
];
