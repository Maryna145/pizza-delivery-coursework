// =========================================
// 1. ЛОГІКА ДЛЯ ТОВАРІВ (PIZZAS)
// =========================================

async function handleCreateProduct(event) {
  event.preventDefault();
  const productData = {
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    price: Number(document.getElementById("price").value),
    description: document.getElementById("description").value,
    imageUrl: document.getElementById("imageUrl").value,
  };

  try {
    const response = await fetch("/api/pizzas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (response.ok) {
      alert("Страву успішно додано! 🍕");
      window.location.href = "/admin-crud";
    } else {
      alert("Помилка при збереженні");
    }
  } catch (e) {
    console.error(e);
    alert("Помилка сервера");
  }
}

async function handleUpdateProduct(event) {
  event.preventDefault();
  const id = document.getElementById("pizzaId").value;
  // Перевірка на наявність чекбокса (якщо ви його додали)
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
  if (confirm("Ви точно хочете видалити цю піцу? Це незворотно!")) {
    try {
      const response = await fetch("/api/pizzas/" + id, {
        method: "DELETE",
      });
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
// 2. ЛОГІКА ДЛЯ ЗАМОВЛЕНЬ (ORDERS)
// =========================================

async function updateOrderStatus(selectElement, orderId) {
  const newStatus = selectElement.value;
  const originalColor = selectElement.style.borderColor;

  selectElement.style.borderColor = "#ccc";
  selectElement.disabled = true;

  try {
    const response = await fetch(
      `/api/orders/${orderId}/status?status=${newStatus}`,
      {
        method: "PATCH",
      }
    );

    if (response.ok) {
      selectElement.style.borderColor = "green";
    } else {
      alert("Не вдалося оновити статус!");
      location.reload();
    }
  } catch (e) {
    console.error(e);
    alert("Помилка з'єднання з сервером");
  } finally {
    selectElement.disabled = false;
    setTimeout(() => {
      selectElement.style.borderColor = "#ddd"; // повертаємо колір
    }, 1000);
  }
}

// =========================================
// 3. ЛОГІКА ДЛЯ АВТОПАРКУ (CARS) - ВИПРАВЛЕНО
// =========================================

async function addCar(event) {
  event.preventDefault(); // Зупиняємо звичайну відправку форми

  const carData = {
    model: document.getElementById("model").value,
    licensePlate: document.getElementById("license").value,
    driverLogin: document.getElementById("driver").value,
  };

  try {
    const response = await fetch("/api/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carData),
    });

    if (response.ok) {
      alert("Машину успішно додано! 🚗");
      window.location.reload();
    } else {
      const errorText = await response.text();
      alert("Помилка: " + errorText);
    }
  } catch (e) {
    console.error(e);
    alert("Помилка з'єднання з сервером");
  }
}

async function deleteCar(id) {
  if (!confirm("Ви точно хочете видалити цю машину?")) {
    return;
  }

  try {
    const response = await fetch("/api/cars/" + id, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Машину видалено 🗑");
      window.location.reload();
    } else {
      const errorText = await response.text();
      alert("Помилка: " + errorText);
    }
  } catch (e) {
    console.error(e);
    alert("Сервер не відповідає");
  }
}
// ... (Ваш попередній код addCar та deleteCar залишається) ...

// 1. ШВИДКА ЗМІНА СТАТУСУ (PATCH)
async function updateCarStatusJS(selectElement) {
  const carId = selectElement.getAttribute("data-id");
  const newStatus = selectElement.value;

  // Змінюємо колір селекта миттєво для краси
  selectElement.className = "status-select-car"; // скидаємо класи
  if (newStatus === "free") selectElement.classList.add("st-free");
  if (newStatus === "busy") selectElement.classList.add("st-busy");
  if (newStatus === "at_repairs") selectElement.classList.add("st-broken");

  try {
    const response = await fetch(
      `/api/cars/${carId}/status?status=${newStatus}`,
      {
        method: "PATCH", // Використовуємо PATCH або PUT залежно від контролера
      }
    );

    if (!response.ok) {
      alert("Помилка оновлення статусу!");
      location.reload(); // Відкочуємо назад, якщо помилка
    }
  } catch (e) {
    console.error(e);
    alert("Помилка з'єднання");
  }
}
// 2. ВІДКРИТТЯ МОДАЛЬНОГО ВІКНА (Оновлена версія)
function openEditCarModal(buttonElement) {
  document.getElementById("editCarModal").style.display = "flex";

  // Зчитуємо дані з data-атрибутів кнопки
  const id = buttonElement.getAttribute("data-id");
  const model = buttonElement.getAttribute("data-model");
  const license = buttonElement.getAttribute("data-license");
  const driverLogin = buttonElement.getAttribute("data-driver");

  // Заповнюємо поля форми
  document.getElementById("edit-car-id").value = id;
  document.getElementById("edit-model").value = model;
  document.getElementById("edit-license").value = license;
  document.getElementById("edit-driver").value = driverLogin;
}
// 3. ВІДПРАВКА ЗМІН (PUT)
async function submitEditCar() {
  const id = document.getElementById("edit-car-id").value;
  const data = {
    model: document.getElementById("edit-model").value,
    licensePlate: document.getElementById("edit-license").value,
    driverLogin: document.getElementById("edit-driver").value,
  };

  try {
    const response = await fetch(`/api/cars/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Машину оновлено! ✅");
      location.reload();
    } else {
      const err = await response.text();
      alert("Помилка: " + err);
    }
  } catch (e) {
    console.error(e);
    alert("Помилка сервера");
  }
}
// Цей скрипт специфічний для сторінки профілю, тому залишаємо його тут
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user || user.role !== "admin") {
    window.location.href = "/login";
    return;
  }

  // Заповнюємо поля
  document.getElementById("userId").value = user.id;
  document.getElementById("login").value = user.login;
  document.getElementById("name").value = user.name;
  document.getElementById("phone").value = user.phone;
  document.getElementById("address").value = user.address || "";
});

async function updateAdminProfile(event) {
  event.preventDefault();

  const id = document.getElementById("userId").value;
  const passwordField = document.getElementById("password").value;

  const updateData = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
  };

  // Якщо ввели пароль, додаємо його до запиту
  if (passwordField && passwordField.trim() !== "") {
    updateData.password = passwordField;
  }

  try {
    // Використовуємо той самий endpoint, що і для звичайних юзерів
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      // Оновлюємо localStorage
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      alert("Профіль успішно оновлено! ✅");
    } else {
      alert("Помилка оновлення.");
    }
  } catch (e) {
    console.error(e);
    alert("Помилка сервера");
  }
}
async function assignCar(selectElement, orderId) {
  const carId = selectElement.value;
  const originalColor = selectElement.style.borderColor;

  selectElement.disabled = true; // Блокуємо, поки йде запит

  // Формуємо URL: якщо carId пустий (обрали "Не призначено"), не додаємо параметр
  let url = `/api/orders/${orderId}/assign-car`;
  if (carId) {
    url += `?carId=${carId}`;
  }

  try {
    const response = await fetch(url, {
      method: "PATCH",
    });

    if (response.ok) {
      // Зелена рамка на секунду, щоб показати успіх
      selectElement.style.borderColor = "green";
      setTimeout(() => (selectElement.style.borderColor = "#ddd"), 1500);
    } else {
      alert("Помилка призначення машини");
      location.reload();
    }
  } catch (e) {
    console.error(e);
    alert("Помилка з'єднання");
  } finally {
    selectElement.disabled = false;
  }
}
let currentRecipe = [];

// 1. ВІДКРИТТЯ (Отримуємо кнопку як аргумент)
async function openRecipeEditor(btn) {
  // Читаємо дані з атрибутів кнопки
  const id = btn.getAttribute("data-id");
  const name = btn.getAttribute("data-name");
  const price = btn.getAttribute("data-price");
  const cat = btn.getAttribute("data-cat");
  const img = btn.getAttribute("data-img");

  // Заповнюємо шапку модалки
  document.getElementById("currentProductId").value = id;
  document.getElementById("modalDishName").innerText = name;
  document.getElementById("modalPrice").innerText = price;
  document.getElementById("modalCat").innerText = cat;
  document.getElementById("modalImg").src = img || "/images/Logo.svg"; // Якщо картинки нема

  document.getElementById("recipeModal").style.display = "block";

  // Завантажуємо рецепт
  try {
    const response = await fetch("/api/recipes/pizza/" + id);
    if (response.ok) {
      const data = await response.json();
      currentRecipe = data.map((item) => ({
        ingredientId: item.ingredient.id,
        name: item.ingredient.name,
        unit: item.ingredient.unitOfMeasure,
        amount: item.amount,
      }));
    } else {
      currentRecipe = [];
    }
    renderEditorList();
  } catch (e) {
    console.error(e);
    currentRecipe = [];
    renderEditorList();
  }
}

// 2. ДОДАВАННЯ (Локально)
function addIngredientToRecipe() {
  const select = document.getElementById("newIngSelect");
  const amountInput = document.getElementById("newIngAmount");
  const id = select.value;
  const amount = parseFloat(amountInput.value);

  if (!id || !amount) {
    alert("Оберіть інгредієнт і кількість!");
    return;
  }

  const option = select.options[select.selectedIndex];
  const name = option.text.split(" (")[0];
  const unit = option.getAttribute("data-unit");

  // Оновлення існуючого
  const existing = currentRecipe.find((r) => r.ingredientId == id);
  if (existing) {
    existing.amount = amount;
  } else {
    currentRecipe.push({
      ingredientId: id,
      name: name,
      unit: unit,
      amount: amount,
    });
  }

  renderEditorList();
  select.value = "";
  amountInput.value = "";
}

// 3. РЕНДЕР
function renderEditorList() {
  const container = document.getElementById("modalIngredientsList");
  container.innerHTML = "";

  if (currentRecipe.length === 0) {
    container.innerHTML =
      '<p style="color:gray; text-align:center; padding: 20px;">Список пустий. Додайте щось зверху ☝️</p>';
    return;
  }

  currentRecipe.forEach((item, index) => {
    container.innerHTML += `
                <div class="recipe-editor-row">
                    <span style="flex: 2; font-weight: bold;">${
                      item.name
                    }</span>
                    <span style="flex: 1; text-align: center;">${parseFloat(
                      item.amount
                    )} ${item.unit || ""}</span>
                    <button onclick="removeFromRecipe(${index})" style="background: #ffdddd; color: #d9534f; border: 1px solid #d9534f; padding: 5px 10px; border-radius: 5px; cursor: pointer;">🗑️</button>
                </div>
            `;
  });
}

function removeFromRecipe(index) {
  currentRecipe.splice(index, 1);
  renderEditorList();
}

async function saveRecipeChanges() {
  const productId = document.getElementById("currentProductId").value;
  try {
    for (const item of currentRecipe) {
      const recipeData = {
        // Важливо: ми передаємо тільки IDs для зв'язку
        pizza: { id: productId },
        ingredient: { id: item.ingredientId },
        amount: item.amount,
      };

      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error("Сервер повернув помилку: " + errText);
      }
    }
    alert("Рецепт успішно збережено в базі!");
    location.reload();
  } catch (e) {
    console.error(e);
    alert("Помилка збереження: " + e.message);
  }
}

function closeModal() {
  document.getElementById("recipeModal").style.display = "none";
}
// ГОЛОВНА ФУНКЦІЯ ЗБЕРЕЖЕННЯ
async function handleCreateProduct(event) {
  event.preventDefault();

  // 1. Створюємо об'єкт Піци
  const pizzaData = {
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    price: parseFloat(document.getElementById("price").value),
    description: document.getElementById("description").value,
    imageUrl: document.getElementById("imageUrl").value,
  };

  try {
    // А. Відправляємо запит на створення ПІЦИ
    const pizzaResponse = await fetch("/api/pizzas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pizzaData),
    });

    if (!pizzaResponse.ok) throw new Error("Помилка створення страви");

    const createdPizza = await pizzaResponse.json();
    const pizzaId = createdPizza.id;

    // Б. Якщо це піца і є інгредієнти -> створюємо РЕЦЕПТИ
    if (recipeList.length > 0) {
      for (const item of recipeList) {
        const recipeData = {
          pizza: { id: pizzaId }, // Прив'язка до нової піци
          ingredient: { id: item.ingredientId }, // Прив'язка до інгредієнта
          amount: item.amount,
        };

        await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recipeData),
        });
      }
    }

    alert("Страву успішно створено!");
    window.location.href = "/admin-crud";
  } catch (e) {
    console.error(e);
    alert("Сталася помилка: " + e.message);
  }
}
// ✅ Функція відкриття тепер універсальна (і для створення, і для редагування)
function openIngredientModal(btn) {
  if (btn) {
    // Режим РЕДАГУВАННЯ (заповнюємо поля даними з кнопки)
    document.getElementById("modalTitle").innerText = "Редагувати інгредієнт";
    document.getElementById("ingId").value = btn.getAttribute("data-id");
    document.getElementById("ingName").value = btn.getAttribute("data-name");
    document.getElementById("ingStock").value = btn.getAttribute("data-stock");
    document.getElementById("ingUnit").value = btn.getAttribute("data-unit");
  } else {
    // Режим СТВОРЕННЯ (очищаємо поля)
    document.getElementById("modalTitle").innerText = "Новий інгредієнт";
    document.getElementById("ingId").value = "";
    document.getElementById("ingName").value = "";
    document.getElementById("ingStock").value = "";
    document.getElementById("ingUnit").value = "кг";
  }
  document.getElementById("ingredientModal").style.display = "flex";
}

function closeIngredientModal() {
  document.getElementById("ingredientModal").style.display = "none";
}

async function saveIngredient(event) {
  event.preventDefault();

  const id = document.getElementById("ingId").value;
  const data = {
    name: document.getElementById("ingName").value,
    currentStock: parseFloat(document.getElementById("ingStock").value),
    unitOfMeasure: document.getElementById("ingUnit").value,
  };

  // ✅ Визначаємо метод: Якщо є ID -> PUT (оновлення), якщо немає -> POST (створення)
  const method = id ? "PUT" : "POST";
  const url = id ? "/api/ingredients/" + id : "/api/ingredients";

  try {
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Збережено успішно!");
      location.reload();
    } else {
      alert("Помилка при збереженні!");
    }
  } catch (e) {
    console.error(e);
    alert("Помилка з'єднання");
  }
}
