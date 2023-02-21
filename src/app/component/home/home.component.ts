import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private static NO_ACCOUNT_NAME = 'Guest';

  name: string;

  constructor(
    private accountService: AccountService
  ) {
    const currentAccount = this.accountService.getCurrentAccount();
    this.name = currentAccount ? currentAccount.userName : HomeComponent.NO_ACCOUNT_NAME;
  }

  ngOnInit(): void {
    this.accountService.getObservableAccount().subscribe(
      account => this.name = account ? account.userName : HomeComponent.NO_ACCOUNT_NAME,
    )
  }
}
