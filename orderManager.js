import { User } from './user.js';

export class OrderManager {
    constructor() {
        this.users = {};
        this.orders = {};
    }

    addUser(name, initialBalance = 0) {
        const user = new User(name, initialBalance);
        this.users[user.id] = user;
        return user.id;
    }

    getUser(userId) {
        return this.users[userId];
    }

    createOrder(userId, amount) {
        const user = this.getUser(userId);
        if (!user) throw new Error('Пользователь не найден');

        const orderId = user.createOrder(amount);
        this.orders[orderId] = user.orders[orderId];
        return orderId;
    }

    getOrder(orderId) {
        return this.orders[orderId];
    }

    payOrder(orderId) {
        const order = this.getOrder(orderId);
        const user = this.getUser(order.userId);
        order.pay(user);
    }

    shipOrder(orderId) {
        const order = this.getOrder(orderId);
        order.ship();
    }

    deliverOrder(orderId) {
        const order = this.getOrder(orderId);
        order.deliver();
    }

    cancelOrder(orderId) {
        const order = this.getOrder(orderId);
        const user = this.getUser(order.userId);
        order.cancel(user);
    }

    returnOrder(orderId) {
        const order = this.getOrder(orderId);
        order.return();
    }

    refundOrder(orderId) {
        const order = this.getOrder(orderId);
        const user = this.getUser(order.userId);
        order.refund(user);
    }

    getOrderHistory(orderId) {
        const order = this.getOrder(orderId);
        return order.getHistory();
    }
}