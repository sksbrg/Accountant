import { HttpClient, json } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';


@inject(HttpClient)
export class TransactionService {
    constructor(private _client: HttpClient) {
        this._client.configure(config => {
            config
                .withBaseUrl('api/')
                .withInterceptor({
                    request(request) {
                        console.log(`Requesting ${request.method} ${request.url}`);
                        console.log(request);

                        return request;
                    },
                    response(response) {
                        console.log(`Received ${response.status} ${response.url}`);
                        console.log(response);

                        return response;
                    }
                });
        });
    }

    getTransactions(): Promise<Array<TransactionDto>> {
        return this._client.fetch('transactions')
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    getTransaction(id: number): Promise<TransactionDto> {
        return this._client.fetch(`transactions/${id}`)
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    createTransaction(transaction: TransactionDto): Promise<number> {
        return this._client.fetch('transactions', {
                method: 'post',
                body: json(transaction)
            })
            .then(response => {
                let url = response.headers.get('location');

                if (!url) throw new Error(`Missing 'location' header: expected the response to contain a HTTP 'location' header pointing to the newly created transaction.`);

                let id = url.split('/').pop();
                
                if (!id) throw new Error(`Missing 'id': expected the HTTP 'location' header of the response to contain the id of the newly created transaction.`);

                return parseInt(id);
            });
    }
}

export class TransactionDto {
    public id: number;

    constructor(public amount: number, public date: number, public accountId: number, public typeId: number,
                public notes: string, public tags: Array<string>) {

    }
}
