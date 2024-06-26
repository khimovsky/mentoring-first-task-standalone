import { Observable } from "rxjs";
import { IUser } from "../models/user.models";
import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";

export class UsersApiService {
  private readonly usersUrl: string = 'https://jsonplaceholder.typicode.com/users';
  private readonly http: HttpClient = inject(HttpClient);

  public getUsers(): Observable<IUser[]>{
    return this.http.get<IUser[]>(this.usersUrl);
  }
}

