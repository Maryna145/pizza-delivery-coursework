//Функція для додавання товару у кошик
// Викликається з HTML при натисканні на кнопку +
function addToCart(button) {
    //Збираємо інформацію про піцу з HTML-атрибутів кнопки
    //використовуємо getAttribute, щоб отримати конкретні дані,
    //які зашили в кнопку на сервері.
    const product = {
        id: button.getAttribute('data-id'),
        name: button.getAttribute('data-name'),
        price: button.getAttribute('data-price'),
        img: button.getAttribute('data-img'),
        quantity: 1
    };

    // Отримуємо поточний стан кошика
    // localStorage.getItem повертає рядок (String), тому використовуємо JSON.parse,
    // щоб перетворити його назад у масив об'єктів JavaScript.
    // "|| []" означає: якщо в пам'яті  null, створити порожній масив.
    let cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];

    //Перевіряємо, чи цей товар вже є в кошику
    // findIndex поверне індекс товару (0, 1, 2...), якщо знайде його за ID.
    // Якщо товару немає, поверне -1.
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
        // Якщо товар вже є
        // Ми не додаємо дублікат, а просто збільшуємо поле quantity у існуючого товару.
        cart[existingProductIndex].quantity += 1;
    } else {
        // Якщо товару немає
        // Додаємо новий об'єкт у кінець масиву
        cart.push(product);
    }

    //Зберігаємо оновлений кошик назад у пам'ять браузера
    // JSON.stringify перетворює масив назад у рядок, бо localStorage розуміє тільки рядки.
    localStorage.setItem('pizzaCart', JSON.stringify(cart));

    //Візуальний ефект
    // Змінюємо текст кнопки на галочку та колір на зелений
    button.innerText = '✓';
    button.style.backgroundColor = '#4CAF50';

    // Через 1 секунду повертаємо кнопці початковий вигляд
    setTimeout(() => {
        button.innerText = '+';
        button.style.backgroundColor = ''; // Порожній рядок скидає inline-стиль
    }, 1000);

    // Одразу оновлюємо червону цифру на кошику, щоб клієнт бачив зміни
    updateCartCounter();
}
//Оновлення лічильника
function updateCartCounter() {
    // Знову читаємо кошик, щоб порахувати актуальну кількість
    const cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];

    // Використовуємо метод .reduce() для підрахунку суми.
    // sum - накопичувач, item - кожна піца. Ми додаємо item.quantity до суми.
    // 0 - це початкове значення суми.
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Шукаємо контейнер , куди вставити цифру
    const wrapper = document.getElementById('cart-wrapper');

    // Якщо контейнер знайдено (захист від помилок на інших сторінках)
    if (wrapper) {
        // Спочатку видаляємо старий кружечок, щоб цифри не накладалися одна на одну
        let oldBadge = document.getElementById('cart-badge');
        if (oldBadge) oldBadge.remove();

        //Якщо товарів більше 0, створюємо новий кружечок
        if (totalCount > 0) {
            let badge = document.createElement('span');
            badge.id = 'cart-badge';
            badge.innerText = totalCount; // Записуємо всередину цифру

            // Задаємо стилі прямо через JS, бо динамічно змінюється
            // pointer-events: none важливий, щоб клік проходив крізь цифру на саму іконку кошика
            badge.style.cssText = `
                position: absolute;
                top: -5px;
                right: -5px;
                background-color: #ff4757;
                color: white;
                border-radius: 50%;
                padding: 2px 6px;
                font-size: 12px;
                font-weight: bold;
                pointer-events: none;
            `;
            // Додаємо створений <span> всередину <div> обгортки
            wrapper.appendChild(badge);
        }
    }
}
//Авторизація (відображення профілю)
function checkAuthStatus() {
    // Читаємо дані користувача, які ми зберегли при вході на сторінці Login
    const user = JSON.parse(localStorage.getItem('currentUser'));
    // Шукаємо обгортку для іконки користувача
    const wrapper = document.getElementById('user-wrapper');
    if (!wrapper) return; // Якщо ми на сторінці, де немає хедера, виходимо
    // Повністю очищаємо вміст обгортки перед малюванням
    wrapper.innerHTML = '';
    if (user) {
        //Якщо користувач увійшов
        //Замість іконки малюємо Ім'я та кнопку для виходу
        wrapper.innerHTML = `
            <div style="display: flex; flex-direction: row; align-items: center; line-height: 1.2;">
                <span style="font-weight: bold; color: #193948; margin-right:10px;">${user.name}</span>
                <a href="#" onclick="logout()" style="color: red;text-decoration: none;">
                    Вийти
                </a>
            </div>
        `;

        // Додаємо обробник подій на кнопку вийти
        document.getElementById('btn-logout').addEventListener('click', (e) => {
            // e.stopPropagation() зупиняє спливання кліку.
            // Без цього клік по кнопці вийти також зарахувався б як клік по user-wrapper,
            // що могло б викликати небажані переходи.
            e.stopPropagation();
            logout();
        });

    } else {
        //Якщо просто гість
        //Малюємо стандартну SVG іконку користувача
        wrapper.innerHTML = `
            <svg class="header-user" width="36" height="36" style="display: block;">
                <use href="/images/icons.svg#user"></use>
            </svg>
        `;
        // Якщо клікнути на обгортку -> переходимо на сторінку входу
        wrapper.onclick = () => window.location.href = '/login';
    }
}
// Функція виходу з системи
function logout() {
    if(confirm("Вийти з акаунту?")) {
        //Видаляємо запис про користувача з пам'яті
        localStorage.removeItem('currentUser');
        //Перезавантажуємо головну сторінку, щоб іконка оновилася назад на гостя
        window.location.href = '/';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    //Оновлюємо цифру на кошику раптом там вже є товари з минулого разу
    updateCartCounter();
    //Перевіряємо, хто зайшов Гість чи Юзер і малюємо відповідну іконку
    checkAuthStatus();

});
function toggleMobileMenu() {
    const burgerBtn = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;

    // 1. Анімація кнопки (твоя логіка)
    burgerBtn.classList.toggle('active');

    // 2. Відкриття меню
    mobileMenu.classList.toggle('open');

    // 3. Блокування скролу сторінки
    if (mobileMenu.classList.contains('open')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
}
function handleUserClick(event) {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
        window.location.href = "/login";
        return;
    }

    if (user.role === 'admin') {
        // ТЕПЕР ВЕДЕМО НА АДМІНСЬКИЙ ПРОФІЛЬ
        window.location.href = "/admin/profile";
    } else {
        window.location.href = "/profile";
    }
}