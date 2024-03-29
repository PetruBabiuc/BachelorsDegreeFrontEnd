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
  items: MenuItem[] = [];
  constructor(
    private accountService: AccountService,
  ) {

  }

  ngOnInit(): void {
    this.items = this.getMenuItems(this.accountService.getCurrentAccount());

    this.accountService.getObservableAccount()
      .subscribe(account => this.items = this.getMenuItems(account));
  }

  private getMenuItems(account: Account | null): MenuItem[] {
    let menuItems = [this.getHomeMenuItem()];

    if (account !== null) {
      if (account.typeId === environment.simpleUserType)
        menuItems = [...menuItems, this.getSongsMenuItem(account), this.getCrawlerMenuItem(), this.getPaymentMenuItem()]
      else if (account.typeId === environment.adminUserType)
        menuItems = [...menuItems, this.getUsersMenuItems()];
    }

    return [...menuItems, this.getAccountButton(account)];
  }

  private getUsersMenuItems(): MenuItem {
    return {
      label: 'Users',
      icon: 'pi pi-users',
      items: [
        {
          label: '(De)activate users',
          icon: 'pi pi-user-edit',
          routerLink: '/de-activate-users'
        }
      ]
    }
  }

  private getCrawlerMenuItem(): MenuItem {
    return {
      label: 'Crawler',
      icon: 'pi pi-sitemap',
      items: [
        {
          label: 'Start crawling',
          icon: 'pi pi-caret-right',
          routerLink: '/start-crawling'
        },
        {
          label: 'Status',
          icon: 'pi pi-info',
          routerLink: '/crawler-status'
        }
      ]
    }
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
          icon: 'pi pi-list',
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

  private getPaymentMenuItem(): MenuItem {
    return {
      label: 'Payment',
      icon: 'pi pi-dollar',
      items: [
        {
          label: 'Current costs',
          icon: 'pi pi-money-bill',
          routerLink: '/current-costs'
        },
        {
          label: 'Bills',
          icon: 'pi pi-money-bill',
          routerLink: '/own-bills'
        }
      ]
    }
  }
}
