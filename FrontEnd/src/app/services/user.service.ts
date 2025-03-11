import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      tap(users => this.usersSubject.next(users))
    );
  }

  resetBalances(): void {
    const users = this.usersSubject.value;
    const updatedUsers = users.map(user => ({
      ...user,
      balance: '0.00'
    }));
    this.usersSubject.next(updatedUsers);
  }

  searchUsers(searchTerm: string): void {
    const users = this.usersSubject.value;
    if (!searchTerm.trim()) {
      this.getUsers().subscribe();
      return;
    }

    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.usersSubject.next(filteredUsers);
  }
}
