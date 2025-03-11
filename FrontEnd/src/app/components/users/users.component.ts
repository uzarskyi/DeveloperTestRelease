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

  formatDate(dateString: string): string {
    /*
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    */

    //const date = new Date(dateString);

    //const datePipe = new DatePipe('en-US');
    //const formattedDate = datePipe.transform(dateString, 'dd-MM-yyyy HH:mm:ss');

    /*const formattedDate = `${('0' + date.getDate())
      .slice(-2)}-${('0' + (date.getMonth() + 1))
        .slice(-2)}-${date.getFullYear()} ${('0' + date.getHours())
          .slice(-2)}:${('0' + date.getMinutes())
            .slice(-2)}:${('0' + date.getSeconds())
        .slice(-2)}`;*/
    //const formattedDate = `${('0' + date)}`;


    //const formattedDateString = formattedDate !== null ? formattedDate : 'N/A';







    const formattedDateString = 'dd-55-yyyy HH:mm:ss';
    return formattedDateString;

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

  formatUtcDateTime(value: string): string {
    if (!value) return '1';

    // Parse the input string into a Date object
    //const date = new Date(value);
    const date = new Date(Date.parse(value));

    if (isNaN(date.getTime())) {
      return '2';
    }

    // Format the date in UTC
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
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

}
