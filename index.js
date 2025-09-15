import { Order } from "./order.js";
import { User } from "./user.js";
import { OrderManager } from "./orderManager.js";

const om = new OrderManager();


const userId = om.addUser('Ivan', 100);
console.log('Создан пользователь:', om.getUser(userId));


const orderId = om.createOrder(userId, 60);
console.log('Создан заказ:', orderId);


try {
    om.payOrder(orderId);
} catch (err) {
    console.error('Ошибка при оплате:', err.message);
}

try {
    om.shipOrder(orderId);
} catch (err) {
    console.error('Ошибка при отправке:', err.message);
}

try {
    om.deliverOrder(orderId);
} catch (err) {
    console.error('Ошибка при доставке:', err.message);
}

console.log('История заказа:', JSON.stringify(om.getOrderHistory(orderId), null, 2));

console.log('Баланс пользователя:', om.getUser(userId).getBalance());
