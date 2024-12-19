import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../service/cliente.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EmailComponenet } from '../email/email.component';
import { CategoriaService } from '../service/categoria.service';
import { Categoria } from '../../model/Categoria';
import { of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-cliente',
  standalone: true,
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  imports: [MatCardModule, ReactiveFormsModule, MatDialogModule, CommonModule, MatIconModule, MatOptionModule, MatFormFieldModule, MatInputModule, MatSelectModule]
})
export class ClienteComponent implements OnInit {
  clienteForm: FormGroup;
  clienteId: number = +this.route.snapshot.paramMap.get('id')!;
  isModalOpen = false;
  categoriasDisponiveis: Categoria[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private categoriaService: CategoriaService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.clienteForm = this.fb.group({
      "id": 0,
      "inscricao": [''],
      "nome": [''],
      "apelido": [''],
      "urlFoto": [''],
      "status": [''],
      "emails": this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.clienteService.getClienteById(this.clienteId).subscribe(cliente => {
      this.clienteForm.patchValue(cliente);
      cliente.emails.forEach(email => this.addEmail(email));
    });
  }

  get emails(): FormArray {
    return this.clienteForm.get('emails') as FormArray;
  }

  addEmail(email?: any): void {
    const emailGroup = this.fb.group({
      id: [email ? email.id : 0],
      nome: [email ? email.nome : ''],
      email: [email ? email.email : ''],
      categoria: [email ? email.categoria : '']
    });
    this.emails.push(emailGroup);
  }

  removeEmail(index: number): void {
    this.emails.removeAt(index);
  }

  saveCliente(): void {
    if (this.clienteForm.valid) {
      this.clienteForm.value.id = this.clienteId;
  
      this.clienteService.updateCliente(this.clienteId, this.clienteForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          if (err.status === 400 || err.status === 404) {
          } else {
            console.error('Erro inesperado:', err);
            alert('Ocorreu um erro inesperado. Tente novamente mais tarde.');
          }
        }
      });
    } else {
      alert('Por favor, corrija os erros no formulário antes de salvar.');
    }
  }
  

  desativarCliente(): void {
    this.clienteService.getClienteById(this.clienteId).subscribe(cliente => {
      this.clienteService.desativarCliente(cliente).subscribe(() => {
        alert('Cliente excluído com sucesso!');
        this.router.navigate(['/']);
      });
    });
  }

  loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias) => {
        this.categoriasDisponiveis = categorias;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
      },
    });
  }

  openModal(): void {
    this.categoriaService.getCategorias().pipe(
      switchMap((categorias) => {
        this.categoriasDisponiveis = categorias;
  
        return of(
          this.dialog.open(EmailComponenet, {
            width: '600px',
            data: { 
              emails: this.clienteForm.get('emails'),
              categorias: this.categoriasDisponiveis
            }
          })
        );
      }),
      catchError((err) => {
        console.error('Erro ao carregar categorias:', err);
        return of(null);
      })
    ).subscribe((dialogRef) => {
      if (dialogRef) {
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.clienteForm.setControl('emails', this.fb.array(result));
          }
        });
      }
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  voltarParaLista(): void {
    this.router.navigate(['/']);
  }
}
