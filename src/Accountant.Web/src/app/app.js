import { inject } from 'aurelia-framework';
import { Service } from './service';

@inject(Service)
export class App {
    constructor(service) {
        this.values = [];
        this.service = service;
        this.name = 'there';

        this.service.getValues()
            .then(data => this.values = data);
    }
}
