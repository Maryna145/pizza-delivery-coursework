function renderCart() {
    const cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];

    const container = document.getElementById('cart-items-list');
    const clearBtn = document.querySelector('.btn-clear');

    const checkoutSection = document.querySelector('.checkout-section');
    const totalSection = document.querySelector('.total-section');

    // --- ЛОГІКА ДЛЯ ПОРОЖНЬОГО КОШИКА ---
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-wrapper">
                <div class="empty-icon">🍕</div>
                <h3 class="empty-title">Ой, тут порожньо!</h3>
                <p class="empty-subtitle">Виглядає так, ніби ви ще не обрали свою ідеальну піцу. Саме час це виправити!</p>
                <a href="/" class="btn-back-to-menu">Перейти до меню</a>
            </div>
        `;

        if (checkoutSection) checkoutSection.classList.add("hidden");
        if (clearBtn) clearBtn.style.display = "none";
        document.querySelector('.discount-wrapper')?.remove();
        return;
    }

    // --- ЯКЩО ТОВАРИ Є ---
    if (checkoutSection) checkoutSection.classList.remove("hidden");
    if (clearBtn) clearBtn.style.display = 'block';
    let html = '';
    let total = 0;
    let allPrices = [];
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        for (let i = 0; i < item.quantity; i++) {
            allPrices.push(parseFloat(item.price));
        }
        html += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} ₴</p>
                </div>
                <div class="item-controls">
                    <button onclick="changeQty(${index}, -1)">−</button>
                    <span class="item-count">${item.quantity}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // --- ЛОГІКА АКЦІЇ ---
    document.querySelector('.discount-wrapper')?.remove();
    if (allPrices.length >= 11) {
        const minPrice = Math.min(...allPrices);
        const finalTotal = total - minPrice;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'discount-wrapper';
        msgDiv.innerHTML = `<div class="discount-message">✅ Акція "10+1": мінус ${minPrice} грн</div>`;
        if (totalSection && totalSection.parentNode) {
             totalSection.parentNode.insertBefore(msgDiv, totalSection);
        }
        totalSection.innerHTML = `
            <span class="total-label">Всього до сплати:</span>
            <div class="price-container">
                <span class="old-price">${total}</span>
                <span class="final-price">${finalTotal} ₴</span>
            </div>
        `;
    } else {
        totalSection.innerHTML = `
            <span class="total-label">Всього до сплати:</span>
            <span class="total-price">${total} ₴</span>
        `;
    }
}

// --- ЗМІНА КІЛЬКОСТІ ---
function changeQty(index, change) {
    let cart = JSON.parse(localStorage.getItem('pizzaCart'));
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem('pizzaCart', JSON.stringify(cart));
    renderCart();
}


// --- ОЧИЩЕННЯ КОШИКА ---
function clearCart() {
    const cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];
    if (cart.length === 0) return;

    if (confirm("Очистити кошик?")) {
        localStorage.removeItem('pizzaCart');
        document.querySelector('.discount-wrapper')?.remove();
        renderCart();
    }
}


// --- ВІДПРАВКА ЗАМОВЛЕННЯ ---
async function submitOrder() {
    // 1. Перевіряємо кошик
    const cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];
    if (cart.length === 0) {
        alert('Кошик порожній!');
        return;
    }

    // 2. Перевіряємо адресу
    const addressInput = document.getElementById('clientAddress');
    if (!addressInput || !addressInput.value.trim()) {
        alert('Будь ласка, введіть адресу доставки! 🏠');
        addressInput?.focus(); // Ставимо курсор у поле
        return;
    }

    // 3. Перевіряємо авторизацію
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || !user.id) {
        if(confirm("Щоб зробити замовлення, потрібно увійти. Перейди на сторінку входу?")) {
            window.location.href = '/login';
        }
        return;
    }

    // 4. Формуємо дані для сервера
    // Сервер чекає список ID: [1, 1, 2] (дві піци №1 і одна №2)
    let pizzaIdsList = [];
    cart.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
            pizzaIdsList.push(parseInt(item.id));
        }
    });

    const orderRequest = {
        clientId: user.id,
        address: addressInput.value,
        pizzaIds: pizzaIdsList
    };

    // 5. Відправляємо на сервер
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderRequest)
        });

        if (response.ok) {
            alert(`Замовлення прийнято! 🎉\nКухня вже почала готувати.`);

            // Очищаємо кошик
            localStorage.removeItem('pizzaCart');
            // Переходимо на головну
            window.location.href = '/';
        } else {
            const errorText = await response.text();
            console.error('Error:', errorText);
            alert('Щось пішло не так при замовленні. Спробуйте ще раз.');
        }
    } catch (e) {
        console.error(e);
        alert('Сервер не відповідає. Перевірте інтернет.');
    }
}

// Запуск при старті
document.addEventListener('DOMContentLoaded', renderCart);