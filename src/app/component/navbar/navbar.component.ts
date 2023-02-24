import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Account } from 'src/app/model';
import { AccountService } from 'src/app/service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  items: MenuItem[];
  constructor(
    private accountService: AccountService,
  ) {
    this.items = this.getMenuItems(this.accountService.getCurrentAccount());

    this.accountService.getObservableAccount()
      .subscribe(account => this.items = this.getMenuItems(account));
  }

  private getMenuItems(account: Account | null): MenuItem[] {
    let menuItems = [this.getHomeMenuItem()];

    if (account !== null)
      menuItems = [...menuItems, this.getSongsMenuItem(account)];

    return [...menuItems, this.getAccountButton(account)];
  }

  private getHomeMenuItem(): MenuItem {
    return {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/home'
    };
  }

  private getAccountButton(account: Account | null): MenuItem {
    const accountMenuItem = {
      label: 'Account',
      icon: 'pi pi-user',
      items: new Array<MenuItem>()
    };

    if (account === null)
      accountMenuItem.items = [
        {
          label: 'Login',
          icon: 'pi pi-sign-in',
          routerLink: '/login'
        },
        {
          label: 'Register',
          icon: 'pi pi-user-plus',
          routerLink: '/register'
        }
      ];
    else
      accountMenuItem.items = [
        {
          label: 'Log out',
          icon: 'pi pi-sign-out',
          command: () => this.accountService.logOut(),
          routerLink: '/home'
        }
      ];

    return accountMenuItem;
  }

  private getSongsMenuItem(account: Account): MenuItem {
    const songsMenuItem = {
      label: 'Songs',
      items: new Array<MenuItem>()
    };

    if (account.typeId === environment.simpleUserType)
      songsMenuItem.items = [
        {
          label: 'Own songs',
          routerLink: '/own-songs'
        },
        {
          label: 'Add song',
          icon: 'pi pi-plus',
          routerLink: '/add-song'
        }
      ];
    else
      songsMenuItem.items = [
        {
          label: 'All songs',
          routerLink: '/all-songs'
        }
      ];

    return songsMenuItem;
  }

  ngOnInit(): void {

  }
}
