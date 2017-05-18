import { inject } from 'aurelia-framework';
import * as _ from 'lodash';
import { TransactionService } from './service';

@inject(TransactionService)
export class App {
    private _transactionTypes = [{ id: 0, label: "Expense" }, { id: 1, label: "Income" }];

    accounts = [{ id: 0, label: "Cash" }, { id: 1, label: "Bank" }];
    transaction = new TransactionViewModel();
    transactions = new Array<TransactionViewModel>();
    
    constructor(private _service: TransactionService) {
        this._service.getTransactions()
            .then(data => {
                let ordered = _.orderBy(data, 'date', 'desc');
                this.transactions = data;
            });
    }

    addExpense() {
        this.transaction.transactionTypeId = 0;

        this.saveTransaction(this.transaction)
            .then(saved => {
                this.transactions.push(saved);
                this.transaction = new TransactionViewModel();
            });
    }

    addIncome() {
        this.transaction.transactionTypeId = 1;

        this.saveTransaction(this.transaction)
            .then(saved => {
                this.transactions.push(saved);
                this.transaction = new TransactionViewModel();
            });
    }

    getHumanReadableDate(timestamp: number) {
        return new Date(timestamp).toISOString().slice(0, 10);
    }

    getAccountLabel(accountId: number) {
        return this.accounts[accountId].label;
    }

    getTransactionTypeLabel(transactionTypeId: number) {
        return this._transactionTypes[transactionTypeId].label;
    }

    private createTransactionDto(transaction: TransactionViewModel) {
        let date = Date.parse(transaction.date);
        let tags = transaction.tags.split(',');

        let transactionDto = {
            Amount: transaction.amount,
            Date: date,
            AccountId: transaction.accountId,
            Notes: transaction.notes,
            Type: transaction.transactionTypeId,
            Tags: tags
        };

        return transactionDto;
    }

    private saveTransaction(transaction: TransactionViewModel) {
        let dto = this.createTransactionDto(transaction);
        let saved = new TransactionViewModel();

        saved.accountId = transaction.accountId;
        saved.amount = transaction.amount;
        saved.date = transaction.date;
        saved.notes = transaction.notes;
        saved.tags = transaction.tags;
        saved.transactionTypeId = transaction.transactionTypeId;

        return this._service.createTransaction(dto)
            .then(id => { 
                saved.id = id;
                
                return saved;
            });
    }
}

export class TransactionViewModel {
    id: number;
    amount: number;
    tags: string;
    date: string;
    notes: string;
    accountId: number;
    transactionTypeId: number;

    constructor() {
        this.date = new Date().toISOString().slice(0, 10);
    }
}
