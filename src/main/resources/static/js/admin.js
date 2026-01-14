document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user || user.role !== "admin") {
    alert("Доступ заборонено! Тільки для адмінів.");
    window.location.href = "/";
  }
});

function logout() {
  if (confirm("Вийти з акаунту?")) {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
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
      alert("Страву успішно додано!");
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

  const productData = {
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    price: document.getElementById("price").value,
    description: document.getElementById("description").value,
    imageUrl: document.getElementById("imageUrl").value,
  };

  try {
    const response = await fetch("/api/pizzas/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      alert("Зміни збережено!");
      window.location.href = "/admin-crud";
    } else {
      alert("Помилка при оновленні");
    }
  } catch (e) {
    console.error(e);
    alert("Помилка сервера");
  }
}

async function updateOrderStatus(selectElement, orderId) {
    const newStatus = selectElement.value;
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
            selectElement.style.borderColor = "#ddd";
        }, 1000);
    }
}
async function addCar(event) {
    event.preventDefault();
    const carData = {
        model: document.getElementById("model").value,
        licensePlate: document.getElementById("license").value,
        driverLogin: document.getElementById("driver").value
    };
    console.log("Відправка:", carData);
    try {
        const response = await fetch("/api/cars", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(carData)
        });
        if (response.ok) {
            alert("Машину успішно додано!");
            location.reload();
        } else {
            const errorText = await response.text();
            alert("Помилка: " + errorText);
        }
    } catch (e) {
        console.error(e);
        alert("Сервер не відповідає");
    }
}
async function deleteCar(id) {
    if (confirm("Видалити цю машину?")) {
        try {
            const response = await fetch("/api/cars/" + id, { method: "DELETE" });
            if (response.ok) location.reload();
            else alert("Помилка видалення");
        } catch (e) {
            alert("Помилка сервера");
        }
    }
}