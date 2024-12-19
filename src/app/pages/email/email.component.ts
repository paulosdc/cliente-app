import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Email } from '../../model/Email';
import { Categoria } from '../../model/Categoria';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { CategoriaService } from '../service/categoria.service';

@Component({
  selector: 'app-email',
  standalone: true,
  templateUrl: './email.component.html',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatOptionModule, 
    MatSelectModule, 
    MatOptionModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule,
    MatTableModule,
    FormsModule
  ]
})
export class EmailComponent implements OnInit {
  emailsForm: FormGroup;
  categorias: Categoria[] = [];
  showAddCategoria: boolean = false;
  novaCategoria: { nome: string } = { nome: '' };
  displayedColumns: string[] = ['nome', 'acoes'];
  nomeError: string = '';

  constructor(
    public dialogRef: MatDialogRef<EmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
  ) {
    this.categorias = data.categorias || [];

    const emailsData = Array.isArray(data.emails)
      ? data.emails
      : data.emails?.controls?.map((control: any) => control.value) || [];

    this.emailsForm = this.fb.group({
      emails: this.fb.array(
        emailsData.map((email: any) =>
          this.fb.group({
            nome: [email?.nome || '', Validators.required],
            email: [email?.email || '', [Validators.required, Validators.email]],
            categoria: [email?.categoria?.id || 0, Validators.required],
          })
        )
      ),
    });
  }

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
        alert('Erro ao carregar categorias. Tente novamente mais tarde.');
      },
    });
  }

  get emails(): FormArray {
    return this.emailsForm.get('emails') as FormArray;
  }

  addEmail(): void {
    this.emails.push(
      this.fb.group({
        nome: [''],
        email: [''],
        categoria: [0]
      })
    );
  }

  removeEmail(index: number): void {
    this.emails.removeAt(index);
  }

  close(): void {
    if (this.emailsForm.invalid) {
      alert('Por favor, corrija os campos inválidos antes de fechar o modal.');
      return;
    }
  
    const processedEmails = this.emails.value.map((email: any) => ({
      ...email,
      categoria: Number(email.categoria),
    }));
    this.dialogRef.close(processedEmails);
  }
  
  getErrorMessage(controlName: string, index: number): string {
    const control = (this.emails.at(index) as FormGroup).get(controlName);
    if (control?.hasError('required')) {
      return 'Campo obrigatório.';
    }
    if (control?.hasError('email')) {
      return 'Formato de email inválido.';
    }
    return '';
  }   

  toggleAddCategoria(): void {
    this.showAddCategoria = !this.showAddCategoria;
  }
  
  adicionarCategoria(): void {
    if (this.novaCategoria.nome.trim()) {
      const novaCategoria = new Categoria(this.novaCategoria.nome);
      this.categoriaService.criarCategoria(novaCategoria).subscribe({
        next: (categoriaCriada) => {
          this.carregarCategorias();
          this.novaCategoria.nome = '';
        },
        error: (err) => {
          if (err.status === 400 || err.status === 404) {
            alert('Erro ao criar categoria. Verifique os dados e tente novamente.');
          } else {
            console.error('Erro inesperado:', err);
            alert('Ocorreu um erro inesperado. Tente novamente mais tarde.');
          }
        },
      });
    } else {
      alert('O nome da categoria não pode estar vazio.');
    }
  }

  salvarCategoria(categoria: Categoria): void {
    this.categoriaService.atualizarCategoria(categoria).subscribe({
      next: () => {
        alert('Categoria atualizada com sucesso!');
        this.carregarCategorias();
      },
      error: (err) => {
        console.error('Erro ao atualizar categoria:', err);
        alert('Erro ao atualizar categoria. Tente novamente mais tarde.');
      },
    });
  }

  excluirCategoria(id: number): void {
    if (confirm('Tem certeza de que deseja excluir esta categoria?')) {
      this.categoriaService.deletarCategoria(id).subscribe({
        next: () => {
          this.categorias = this.categorias.filter((cat) => cat.id !== id);
          this.carregarCategorias();
        },
        error: (err) => {
          console.error('Erro ao excluir categoria:', err);
          alert('Não é possível excluir categorias com emails associados!');
        },
      });
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
}