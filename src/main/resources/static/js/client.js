//Функція для додавання товару
// Викликається, коли клієнт тисне "+" на картці піци
function addToCart(button) {
    //Зчитуємо дані з HTML-атрибутів кнопки, на яку натиснули
    const product = {
        id: button.getAttribute('data-id'),
        name: button.getAttribute('data-name'),
        price: button.getAttribute('data-price'),
        img: button.getAttribute('data-img'),
        quantity: 1
    };

    //Дістаємо поточний кошик з пам'яті або створюємо пустий масив
    let cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];

    //Перевіряємо, чи така піца вже є
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
        // Якщо є -> просто збільшуємо кількість (+1)
        cart[existingProductIndex].quantity += 1;
    } else {
        // Якщо немає -> додаємо нову піцу в масив
        cart.push(product);
    }

    //Зберігаємо оновлений кошик назад у браузер
    localStorage.setItem('pizzaCart', JSON.stringify(cart));

    //Візуальний ефект: кнопка стає зеленою з галочкою на 1 секунду
    button.innerText = '✓';
    button.style.backgroundColor = '#4CAF50';

    setTimeout(() => {
        button.innerText = '+';
        button.style.backgroundColor = ''; // Повертаємо рідний колір
    }, 1000);

    //Оновлюємо червону цифру на іконці кошика
    updateCartCounter();
}

//Функція для лічильника піц у кошику
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];

    // Рахуємо суму кількості всіх товарів
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Шукаємо або створюємо кружечок (badge)
    let badge = document.getElementById('cart-badge');
    if (!badge) {
        // Якщо кружечка ще немає - створюємо його через JS і додаємо стилі
        const cartIconContainer = document.querySelector('.header-cart').parentNode;
        cartIconContainer.style.position = 'relative';

        badge = document.createElement('span');
        badge.id = 'cart-badge';
        //Стилі задаємо прямо тут, бо елемент динамічний
        badge.style.cssText = `
            position: absolute;
            top: -5px;
            right: 45px;
            background-color: #ff4757;
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 12px;
            font-weight: bold;
        `;
        cartIconContainer.appendChild(badge);
    }
    // Записуємо цифру
    badge.innerText = totalCount;
}

//Запуск при завантаженні
document.addEventListener('DOMContentLoaded', () => {
    //Оновлюємо лічильник, щоб цифра не зникала при оновленні сторінки
    updateCartCounter();
    //Робимо іконку кошика клікабельною а саме: перехід на сторінку /cart)
    const cartIcon = document.querySelector('.header-cart');
    if(cartIcon) {
        cartIcon.style.cursor = 'pointer';
        cartIcon.onclick = () => window.location.href = '/cart';
    }
});