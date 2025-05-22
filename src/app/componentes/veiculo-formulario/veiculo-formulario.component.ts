import { Component } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Menubar} from 'primeng/menubar';
import {Veiculo} from '../../models/veiculo';
import {Router} from '@angular/router';
import {VeiculoService} from '../../services/veiculo.service';
import {Panel} from 'primeng/panel';
import {FloatLabel} from 'primeng/floatlabel';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {TipoVeiculo} from '../../models/TipoVeiculo';
import {Button, ButtonDirective} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {SelectButton} from 'primeng/selectbutton';
import {BooleanToYesNoPipe} from './boolean-to-yes-no.pipe';

@Component({
  selector: 'app-veiculo-formulario',
  imports: [
    Menubar,
    Panel,
    FloatLabel,
    FormsModule,
    DropdownModule,
    Button,
    TableModule,
    Dialog,
    ReactiveFormsModule,
    ButtonDirective,
    InputText,
    SelectButton,
    BooleanToYesNoPipe
  ],
  templateUrl: './veiculo-formulario.component.html',
  styleUrl: './veiculo-formulario.component.css'
})
export class VeiculoFormularioComponent {


  items: MenuItem[] = [
    {
      label: 'Clientes',
      routerLink: '/cliente-formulario'
    },
    {
      label: 'Veiculos',
      routerLink: '/veiculo-formulario'
    },
    {
      label: 'Aluguar Veiculos',
      routerLink: '/aluguar-veiculos'
    }
  ];

  exibeModalEdicao: boolean = false;
  form!: FormGroup;
  novoVeiculo: Veiculo = {id: 0, modelo: '', tipo: undefined, disponivel: true};
  listarVeiculo: Veiculo[] = [];

  TiposVeiculo = [
    { label: 'Carro', value: TipoVeiculo.Carro },
    { label: 'Moto', value: TipoVeiculo.Moto }
  ];
  EstadoDisponibilidade = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false }
  ];



  constructor(private fb: FormBuilder, private router : Router, private veiculoService : VeiculoService) {
    this.veiculoService.listarVeiculo().subscribe(veiculo => this.listarVeiculo = veiculo);
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      modelo: ['', Validators.required],
      tipo: ['', Validators.required],       // Enum é tratado como string no formulário
      disponivel: [true, Validators.required]  // Booleano padrão
    });

    if (this.novoVeiculo) {
      this.form.patchValue({
        id: this.novoVeiculo.id,
        modelo: this.novoVeiculo.modelo,
        tipo: this.novoVeiculo.tipo,               // Deve bater com a string do enum
        disponivel: this.novoVeiculo.disponivel    // true ou false
      });
    }
  }


  incluirVeiculo(){
    if(!this.novoVeiculo.modelo.trim()){
      alert('O modelo é obrigatório!');
      return;
    }
    console.log('Dados do formulário antes do envio:', this.novoVeiculo);

    this.veiculoService.incluirVeiculo(this.novoVeiculo).subscribe({
      next: (veiculo) => {
        console.log('Veículo cadastrado com sucesso!');
        alert('Veículo cadastrado com sucesso!');
        this.atualizarListaVeiculos(); // Atualiza a lista após o cadastro bem-sucedido
        // Aqui você reseta o objeto para limpar o formulário
        this.novoVeiculo = {
          modelo: '',
          tipo: undefined,
          disponivel: true
        };
      },
      error: (erro) => {
        if (erro.status === 400 || erro.status === 409) {
          alert(erro.error?.message || 'Já existe um veículo cadastrado com esse nome!');
        } else {
          alert('Erro inesperado ao cadastrar o veículo.');
        }
      }
    });
  }

  atualizarListaVeiculos(): void {
    this.veiculoService.listarVeiculo().subscribe(veiculos => {
      this.listarVeiculo = veiculos;
    });
  }

  removerVeiculo(veiculo: Veiculo) {
    if (veiculo.id === undefined) {
      alert("ID do veículo não encontrado. Não é possível remover.");
      return;
    }

    if (confirm(`Tem certeza que deseja remover o veículo "${veiculo.modelo}"?`)) {
      this.veiculoService.deletarVeiculoById(veiculo.id).subscribe({
        next: () => {
          // Remove da lista localmente após sucesso:
          this.listarVeiculo = this.listarVeiculo.filter(g => g.id !== veiculo.id);
          alert('Veículo removido com sucesso!');
        },
        error: () => {
          alert('Ocorreu um erro ao tentar remover o veículo.');
        }
      });
    }
  }

  editarVeiculo(veiculo: Veiculo) {
    this.novoVeiculo = veiculo;
    this.exibeModalEdicao = true;

    // Garante que o form foi criado antes de preencher
    setTimeout(() => {
      if (this.form) {
        console.log('Patch com:', this.novoVeiculo);
        this.form.patchValue(this.novoVeiculo);
      }
    });
  }



  salvarEdicao() {
    if (this.form.invalid) {
      return;
    }
    const veiculoEditado: Veiculo = this.form.value;
    this.veiculoService.atualizarVeiculo(veiculoEditado).subscribe({
      next: (veiculoAtualizado) => {
        // Atualiza somente o item na lista local
        const idx = this.listarVeiculo.findIndex(g => g.id === veiculoAtualizado.id);
        if (idx !== -1) {
          this.listarVeiculo[idx] = veiculoAtualizado;
          // Caso o Angular não detecte a mudança, force a renderização:
          this.listarVeiculo = [...this.listarVeiculo];
        }
        this.exibeModalEdicao = false;
        alert('Veículo atualizado com sucesso!');
      },
      error: (erro) => {
        if (erro.status === 409) {
          alert(erro.error?.message || 'Já existe um veículo com esse modelo!');
        } else {
          alert('Erro inesperado ao editar veículo.');
        }
      }
    });
  }




}
