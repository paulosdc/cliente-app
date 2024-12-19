import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../service/cliente.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EmailComponent } from '../email/email.component';
import { CategoriaService } from '../service/categoria.service';
import { Categoria } from '../../model/Categoria';
import { of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cliente',
  standalone: true,
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  imports: [
    MatCardModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    CommonModule, 
    MatIconModule, 
    MatOptionModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule
  ]
})
export class ClienteComponent implements OnInit {
  clienteForm: FormGroup;
  clienteId: number = +this.route.snapshot.paramMap.get('id')!;
  isModalOpen = false;
  categoriasDisponiveis: Categoria[] = [];
  inscricaoError: string = '';
  nomeError: string = '';

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
      "inscricao": ['', [Validators.required]],
      "nome": ['', Validators.required],
      "apelido": ['', Validators.required],
      "urlFoto": ['', Validators.required],
      "status": ['', Validators.required],
      "emails": this.fb.array([])
    });
  }

  formatCpfCnpj(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
  
    if (value.length > 14) {
      value = value.slice(0, 14);
      this.inscricaoError = 'Inscrição pode ter no máximo 14 números.';
    } else {
      this.inscricaoError = '';
    }
  
    if (value.length <= 11) {
      input.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (match, p1, p2, p3, p4) =>
        p4 ? `${p1}.${p2}.${p3}-${p4}` : `${p1}.${p2}.${p3}`
      );
    } else {
      input.value = value.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/,
        (match, p1, p2, p3, p4, p5) =>
          p5 ? `${p1}.${p2}.${p3}/${p4}-${p5}` : `${p1}.${p2}.${p3}/${p4}`
      );
    }
  }

  validateNome(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
  
    const regex = /^[a-zA-ZÀ-ÿ\s]*$/;
  
    if (!regex.test(value)) {
      this.nomeError = 'O nome deve conter apenas letras e espaços.';
      input.value = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    } else {
      this.nomeError = '';
    }
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
  
  criarCliente(): void {
    this.clienteService.criarCliente(this.clienteForm.value).subscribe({
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
  }

  saveCliente(): void {
    if (this.clienteForm.valid) {
      if(!this.clienteForm.value.id || this.clienteForm.value.id == 0) return this.criarCliente();

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
          this.dialog.open(EmailComponent, {
            width: '600px',
            data: { 
              emails: this.clienteForm.get('emails'),
              categorias: this.categoriasDisponiveis
            },
            disableClose: true
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
