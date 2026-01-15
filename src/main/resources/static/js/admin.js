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
    const isPopularCheckbox = document.getElementById('isPopular');

    const productData = {
        name: document.getElementById("name").value,
        category: document.getElementById("category").value,
        price: Number(document.getElementById("price").value),
        description: document.getElementById("description").value,
        imageUrl: document.getElementById("imageUrl").value,
        isPopular: isPopularCheckbox ? isPopularCheckbox.checked : false
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
        const response = await fetch(`/api/orders/${orderId}/status?status=${newStatus}`, {
            method: 'PATCH'
        });

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
        model: document.getElementById('model').value,
        licensePlate: document.getElementById('license').value,
        driverLogin: document.getElementById('driver').value
    };

    try {
        const response = await fetch('/api/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carData)
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
        const response = await fetch('/api/cars/' + id, {
            method: 'DELETE'
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
    const carId = selectElement.getAttribute('data-id');
    const newStatus = selectElement.value;

    // Змінюємо колір селекта миттєво для краси
    selectElement.className = 'status-select-car'; // скидаємо класи
    if(newStatus === 'free') selectElement.classList.add('st-free');
    if(newStatus === 'busy') selectElement.classList.add('st-busy');
    if(newStatus === 'at_repairs') selectElement.classList.add('st-broken');

    try {
        const response = await fetch(`/api/cars/${carId}/status?status=${newStatus}`, {
            method: 'PATCH' // Використовуємо PATCH або PUT залежно від контролера
        });

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
    document.getElementById('editCarModal').style.display = 'flex';

    // Зчитуємо дані з data-атрибутів кнопки
    const id = buttonElement.getAttribute('data-id');
    const model = buttonElement.getAttribute('data-model');
    const license = buttonElement.getAttribute('data-license');
    const driverLogin = buttonElement.getAttribute('data-driver');

    // Заповнюємо поля форми
    document.getElementById('edit-car-id').value = id;
    document.getElementById('edit-model').value = model;
    document.getElementById('edit-license').value = license;
    document.getElementById('edit-driver').value = driverLogin;
}
// 3. ВІДПРАВКА ЗМІН (PUT)
async function submitEditCar() {
    const id = document.getElementById('edit-car-id').value;
    const data = {
        model: document.getElementById('edit-model').value,
        licensePlate: document.getElementById('edit-license').value,
        driverLogin: document.getElementById('edit-driver').value
    };

    try {
        const response = await fetch(`/api/cars/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
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
