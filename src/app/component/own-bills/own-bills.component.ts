import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/model';
import { BillService } from 'src/app/service/bill/bill.service';

@Component({
  selector: 'app-own-bills',
  templateUrl: './own-bills.component.html',
  styleUrls: ['./own-bills.component.css', './own-bills.component.scss']
})
export class OwnBillsComponent implements OnInit {
  bills: Bill[] = [];
  billsData: any;

  constructor(
    private billService: BillService
  ) {
    this.setBills(billService.getOwnBills());
    this.billService.getOwnBillsObservable().subscribe(bills => this.setBills(bills));
  }

  ngOnInit(): void {
    this.billService.refreshOwnBills();
  }

  private setBills(bills: Bill[]): void {
    this.bills = bills;
    this.updateBillsData();
  }

  private computePricesForEachMonth(bills: Bill[]): number[] | null[] {
    let result: number[] | null[] = Array(12).fill(null);

    bills.forEach(b => result[b.issueDate.getMonth()] = b.price);

    return result;
  }

  private updateBillsData(): void {
    if (this.bills.length === 0)
      return;

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'Octomber', 'November', 'December'];

    const years = [... new Set(this.bills.map(b => b.issueDate.getFullYear()))];

    const yearToBills = years.map(y => ({
      year: y,
      bills: this.bills
        .filter(b => b.issueDate.getFullYear() === y)
        .sort(b => b.issueDate.getMonth())
    }));

    const datasets = yearToBills.map(ytb => ({
      label: ytb.year,
      data: this.computePricesForEachMonth(ytb.bills),
      tension: 0.4
    }));

    this.billsData = {
      labels: months,
      datasets: datasets
    }
  }
}
