import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../model/Cliente';
import { ClienteService } from '../service/cliente.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {
  clientes: Cliente[] = [];
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getClientes(this.currentPage, this.pageSize).subscribe((response: any) => {
      this.clientes = response.content;
      this.totalPages = response.totalPages;
    });
  }

  desativarCliente(cliente: Cliente) {
    this.clienteService.desativarCliente(cliente).subscribe(
      (message) => {
        alert(message);
        this.loadClientes();
      },
      (error) => {
        alert('Erro ao desativar cliente');
      }
    );
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadClientes();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadClientes();
    }
  }
}
