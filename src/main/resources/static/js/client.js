function addToCart(button) {
    const product = {
        id: button.getAttribute('data-id'),
        name: button.getAttribute('data-name'),
        price: button.getAttribute('data-price'),
        img: button.getAttribute('data-img'),
        category: button.getAttribute('data-category'),
        quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('pizzaCart', JSON.stringify(cart));

    button.innerText = '✓';
    button.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
        button.innerText = '+';
        button.style.backgroundColor = '';
    }, 1000);

    updateCartCounter();
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const wrapper = document.getElementById('cart-wrapper');

    if (wrapper) {
        let oldBadge = document.getElementById('cart-badge');
        if (oldBadge) oldBadge.remove();

        if (totalCount > 0) {
            let badge = document.createElement('span');
            badge.id = 'cart-badge';
            badge.innerText = totalCount;
            badge.style.cssText = `
                position: absolute; top: -5px; right: -5px;
                background-color: #ff4757; color: white;
                border-radius: 50%; padding: 2px 6px;
                font-size: 12px; font-weight: bold; pointer-events: none;
            `;
            wrapper.appendChild(badge);
        }
    }
}

function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const wrapper = document.getElementById('user-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = '';
    if (user) {
        wrapper.innerHTML = `
            <div style="display: flex; flex-direction: row; align-items: center; line-height: 1.2;">
                <span style="font-weight: bold; color: #193948; margin:0 10px;">${user.name}</span>
                <a href="#" id="logout-btn" style="color: red;text-decoration: none;">Вийти</a>
            </div>
        `;
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            logout();
        });
    } else {
        wrapper.innerHTML = `
            <svg class="header-user" width="36" height="36" style="display: block;">
                <use href="/images/icons.svg#user"></use>
            </svg>
        `;
        wrapper.onclick = () => window.location.href = '/login';
    }
}


function handleUserClick(event) {
    if(event) event.preventDefault();
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
        window.location.href = "/login";
        return;
    }

    if (user.role === 'admin') {
        window.location.href = "/admin/profile";
    } else {
        window.location.href = "/profile";
    }
}
// 1. Правильне мобільне меню (через класи, а не display)
function toggleMobileMenu() {
    const burgerBtn = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;

    if (burgerBtn) burgerBtn.classList.toggle('active');

    // Використовуємо toggle('open'), бо у CSS прописано #mobileMenu.open { opacity: 1 }
    if (mobileMenu) {
        mobileMenu.classList.toggle('open');

        // Блокуємо прокрутку фону, коли меню відкрито
        if (mobileMenu.classList.contains('open')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
    }
}
// ✅ Оновлена функція виходу
async function logout(event) {
    if (event) event.preventDefault();

    try {
        const response = await fetch('/logout', { method: 'POST' });

        // Очищаємо дані про користувача
        localStorage.removeItem('currentUser');

        // ✅ ПРАВИЛЬНО: Перекидаємо на головну сторінку (Меню)
        window.location.href = '/';

    } catch (err) {
        console.error("Помилка при виході:", err);
        localStorage.removeItem('currentUser');
        window.location.href = '/'; // Навіть при помилці — додому
    }
}
function filterMenu() {
    const checkboxes = document.querySelectorAll('.filter-item input:checked');
    const selectedValues = Array.from(checkboxes).map(cb => cb.value.toLowerCase());
    const cards = document.querySelectorAll('.card:not(.card-add-new)'); // Не ховаємо кнопку "Додати"

    const noFiltersSelected = selectedValues.length === 0;

    cards.forEach(card => {
        const rawCategory = card.getAttribute('data-category');
        const category = rawCategory ? rawCategory.toLowerCase() : '';

        // Показуємо все, якщо нічого не вибрано, або якщо категорія збігається
        const isMatch = noFiltersSelected || selectedValues.includes(category) ||
                       (category === 'піца' && selectedValues.includes('pizza')) ||
                       (category === 'напої' && selectedValues.includes('drink'));

        card.style.display = isMatch ? "flex" : "none";
    });
}

// Оновлений DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();
    checkAuthStatus();

    // Викликаємо фільтрацію, щоб врахувати атрибути 'checked' в HTML
    filterMenu();

    // Закриття мобільного меню при кліку на посилання
    const mobileLinks = document.querySelectorAll('.mobile-header-navigation a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });
});
window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      header.classList.toggle('scrolled', window.scrollY > 10);
    });
