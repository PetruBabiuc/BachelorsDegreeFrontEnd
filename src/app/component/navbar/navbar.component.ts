import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];
  constructor() { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/home'
      },
      {
        label: 'Account',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Login',
            routerLink: '/login'
          },
          {
            label: 'Register',
            routerLink: '/register'
          }
        ]
      }
    ];
  }
}
