import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Email } from '../../model/Email';
import { Categoria } from '../../model/Categoria';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-email',
  standalone: true,
  templateUrl: './email.component.html',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatOptionModule]
})
export class EmailComponenet {
  emailsForm: FormGroup;
  categorias: Categoria[] = [];

  constructor(
    public dialogRef: MatDialogRef<EmailComponenet>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.categorias = data.categorias || [];

    const emailsData = Array.isArray(data.emails)
      ? data.emails
      : data.emails?.controls?.map((control: any) => control.value) || [];

    this.emailsForm = this.fb.group({
      emails: this.fb.array(
        emailsData.map((email: any) =>
          this.fb.group({
            nome: [email?.nome || ''],
            email: [email?.email || ''],
            categoria: [email?.categoria || 0],
          })
        )
      ),
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
    const processedEmails = this.emails.value.map((email: any) => ({
      ...email,
      categoria: Number(email.categoria), // Converte para número
    }));
    this.dialogRef.close(processedEmails);
  }  
}