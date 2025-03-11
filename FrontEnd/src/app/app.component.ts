import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './components/users/users.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UsersComponent, HttpClientModule],
  template: '<app-users></app-users>'
})
export class AppComponent { }
