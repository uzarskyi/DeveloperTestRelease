import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService} from '../../services/user.service';
import { User } from '../../models/user.model';
import { map, Observable } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],

})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  searchTerm = '';

  constructor(private userService: UserService) {
    this.users$ = this.userService.users$.pipe(
      map((users: any) => {
        const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));

        if (!this.searchTerm) return sortedUsers;
        return sortedUsers.filter(user =>
          user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      })
    );
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe();
  }

  onSearch(): void {
    this.userService.searchUsers(this.searchTerm);
  }

  resetBalances(): void {
    this.userService.resetBalances();
  }

  formatToPounds(value: string): string {
    if (!value) return '';

    // Remove any commas and convert to a float
    const numericValue = parseFloat(value.replace(/,/g, ''));

    if (isNaN(numericValue)) {
      return '';
    }

    // Format as GBP currency with two decimal places
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue);
  }

  formatDateTime(value: string): string {
    if (!value) return '';

    // Match date and time parts using regex
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);

    if (!match) return 'Invalid date';

    const year = match[1];
    const month = match[2];
    const day = match[3];
    const hours = match[4];
    const minutes = match[5];
    const seconds = match[6];

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  getIconUrl(iconName: string): string {
    return this.userService.getIconUrl(iconName);
  }

}
