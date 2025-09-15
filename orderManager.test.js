import { OrderManager } from "./orderManager.js";

let om;
let userId;

beforeEach(() => {
    om = new OrderManager();
    userId = om.addUser("TestUser", 100);
});

test("Создание пользователя и заказа", () => {
    expect(userId).toBeDefined();
    const orderId = om.createOrder(userId, 50);
    expect(orderId).toBeDefined();
    const history = om.getOrderHistory(orderId);
    expect(history[0].state).toBe("Created");
});

test("Успешная оплата заказа", () => {
    const orderId = om.createOrder(userId, 50);
    om.payOrder(orderId);
    const history = om.getOrderHistory(orderId);
    expect(history.map(h => h.state)).toContain("Paid");
    expect(om.getUser(userId).getBalance()).toBe(50);
});

test("Недостаточно средств для оплаты", () => {
    const poorUser = om.addUser("PoorGuy", 10);
    const orderId = om.createOrder(poorUser, 50);
    expect(() => om.payOrder(orderId)).toThrow("Недостаточно средств");
});

test("Отмена заказа из Created", () => {
    const orderId = om.createOrder(userId, 20);
    om.cancelOrder(orderId);
    const history = om.getOrderHistory(orderId);
    expect(history.map(h => h.state)).toContain("Cancelled");
});

test("Доставка заказа после оплаты и отправки", () => {
    const orderId = om.createOrder(userId, 30);
    om.payOrder(orderId);
    om.shipOrder(orderId);
    om.deliverOrder(orderId);
    const history = om.getOrderHistory(orderId);
    expect(history.map(h => h.state)).toContain("Delivered");
});

test("Возврат товара и возврат денег", () => {
    const buyerId = om.addUser("Buyer", 200);
    const orderId = om.createOrder(buyerId, 100);

    om.payOrder(orderId);
    om.shipOrder(orderId);
    om.deliverOrder(orderId);

    om.returnOrder(orderId);
    let history = om.getOrderHistory(orderId);
    expect(history.map(h => h.state)).toContain("Returned");

    om.refundOrder(orderId);
    history = om.getOrderHistory(orderId);
    expect(history.map(h => h.state)).toContain("Refunded");
    expect(om.getUser(buyerId).getBalance()).toBe(200);
});
