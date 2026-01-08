document.addEventListener("DOMContentLoaded", async () => {
  // 1. Отримуємо користувача з localStorage
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    alert("Ви не авторизовані!");
    window.location.href = "/login";
    return;
  }

  // 2. Заповнюємо картку зліва
  document.getElementById("profile-name").innerText = user.name || "Клієнт";
  document.getElementById("profile-email").innerText = user.email || "";
  document.getElementById("profile-phone").innerText = user.phone || "";
  const addressEl = document.getElementById('profile-address');
    if (user.address) {
        addressEl.innerHTML = ` ${user.address}`;
    } else {
        addressEl.innerHTML = ` Адреса не збережена`;
    }
  // 3. Завантажуємо замовлення з сервера
  await loadUserOrders(user.id);
});

async function loadUserOrders(userId) {
  const container = document.getElementById("orders-list");

  try {
    const response = await fetch(`/api/orders/user/${userId}`);
    if (response.ok) {
      const orders = await response.json();

      if (orders.length === 0) {
        container.innerHTML =
          "<p>Ви ще нічого не замовляли. Саме час спробувати піцу! </p>";
        return;
      }

      let html = "";
      // Словник для перекладу статусів
      const statusNames = {
        new_order: "Оформлено",
        being_cooked: "Готується",
        being_delivered: "В дорозі",
        delivered: "Доставлено",
      };

      orders.forEach((order) => {
        const statusText = statusNames[order.status] || order.status;
        const date = new Date(order.date).toLocaleDateString(); // Форматуємо дату

        html += `
                        <div class="history-card status-${order.status}">
                            <div class="order-header">
                                <span>Замовлення #${order.id} від ${date}</span>
                                <span style="color: #dc7002;">${statusText}</span>
                            </div>
                            <div class="order-items">
                                ${order.items || "Деталі не вказані"}
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; padding-top: 10px; font-size: 14px;">
                                                        <span> ${order.deliveryAddress}</span>
                                                        <span style="font-size: 18px; font-weight: 900; color: #dc7002;">${order.totalAmount} ₴</span>
                                                    </div>
                            <div class="order-footer">
                                <span>Адреса: ${order.deliveryAddress}</span>
                                <span class="price-tag">${
                                  order.totalAmount
                                } ₴</span>
                            </div>
                        </div>
                    `;
      });
      container.innerHTML = html;
    } else {
      container.innerHTML = "<p>Помилка завантаження історії.</p>";
    }
  } catch (e) {
    console.error(e);
    container.innerHTML = "<p>Сервер не відповідає.</p>";
  }
}

function logout() {
  if (confirm("Точно вийти?")) {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  }
}
