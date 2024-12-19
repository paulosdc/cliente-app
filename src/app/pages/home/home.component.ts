import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../model/Cliente';
import { ClienteService } from '../../service/cliente.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    MatCardModule, 
    MatTableModule, 
    MatIconModule, 
    MatButtonModule, 
    MatSelectModule, 
    MatFormFieldModule, 
    CommonModule
  ]
})
export class HomeComponent implements OnInit {
  clientes: Cliente[] = [];
  displayedColumns: string[] = ['inscricao', 'nome', 'apelido', 'status', 'acoes'];
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  pageSizes: number[] = [5, 10, 15, 20];

  constructor(private clienteService: ClienteService, private router: Router) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getClientes(this.currentPage, this.pageSize).subscribe((response: any) => {
      this.clientes = response.content;
      this.totalPages = response.totalPages;
    });
  }

  desativarCliente(cliente: Cliente): void {
    this.clienteService.desativarCliente(cliente).subscribe(
      (message) => {
        alert(message);
        this.loadClientes();
      },
      (error) => {
        this.loadClientes();
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

  editarCliente(clienteId: number): void {
    this.router.navigate(['/cliente', clienteId]);
  }

  criarCliente(): void {
    this.router.navigate(['/cliente']);
  }

  updatePageSize(event: any): void {
    this.pageSize = event.value;
    this.currentPage = 0;
    this.loadClientes();
  }
}
