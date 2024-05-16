import { BehaviorSubject } from "rxjs";
import { IUser } from "../models/user.models";
import { inject } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";


export class UsersService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly _users$ = new BehaviorSubject<IUser[]>([]);
  private readonly USERS_STORAGE_KEY = 'users';

  public readonly users$ = this._users$.asObservable();

  get users(): IUser[] {
    return this._users$.getValue();
  }

  set users(data: IUser[]) {
    this.localStorageService.setItem(this.USERS_STORAGE_KEY, data);
    this._users$.next(data);
  }
}
