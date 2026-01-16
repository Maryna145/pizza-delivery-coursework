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
                <span style="font-weight: bold; color: #193948; margin-right:10px;">${user.name}</span>
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

function logout() {
    if(confirm("Вийти з акаунту?")) {
        localStorage.removeItem('currentUser');
        window.location.href = '/';
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
function toggleMobileMenu() {
    const burgerBtn = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;

    if(burgerBtn) burgerBtn.classList.toggle('active');
    if(mobileMenu) mobileMenu.classList.toggle('open');

    if (mobileMenu && mobileMenu.classList.contains('open')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
}

function filterMenu() {
    const checkboxes = document.querySelectorAll('.filter-item input:checked');
    const selectedValues = Array.from(checkboxes).map(cb => cb.value.toLowerCase());
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const rawCategory = card.getAttribute('data-category');
        const category = rawCategory ? rawCategory.toLowerCase() : '';
        let isMatch = false;

        if (selectedValues.includes(category)) {
            isMatch = true;
        }
        else if (category === 'піца' && selectedValues.includes('pizza')) isMatch = true;
        else if (category === 'салати' && selectedValues.includes('salad')) isMatch = true;
        else if (category === 'напої' && selectedValues.includes('drink')) isMatch = true;
        else if (category === 'десерти' && selectedValues.includes('dessert')) isMatch = true;
        if (isMatch) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();
    checkAuthStatus();
    filterMenu();
});