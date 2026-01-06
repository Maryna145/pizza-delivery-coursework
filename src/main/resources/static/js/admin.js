// --- ЗАХИСТ СТОРІНКИ ---
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user || user.role !== "admin") {
    alert("Доступ заборонено! Тільки для адмінів.");
    window.location.href = "/";
  }
});

function logout() {
  if (confirm("Вийти з акаунту?")) {
    //Видаляємо запис про користувача з пам'яті
    localStorage.removeItem("currentUser");
    //Перезавантажуємо головну сторінку, щоб іконка оновилася назад на гостя
    window.location.href = "/";
  }
}

// --- ФУНКЦІЯ ВИДАЛЕННЯ ---
async function deletePizza(id) {
  if (confirm("Ви точно хочете видалити цю піцу? Це незворотно!")) {
    try {
      // Відправляємо запит на сервер (цей метод треба буде додати в UserController або PizzaController)
      const response = await fetch("/api/pizzas/" + id, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Піцу видалено!");
        location.reload(); // Перезавантажуємо сторінку
      } else {
        alert("Помилка видалення");
      }
    } catch (e) {
      console.error(e);
      alert("Сервер не відповідає");
    }
  }
}
// --- JS ДЛЯ ВІДПРАВКИ ---
async function handleCreateProduct(event) {
  event.preventDefault();

  const productData = {
    name: document.getElementById("name").value,
    // Додаємо категорію
    category: document.getElementById("category").value,
    price: Number(document.getElementById("price").value),
    description: document.getElementById("description").value,
    imageUrl: document.getElementById("imageUrl").value,
  };

  try {
    const response = await fetch("/api/pizzas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (response.ok) {
      alert("Страву успішно додано! 🎉");
      window.location.href = "/admin-crud"; // Повертаємось до списку
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

  // Беремо ID з прихованого поля
  const id = document.getElementById("pizzaId").value;

  const productData = {
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    price: document.getElementById("price").value,
    description: document.getElementById("description").value,
    imageUrl: document.getElementById("imageUrl").value,
  };

  try {
    // Зверни увагу: метод PUT і адреса з ID
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
// --- ЗМІНА СТАТУСУ ЗАМОВЛЕННЯ ---
async function updateOrderStatus(selectElement, orderId) {
    const newStatus = selectElement.value;

    // Робимо красивий ефект "завантаження" (змінюємо колір рамки)
    selectElement.style.borderColor = "#ccc";
    selectElement.disabled = true; // Блокуємо, поки йде запит

    try {
        // Відправляємо запит на сервер
        // Зверни увагу: параметри передаються через ?status=...
        const response = await fetch(`/api/orders/${orderId}/status?status=${newStatus}`, {
            method: 'PATCH'
        });

        if (response.ok) {
            // Успіх! Підсвітимо зеленим на секунду
            selectElement.style.borderColor = "green";
            // Можна вивести маленьке повідомлення (опціонально)
            // console.log(`Order ${orderId} updated to ${newStatus}`);
        } else {
            alert("Не вдалося оновити статус!");
            // Повертаємо попереднє значення (якщо треба, але тут простіше перезавантажити)
            location.reload();
        }
    } catch (e) {
        console.error(e);
        alert("Помилка з'єднання з сервером");
    } finally {
        // Розблоковуємо селект
        selectElement.disabled = false;
        // Повертаємо звичайний колір через 1 сек
        setTimeout(() => {
            selectElement.style.borderColor = "#ddd";
        }, 1000);
    }
}