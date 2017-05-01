import { inject } from 'aurelia-framework';
import { Service } from './service';

@inject(Service)
export class App {
    constructor(service) {
        this.transactions = [];
        this.service = service;
        this.name = 'there';

        this.service.getTransactions()
            .then(data => this.transactions = data);
    }
}
