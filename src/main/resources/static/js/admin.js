// =========================================
// 1. ЛОГІКА ІНТЕРФЕЙСУ (Виправлення помилок консолі)
// =========================================

// Ця функція потрібна, щоб HTML не видавав помилку "is not defined"
function toggleIngredients(value) {
    // Оскільки ми не додаємо інгредієнти при створенні,
    // ця функція може бути просто порожньою або ховати блок, якщо він є.
    const section = document.getElementById("ingredients-section");
    if (section) {
        section.style.display = 'none';
    }
}

// =========================================
// 2. СТВОРЕННЯ ТОВАРУ (Create) - БЕЗ ІНГРЕДІЄНТІВ
// =========================================

async function handleCreateProduct(event) {
    event.preventDefault(); // Зупиняємо перезавантаження сторінки

    // Зчитуємо дані з форми
    const nameInput = document.getElementById("name");

    const productData = {
        name: nameInput.value,
        category: document.getElementById("category").value,
        price: parseFloat(document.getElementById("price").value),
        description: document.getElementById("description").value,
        imageUrl: document.getElementById("imageUrl").value,
    };

    try {
        console.log("Відправка даних:", productData);

        const response = await fetch("/api/pizzas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
        });

        // Обробка помилок
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Помилка сервера:", errorText);

            // Якщо помилка про дублікат (код 500 або текст помилки SQL)
            if (response.status === 500 || errorText.includes("duplicate")) {
                alert(`Помилка: Страва з назвою "${productData.name}" вже існує!\nЗмініть назву.`);
            } else {
                alert("Помилка при збереженні: " + errorText);
            }
            return;
        }

        // Успіх
        alert("Страву успішно додано! 🍕");
        window.location.href = "/admin-crud";

    } catch (e) {
        console.error("Мережева помилка:", e);
        alert("Не вдалося з'єднатися з сервером. Перевірте, чи запущено програму.");
    }
}

// =========================================
// 3. РЕДАГУВАННЯ ТА ВИДАЛЕННЯ ТОВАРІВ
// =========================================

async function handleUpdateProduct(event) {
    event.preventDefault();
    const id = document.getElementById("pizzaId").value;
    const isPopularCheckbox = document.getElementById("isPopular");

    const productData = {
        name: document.getElementById("name").value,
        category: document.getElementById("category").value,
        price: Number(document.getElementById("price").value),
        description: document.getElementById("description").value,
        imageUrl: document.getElementById("imageUrl").value,
        isPopular: isPopularCheckbox ? isPopularCheckbox.checked : false,
    };

    try {
        const response = await fetch("/api/pizzas/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
        });

        if (response.ok) {
            alert("Зміни збережено! ✅");
            window.location.href = "/admin-crud";
        } else {
            alert("Помилка при оновленні");
        }
    } catch (e) {
        console.error(e);
        alert("Помилка сервера");
    }
}

async function deletePizza(id) {
    if (confirm("Ви точно хочете видалити цю піцу?")) {
        try {
            const response = await fetch("/api/pizzas/" + id, { method: "DELETE" });
            if (response.ok) {
                alert("Піцу видалено!");
                location.reload();
            } else {
                alert("Помилка видалення");
            }
        } catch (e) {
            console.error(e);
            alert("Сервер не відповідає");
        }
    }
}

// =========================================
// 4. ЗАМОВЛЕННЯ, АВТОПАРК, СКЛАД, ПРОФІЛЬ
// =========================================
// (Інші функції залишаються без змін, вони працювали нормально)

async function updateOrderStatus(selectElement, orderId) {
    const newStatus = selectElement.value;
    selectElement.disabled = true;
    try {
        const response = await fetch(`/api/orders/${orderId}/status?status=${newStatus}`, { method: "PATCH" });
        if (response.ok) selectElement.style.borderColor = "green";
        else { alert("Помилка!"); location.reload(); }
    } catch (e) { console.error(e); }
    finally { selectElement.disabled = false; }
}

async function addCar(event) {
    event.preventDefault();
    const carData = {
        model: document.getElementById("model").value,
        licensePlate: document.getElementById("license").value,
        driverLogin: document.getElementById("driver").value,
    };
    try {
        const response = await fetch("/api/cars", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carData),
        });
        if (response.ok) { alert("Машину додано!"); window.location.reload(); }
        else { const t = await response.text(); alert("Помилка: " + t); }
    } catch (e) { alert("Помилка з'єднання"); }
}

async function deleteCar(id) {
    if(!confirm("Видалити машину?")) return;
    try {
        const response = await fetch("/api/cars/" + id, { method: "DELETE" });
        if(response.ok) { alert("Видалено"); window.location.reload(); }
    } catch(e) { alert("Помилка"); }
}

async function updateCarStatusJS(selectElement) {
    const carId = selectElement.getAttribute("data-id");
    const newStatus = selectElement.value;
    // CSS класи
    selectElement.className = "status-select-car";
    if(newStatus === "free") selectElement.classList.add("st-free");
    if(newStatus === "busy") selectElement.classList.add("st-busy");
    if(newStatus === "at_repairs") selectElement.classList.add("st-broken");

    try {
        await fetch(`/api/cars/${carId}/status?status=${newStatus}`, { method: "PATCH" });
    } catch(e) { alert("Помилка"); }
}

// РЕДАГУВАННЯ РЕЦЕПТІВ (Залишаємо, бо це для існуючих піц)
let currentRecipe = [];
async function openRecipeEditor(btn) {
    const id = btn.getAttribute("data-id");
    document.getElementById("currentProductId").value = id;
    document.getElementById("modalDishName").innerText = btn.getAttribute("data-name");

    // Відображаємо модалку
    document.getElementById("recipeModal").style.display = "block";

    // Грузимо рецепт
    try {
        const res = await fetch("/api/recipes/pizza/" + id);
        if(res.ok) {
            const data = await res.json();
            currentRecipe = data.map(i => ({
                ingredientId: i.ingredient.id,
                name: i.ingredient.name,
                unit: i.ingredient.unitOfMeasure,
                amount: i.amount
            }));
        } else { currentRecipe = []; }
        renderEditorList();
    } catch(e) { console.error(e); }
}

function addIngredientToRecipe() {
    const select = document.getElementById("newIngSelect");
    const amount = document.getElementById("newIngAmount").value;
    if(!select.value || !amount) { alert("Заповніть поля"); return; }

    currentRecipe.push({
        ingredientId: select.value,
        name: select.options[select.selectedIndex].text.split(" (")[0],
        unit: select.options[select.selectedIndex].getAttribute("data-unit"),
        amount: amount
    });
    renderEditorList();
}

function renderEditorList() {
    const container = document.getElementById("modalIngredientsList");
    container.innerHTML = "";
    currentRecipe.forEach((item, index) => {
        container.innerHTML += `<div>${item.name} - ${item.amount} ${item.unit} <button onclick="currentRecipe.splice(${index},1); renderEditorList()">x</button></div>`;
    });
}

async function saveRecipeChanges() {
    const pid = document.getElementById("currentProductId").value;
    for(const item of currentRecipe) {
        await fetch("/api/recipes", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                pizza: {id: pid},
                ingredient: {id: item.ingredientId},
                amount: item.amount
            })
        });
    }
    alert("Збережено!");
    location.reload();
}

function closeModal() {
    document.getElementById("recipeModal").style.display = "none";
}

// СКЛАД
function openIngredientModal(btn) {
    document.getElementById("ingredientModal").style.display = "flex";
    if(btn) {
        document.getElementById("modalTitle").innerText = "Редагувати";
        document.getElementById("ingId").value = btn.getAttribute("data-id");
        document.getElementById("ingName").value = btn.getAttribute("data-name");
        document.getElementById("ingStock").value = btn.getAttribute("data-stock");
    } else {
        document.getElementById("modalTitle").innerText = "Новий";
        document.getElementById("ingId").value = "";
        document.getElementById("ingName").value = "";
        document.getElementById("ingStock").value = "";
    }
}
function closeIngredientModal() { document.getElementById("ingredientModal").style.display = "none"; }

async function saveIngredient(e) {
    e.preventDefault();
    const id = document.getElementById("ingId").value;
    const url = id ? "/api/ingredients/" + id : "/api/ingredients";
    const method = id ? "PUT" : "POST";

    const data = {
        name: document.getElementById("ingName").value,
        currentStock: document.getElementById("ingStock").value,
        unitOfMeasure: document.getElementById("ingUnit").value
    };

    await fetch(url, { method: method, headers:{"Content-Type":"application/json"}, body: JSON.stringify(data)});
    location.reload();
}

// ВИХІД
async function logout(e) {
    if(e) e.preventDefault();
    await fetch('/logout', { method: 'POST' });
    localStorage.removeItem('currentUser');
    window.location.href = '/';
}

function toggleMobileMenu() {
    const m = document.getElementById('mobileMenu');
    if(m) m.classList.toggle('open');
}
async function assignCar(selectElement, orderId) {
    const carId = selectElement.value;
    selectElement.disabled = true; // Блокуємо селект, поки йде запит

    // Формуємо URL
    let url = `/api/orders/${orderId}/assign-car`;
    if (carId) {
        url += `?carId=${carId}`;
    }

    try {
        const response = await fetch(url, { method: "PATCH" });

        if (response.ok) {
            // Зелена рамка на секунду (візуальний успіх)
            selectElement.style.borderColor = "green";
            setTimeout(() => (selectElement.style.borderColor = "#ddd"), 1500);
        } else {
            // Якщо сервер повернув помилку (наприклад, машина зайнята)
            const errText = await response.text();
            alert("Помилка призначення машини: " + errText);
            location.reload(); // Оновлюємо сторінку, щоб показати актуальний стан
        }
    } catch (e) {
        console.error(e);
        alert("Помилка з'єднання з сервером");
    } finally {
        selectElement.disabled = false; // Розблоковуємо селект
    }
}