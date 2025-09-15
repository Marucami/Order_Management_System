import readline from "readline";
import { OrderManager } from "./orderManager.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const om = new OrderManager();

function showMenu() {
    console.log(`
===== МЕНЮ =====
1. Создать пользователя
2. Создать заказ
3. Оплатить заказ
4. Отправить заказ
5. Доставить заказ
6. Отменить заказ
7. Вернуть заказ
8. Вернуть деньги (refund)
9. Посмотреть историю заказа
10. Посмотреть баланс пользователя
0. Выход
`);
}

function ask(q) {
    return new Promise(res => rl.question(q, ans => res(ans.trim())));
}

async function main() {
    while (true) {
        showMenu();
        const choice = await ask("Выберите действие: ");

        try {
            switch (choice) {
                case "1": {
                    const name = await ask("Имя: ");
                    const balance = Number(await ask("Баланс: "));
                    const userId = om.addUser(name, balance);
                    console.log("Пользователь создан:", userId);
                    break;
                }
                case "2": {
                    const userId = await ask("ID пользователя: ");
                    const amount = Number(await ask("Сумма заказа: "));
                    const orderId = om.createOrder(userId, amount);
                    console.log("Заказ создан:", orderId);
                    break;
                }
                case "3": {
                    const orderId = await ask("ID заказа: ");
                    om.payOrder(orderId);
                    break;
                }
                case "4": {
                    const orderId = await ask("ID заказа: ");
                    om.shipOrder(orderId);
                    break;
                }
                case "5": {
                    const orderId = await ask("ID заказа: ");
                    om.deliverOrder(orderId);
                    break;
                }
                case "6": {
                    const orderId = await ask("ID заказа: ");
                    om.cancelOrder(orderId);
                    break;
                }
                case "7": {
                    const orderId = await ask("ID заказа: ");
                    om.returnOrder(orderId);
                    break;
                }
                case "8": {
                    const orderId = await ask("ID заказа: ");
                    om.refundOrder(orderId);
                    break;
                }
                case "9": {
                    const orderId = await ask("ID заказа: ");
                    console.log(om.getOrderHistory(orderId));
                    break;
                }
                case "10": {
                    const userId = await ask("ID пользователя: ");
                    console.log("Баланс:", om.getUser(userId).getBalance());
                    break;
                }
                case "0":
                    rl.close();
                    return;
                default:
                    console.log("Неверный выбор");
            }
        } catch (e) {
            console.log("Ошибка:", e.message);
        }
    }
}

main();
