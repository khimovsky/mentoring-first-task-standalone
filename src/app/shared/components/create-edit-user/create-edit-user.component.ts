import { Component, OnInit, inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-create-edit-user',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './create-edit-user.component.html',
  styleUrl: './create-edit-user.component.scss'
})
export class CreateEditUserComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CreateEditUserComponent>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly data = inject(MAT_DIALOG_DATA);

  public readonly formControlBuilder: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.pattern(/^.+/)]],
    email: ['', [Validators.required, Validators.pattern(/^.+/)]],
    phone: ['', [Validators.required, Validators.pattern(/^.+/)]]
  });
  public isEdit: boolean = false;

  ngOnInit(): void {
    if (this.data) {
      this.isEdit = true;
      this.formControlBuilder.patchValue(this.data);
    } else {
      this.isEdit = false;
    }
  }

  public createEditUser(): void {
    this.formControlBuilder.valid
      ? this.dialogRef.close(false)
      : alert('Введите корректные данные!');
  }
}

