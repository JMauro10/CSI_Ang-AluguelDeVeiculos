import { Component } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Menubar} from 'primeng/menubar';
import {Cliente} from '../../models/cliente';
import {Panel} from 'primeng/panel';
import {FloatLabel} from 'primeng/floatlabel';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Button, ButtonDirective} from 'primeng/button';
import {ClienteService} from '../../services/cliente.service';
import {TableModule} from 'primeng/table';
import {Veiculo} from '../../models/veiculo';
import {Dialog} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {SelectButton} from 'primeng/selectbutton';


@Component({
  selector: 'app-cliente-formulario',
  imports: [
    Menubar,
    Panel,
    FloatLabel,
    FormsModule,
    InputText,
    Button,
    ButtonDirective,
    TableModule,
    Dialog,
    DropdownModule,
    ReactiveFormsModule
  ],
  templateUrl: './cliente-formulario.component.html',
  styleUrl: './cliente-formulario.component.css'
})
export class ClienteFormularioComponent {

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
  novoCliente: Cliente = {id: 0, nome: '', cpf: ''};
  listarClientes: Cliente[] = [];

  constructor(private clienteService: ClienteService, private fb: FormBuilder) {
    this.clienteService.listarCliente().subscribe(cliente => this.listarClientes = cliente);
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
    });

    if (this.novoCliente) {
      this.form.patchValue({
        id: this.novoCliente.id,
        modelo: this.novoCliente.nome,
        tipo: this.novoCliente.cpf
      });
    }
  }


  adicionarCliente() {
    if(!this.novoCliente.nome.trim()){
      alert('O nome é obrigatório!');
      return;
    }
    if(!this.novoCliente.cpf.trim()){
      alert('O CPF é obrigatório!');
      return;
    }
    console.log('Dados do formulário antes do envio:', this.novoCliente);

    this.clienteService.incluirCliente(this.novoCliente).subscribe({
      next: (cliente) => {
        console.log('Cliente cadastrado com sucesso!');
        alert('Cliente cadastrado com sucesso!');
        this.atualizarListaClientes(); // Atualiza a lista após o cadastro bem-sucedido
        // Aqui você reseta o objeto para limpar o formulário
        this.novoCliente = {
          nome: '',
          cpf: '',
        };
      },
      error: (erro) => {
        if (erro.status === 400 || erro.status === 409) {
          alert(erro.error?.message || 'Já existe um cliente com esse nome!');
        } else {
          alert('Erro inesperado ao cadastrar cliente.');
        }
      }
    });
  }

  atualizarListaClientes(): void {
    this.clienteService.listarCliente().subscribe(clientes => {
      this.listarClientes = clientes;
    });
  }

  removerCliente(cliente: Cliente) {
    if (cliente.id === undefined) {
      alert("ID do cliente não encontrado. Não é possível remover.");
      return;
    }

    if (confirm(`Tem certeza que deseja remover o cliente "${cliente.nome}"?`)) {
      this.clienteService.deletarClienteById(cliente.id).subscribe({
        next: () => {
          // Remove da lista localmente após sucesso:
          this.listarClientes = this.listarClientes.filter(g => g.id !== cliente.id);
          alert('Cliente removido com sucesso!');
        },
        error: () => {
          alert('Ocorreu um erro ao tentar remover o cliente.');
        }
      });
    }
  }

  editarCliente(cliente: Cliente) {
    this.novoCliente = cliente;
    this.exibeModalEdicao = true;

    // Garante que o form foi criado antes de preencher
    setTimeout(() => {
      if (this.form) {
        console.log('Patch com:', this.novoCliente);
        this.form.patchValue(this.novoCliente);
      }
    });
  }


  salvarEdicao() {
    if (this.form.invalid) {
      return;
    }
    const clienteEditado: Cliente = this.form.value;
    this.clienteService.atualizarCliente(clienteEditado).subscribe({
      next: (clienteAtualizado) => {
        // Atualiza somente o item na lista local
        const idx = this.listarClientes.findIndex(g => g.id === clienteAtualizado.id);
        if (idx !== -1) {
          this.listarClientes[idx] = clienteAtualizado;
          // Caso o Angular não detecte a mudança, force a renderização:
          this.listarClientes = [...this.listarClientes];
        }
        this.exibeModalEdicao = false;
        alert('Cliente atualizado com sucesso!');
      },
      error: (erro) => {
        if (erro.status === 409) {
          alert(erro.error?.message || 'Já existe um cliente com esse nome!');
        } else {
          alert('Erro inesperado ao editar cliente.');
        }
      }
    });
  }



}
