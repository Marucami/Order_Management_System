import { v4 as uuidv4 } from 'uuid';

class State {
  constructor(name) {
    this.name = name;
  }


  pay(order) { throw new Error(`Нельзя оплатить заказ в состоянии: ${this.name}`); }
  ship(order) { throw new Error(`Нельзя отправить заказ в состоянии: ${this.name}`); }
  deliver(order) { throw new Error(`Нельзя доставить заказ в состоянии: ${this.name}`); }
  cancel(order) { throw new Error(`Нельзя отменить заказ в состоянии: ${this.name}`); }
  return(order) { throw new Error(`Нельзя вернуть заказ в состоянии: ${this.name}`); }
  refund(order) { throw new Error(`Нельзя вернуть деньги по заказу в состоянии: ${this.name}`); }
}


class CreatedState extends State {
  constructor() {
    super('Created');
  }

  pay(order, user) {
    if (user.deductBalance(order.amount)) {
      order.setState(new PaidState());
      order.addToHistory('pay');
      console.log("Заказ оплачен");
    } else {
      throw new Error('Недостаточно средств для оплаты заказа');
    }
  }

  cancel(order) {
    order.setState(new CancelledState());
    order.addToHistory('cancel');
    console.log("Заказ отменен");
  }
}

class PaidState extends State {
  constructor() {
    super('Paid');
  }

  ship(order) {
    order.setState(new ShippedState());
    order.addToHistory('ship');
    console.log("Заказ отправлен");
  }

  cancel(order, user) {
    user.addBalance(order.amount);
    order.setState(new CancelledState());
    order.addToHistory('cancel');
    console.log("Заказ отменен, деньги возвращены");
  }
}

class ShippedState extends State {
  constructor() {
    super('Shipped');
  }

  deliver(order) {
    order.setState(new DeliveredState());
    order.addToHistory('deliver');
    console.log("Заказ доставлен");
  }
}

class DeliveredState extends State {
  constructor() {
    super('Delivered');
  }

  return(order) {
    order.setState(new ReturnedState());
    order.addToHistory('return');
    console.log("Заказ возвращен");
  }
}

class CancelledState extends State {
  constructor() {
    super('Cancelled');
  }

}

class ReturnedState extends State {
  constructor() {
    super('Returned');
  }

  refund(order, user) {
    user.addBalance(order.amount);
    order.setState(new RefundedState());
    order.addToHistory('refund');
    console.log("Деньги возвращены");
  }
}

class RefundedState extends State {
  constructor() {
    super('Refunded');
  }

}

export class Order {
  constructor(userId, amount) {
    this.id = uuidv4();
    this.userId = userId;
    this.amount = amount;
    this.state = new CreatedState();
    this.history = [];
    this.addToHistory('create');
  }

  setState(state) {
    this.state = state;
  }

  addToHistory(action) {
    this.history.push({
      state: this.state.name,
      action,
      timestamp: new Date().toISOString()
    });
  }

  pay(user) { this.state.pay(this, user); }
  ship() { this.state.ship(this); }
  deliver() { this.state.deliver(this); }
  cancel(user) { this.state.cancel(this, user); }
  return() { this.state.return(this); }
  refund(user) { this.state.refund(this, user); }

  getHistory() {
    return this.history;
  }
}