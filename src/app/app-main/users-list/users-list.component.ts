import { Observable } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { UsersApiService } from '../../shared/services/users-api.service';
import { UsersService } from '../../shared/services/users.service';
import { IUser } from '../../shared/models/user.models';
import { UserCardComponent } from '../user-card/user-card.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateEditUserComponent } from '../../shared/components/create-edit-user/create-edit-user.component';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import {MatButton} from "@angular/material/button";


@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, UserCardComponent, NgFor, MatButton],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {
  private dialogRef!: MatDialogRef<CreateEditUserComponent>;

  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UsersService);
  private readonly usersApiService = inject(UsersApiService);
  private readonly localStorageService = inject(LocalStorageService);

  public readonly users$: Observable<IUser[]> = this.userService.users$;

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    const usersOfStorage = this.localStorageService.getItem('users');

    if (usersOfStorage && usersOfStorage.length !== 0) {
      this.userService.users = usersOfStorage;
    } else {
      this.usersApiService.getUsers().subscribe((usersOfApi: IUser[]) => {
        this.userService.users = usersOfApi;
        this.localStorageService.setItem('users', usersOfApi);
      });
    }
  }

  public openDialog(user?: IUser): void {
    this.dialogRef = this.dialog.open(CreateEditUserComponent, { data: user });

    this.dialogRef.afterOpened().subscribe(() => {
      if (user) {
        this.dialogRef.componentInstance.isEdit = true;
        this.dialogRef.componentInstance.formnameControl.patchValue(user);
      } else this.dialogRef.componentInstance.isEdit = false;
    });

    this.dialogRef.afterClosed().subscribe(() => {
      if (this.dialogRef.componentInstance.isEdit && user && this.dialogRef.componentInstance.formnameControl.valid) {
        this.editUser(user);
      } else if (this.dialogRef.componentInstance.formnameControl.valid) {
        this.addUser(this.dialogRef.componentInstance.formnameControl.value);
      }
    });
  }

  private addUser(user: IUser): void {
    const newUsers: IUser[] = [...this.userService.users, {...user, id: new Date().getTime()}];
    this.userService.users = newUsers;
  }

  public deleteUser(id: number): void {
    const newUsers: IUser[] = this.userService.users.filter(user => user.id !== id)
    this.userService.users = newUsers;
  }

   private editUser(user: IUser): void {
    const newUser: IUser = {...user, ...this.dialogRef.componentInstance.formnameControl.value};
    const newUsers: IUser[] = this.userService.users.map((user: IUser) => user.id !== newUser.id ? user : newUser);
    this.userService.users = newUsers;
  }
}
