import { inject } from 'aurelia-framework';
import * as _ from 'lodash';

import { TransactionService, TransactionDto } from './transactionService';


@inject(TransactionService)
export class App {
    private _transactionTypes = [{ id: 0, label: "Expense" }, { id: 1, label: "Income" }];

    accounts = [{ id: 0, label: "Cash" }, { id: 1, label: "Bank" }];
    balance = 0;
    transaction = new TransactionViewModel();
    transactions = new Array<TransactionViewModel>();
    
    constructor(private _service: TransactionService) {
        
    }

    activate() {
        this._service.getTransactions()
            .then(data => {
                let transactions = new Array<TransactionViewModel>();

                data.forEach(dto => {
                    let t = this.createTransactionViewModel(dto);
                    transactions.push(t);
                });

                this.transactions = this.orderTransactionsByDate(transactions);
                this.balance = this.calculateBalance(this.transactions);
            });
    }

    addExpense() {
        this.transaction.typeId = 0;

        this.saveTransaction(this.transaction)
            .then(saved => {
                this.transactions.push(saved);
                this.transactions = this.orderTransactionsByDate(this.transactions);
                this.balance = this.calculateBalance(this.transactions);
                this.transaction = new TransactionViewModel();
            });
    }

    addIncome() {
        this.transaction.typeId = 1;

        this.saveTransaction(this.transaction)
            .then(saved => {
                this.transactions.push(saved);
                this.transactions = this.orderTransactionsByDate(this.transactions);
                this.balance = this.calculateBalance(this.transactions);
                this.transaction = new TransactionViewModel();
            });
    }

    deleteTransaction(transaction: TransactionViewModel) {
        if (confirm(`Delete transaction from ${transaction.date} with amount '${transaction.amount}'?`)) {
            this._service.deleteTransaction(transaction.id)
                .then(() => {
                    let index = this.transactions.indexOf(transaction);
                    this.transactions.splice(index , 1);
                });
        }
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

    private createTransactionDto(transaction: TransactionViewModel): TransactionDto {
        let date = Date.parse(transaction.date);
        let tags = transaction.tags.split(',');

        let dto = new TransactionDto(transaction.amount, date, transaction.accountId,
                        transaction.typeId, transaction.notes, tags);

        return dto;
    }

    private createTransactionViewModel(transactionDto: TransactionDto): TransactionViewModel {
        let t = new TransactionViewModel();

        t.id = transactionDto.id;
        t.accountId = transactionDto.accountId;
        t.amount = transactionDto.amount;
        t.date = this.getHumanReadableDate(transactionDto.date);
        t.notes = transactionDto.notes;
        t.tags = transactionDto.tags.join(',');
        t.typeId = transactionDto.typeId;

        return t;
    }

    private saveTransaction(transaction: TransactionViewModel) {
        let dto = this.createTransactionDto(transaction);
        let saved = new TransactionViewModel();

        saved.accountId = transaction.accountId;
        saved.amount = transaction.amount;
        saved.date = transaction.date;
        saved.notes = transaction.notes;
        saved.tags = transaction.tags;
        saved.typeId = transaction.typeId;

        return this._service.createTransaction(dto)
            .then(id => { 
                saved.id = id;
                
                return saved;
            });
    }

    private orderTransactionsByDate(transactions: Array<TransactionViewModel>) {
        let ordered = _.orderBy(transactions, 'date', 'desc');

        return ordered;
    }

    private calculateBalance(transactions: Array<TransactionViewModel>) :number {
        let balance = 0;
        
        transactions.forEach(t => {
            if (t.typeId === 0) {
                balance -= t.amount;
            }
            else {
                balance += t.amount;
            }
        });
        
        return balance;
    }
}

export class TransactionViewModel {
    id: number;
    amount: number;
    tags: string;
    date: string;
    notes: string;
    accountId: number;
    typeId: number;

    constructor() {
        this.date = new Date().toISOString().slice(0, 10);
    }
}
