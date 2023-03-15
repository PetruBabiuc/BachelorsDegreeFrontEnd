import { Component, OnInit } from '@angular/core';
import { ConsumedService, PaidService } from 'src/app/model';
import { PaidServiceService } from 'src/app/service';

@Component({
  selector: 'app-current-costs',
  templateUrl: './current-costs.component.html',
  styleUrls: ['./current-costs.component.css']
})
export class CurrentCostsComponent implements OnInit {
  userServices: ConsumedService[] = [];
  services: PaidService[] = [];

  serviceData: any;
  anyServiceConsumed: boolean = false;
  total: number = 0;

  constructor(
    private paidServiceService: PaidServiceService
  ) {
    this.services = this.paidServiceService.getServices();
    this.paidServiceService.getServicesObservable().subscribe(services => {
      this.services = services;
      this.updateServiceData();
    });
    if (this.services.length === 0)
      this.paidServiceService.refreshServices();

    this.userServices = this.paidServiceService.getCurrentUserConsumedServices();
    this.paidServiceService.getCurrentUserConsumedServicesObservable().subscribe(services => {
      this.userServices = services;
      this.updateServiceData();
    });
  }

  ngOnInit(): void {
    this.paidServiceService.refreshCurrentUserConsumedServices();
  }

  getServiceQuantity(serviceId: number): number {
    const consumedService = this.userServices.find(s => s.serviceId === serviceId);
    if (consumedService === undefined)
      return 0;
    return consumedService.quantity;
  }

  private updateServiceData(): void {
    const labels: string[] = [];
    const data: number[] = [];
    this.total = 0;
    this.services.forEach(s => {
      labels.push(this.snakeToPascal(s.serviceName));
      const quantity = this.getServiceQuantity(s.serviceId);
      const consumedValue = quantity * s.price;
      this.total += consumedValue;
      data.push(consumedValue);
    });

    this.anyServiceConsumed = data.some(x => x > 0);

      this.serviceData = {
        labels: labels,
        datasets: [
          {
            data: data
          }
        ]
      }
  }

  private snakeToPascal(s: string): string {
    return s.split('_').map(substr =>
      substr.charAt(0).toUpperCase() + substr.slice(1)
    ).join('');
  };
}
