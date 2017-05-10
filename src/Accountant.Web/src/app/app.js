import { inject } from 'aurelia-framework';
import _ from 'lodash';
import { Service } from './service';

@inject(Service)
export class App {
    constructor(service) {
        this.service = service;
        this.accounts = [{ id: 0, label: "Cash" }, { id: 1, label: "Bank" }];
        this.transactionTypes = [{ id: 0, label: "Expense" }, { id: 1, label: "Income" }];
        this.transactions = [];

        this.transaction = new Transaction();

        this.service.getTransactions()
            .then(data => {
                let ordered = _.orderBy(data, 'date', 'desc');
                this.transactions = ordered;
            });
    }

    addExpense() {
        this.transaction.transactionTypeId = 0;
        this.transactions.push(this.transaction);

        this.saveTransaction(this.transaction)
            .then(id => {
                this.transaction.id = id;
                this.transaction = new Transaction();
            });
    }

    addIncome() {
        this.transaction.transactionTypeId = 1;
        this.transactions.push(this.transaction);

        this.saveTransaction(this.transaction)
            .then(id => {
                this.transaction.id = id;
                this.transaction = new Transaction();
            });
    }

    createTransactionDto(transaction) {
        let amount = parseFloat(transaction.amount);
        let date = Date.parse(transaction.date);
        let tags = transaction.tags.split(',');

        let transactionDto = {
            Amount: amount,
            Date: date,
            AccountId: transaction.accountId,
            Notes: transaction.notes,
            Type: transaction.transactionTypeId,
            Tags: tags
        };

        return transactionDto;
    }

    saveTransaction(transaction) {
        let dto = this.createTransactionDto(this.transaction);

        return this.service.createTransaction(dto)
            .then(id => { return id; });
    }
}

export class Transaction {
    constructor() {
        this.id = null;
        this.amount = null;
        this.tags = null;
        this.date = new Date().toISOString().slice(0, 10);
        this.notes = null;
        this.accountId = null;
        this.transactionTypeId = null;
    }
}
