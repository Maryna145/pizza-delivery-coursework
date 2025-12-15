// Головна функція  відмальовує кошик
function renderCart() {
    //Дістаємо дані з пам'яті браузера або беремо пустий масив
    const cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];
    //Знаходимо куди вставляти піци і де писати суму
    const container = document.getElementById('cart-items-list');
    const totalSection = document.querySelector('.total-section');

    // Якщо кошик порожній - виводимо повідомлення
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">Кошик порожній 😔</p>';
        totalSection.innerHTML = 'Всього: <span id="cart-total">0</span> ₴';
        return;
    }

    let html = '';
    let total = 0;
    let allPrices = []; //Масив для зберігання цін кожної окремої піци

    // Проходимося по кожному товару
    cart.forEach((item, index) => {
        // Рахуємо загальну вартість
        total += item.price * item.quantity;

        //Наприклад якщо замовили 2 піци по 200 грн, додаємо в масив: [200, 200]
        // Це потрібно, щоб потім знайти найменшу ціну серед всіх піц
        for (let i = 0; i < item.quantity; i++) {
            allPrices.push(parseFloat(item.price));
        }

        // Формуємо HTML для однієї піци (картинка, назва, кнопки +/-)
        html += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>${item.price} ₴</p>
                </div>
                <div class="item-controls">
                    <button onclick="changeQty(${index}, -1)">-</button>
                    <span style="margin: 0 10px; font-weight: bold;">${item.quantity}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>
        `;
    });

    // Вставляємо згенерований HTML на сторінку
    container.innerHTML = html;

    // Логіка акції "10+1"
    if (allPrices.length >= 11) {
        // Знаходимо найменше число в масиві цін
        const minPrice = Math.min(...allPrices);
        // Віднімаємо його від загальної суми
        const finalTotal = total - minPrice;

        //Відмальовуємо блок зі знижкою
        totalSection.innerHTML = `
            <div class="discount-message">
                Вітаємо Акція "10+1": Знижка <b>-${minPrice} ₴</b> активована!
            </div>
            <div style="margin-top: 5px;">
                Всього: <span class="old-price">${total}</span>
                <span class="final-price">${finalTotal}</span> ₴
            </div>
        `;
    } else {
        // Якщо піц менше 11 - показуємо звичайну суму
        totalSection.innerHTML = `Всього: <span id="cart-total" style="font-weight: bold; font-size: 24px;">${total}</span> ₴`;
    }
}

//Функція для зміни кількості піц
function changeQty(index, change) {
    let cart = JSON.parse(localStorage.getItem('pizzaCart'));

    // Змінюємо кількість (+1 або -1)
    cart[index].quantity += change;

    // Якщо стало 0 або менше - видаляємо товар з масиву
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    // Зберігаємо назад у браузер і перемальовуємо екран
    localStorage.setItem('pizzaCart', JSON.stringify(cart));
    renderCart();
}

//Функція для повного очищення
function clearCart() {
    const cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];
    if (cart.length === 0) {
        alert("Кошик вже порожній!");
        return;
    }
    // Питаємо підтвердження
    if (confirm("Ви впевнені, що хочете повністю очистити кошик?")) {
        localStorage.removeItem('pizzaCart'); // Видаляємо все
        renderCart(); // Перемальовуємо
    }
}

//Функція для відправки на сервер
async function submitOrder() {
    const cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];
    const address = document.getElementById('clientAddress').value;
    const clientId = document.getElementById('clientId').value;

    //Перевірки
    if (cart.length === 0) { alert('Кошик порожній!'); return; }
    if (!address) { alert('Введіть адресу!'); return; }

    //Підготовка даних для Java-контролера
    //Перетворюємо [{id:1, quantity:2}] -> [1, 1]
    let pizzaIds = [];
    cart.forEach(item => {
        for(let i=0; i < item.quantity; i++) {
            pizzaIds.push(parseInt(item.id));
        }
    });

    // Об'єкт, який чекає OrderController.java
    const orderData = {
        clientId: parseInt(clientId),
        address: address,
        pizzaIds: pizzaIds
    };

    try {
        // Відправляємо POST запит
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const result = await response.json();
            alert(`Замовлення №${result.id} успішно створено!`);
            localStorage.removeItem('pizzaCart'); // Чистимо кошик після успіху
            window.location.href = '/'; // Переходимо на головну
        } else {
            alert('Помилка сервера!');
        }
    } catch (e) {
        console.error(e);
        alert('Щось пішло не так...');
    }
}
//Запускаємо рендер при відкритті сторінки
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});