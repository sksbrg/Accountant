import { HttpClient } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';

@inject(HttpClient)
export class Service {
    constructor(client) {
        this.client = client;

        this.client.configure(config => {
            config
                .withBaseUrl('api/')
                .withInterceptor({
                    request(request) {
                        console.log(`Requesting ${request.method} ${request.url}`);

                        return request;
                    },
                    response(response) {
                        console.log(`Received ${response.status} ${response.url}`);

                        return response;
                    }
                });
        });
    }

    getTransactions() {
        return this.client.fetch('transactions')
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    getTransaction(id) {
        return this.client.fetch(`transactions/${id}`)
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }
}
