import {TipoVeiculo} from './TipoVeiculo';

export interface Veiculo {
   id?: number;
   modelo: string;
   tipo: TipoVeiculo | undefined;
   disponivel: boolean;
 }
