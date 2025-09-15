import { Order } from './order.js';
import { v4 as uuidv4 } from 'uuid';

export class User {
    constructor(name, initialBalance = 0) {
        this.id = uuidv4();
        this.name = name;
        this.balance = Number(initialBalance) || 0;
        this.orders = {};
    }

    getBalance() {
        return this.balance;
    }

    addBalance(amount) {
        const a = Number(amount);
        if (isNaN(a) || a <= 0) throw new Error('Неверная сумма для пополнения');
        this.balance += a;
        return this.balance;
    }

    deductBalance(amount) {
        const a = Number(amount);
        if (isNaN(a) || a <= 0) throw new Error('Неверная сумма для списания');
        if (this.balance < a) {
            return false;
        }
        this.balance -= a;
        return true;
    }

    createOrder(amount) {
        const a = Number(amount);
        if (isNaN(a) || a <= 0) throw new Error('Неверная сумма заказа');
        const order = new Order(this.id, a);
        this.orders[order.id] = order;
        return order.id;
    }
}
