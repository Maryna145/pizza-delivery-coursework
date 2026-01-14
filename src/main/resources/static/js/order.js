// 1. При завантаженні підтягуємо суму і дані (якщо є)
document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("pizzaCart")) || [];
  if (cart.length === 0) {
    window.location.href = "/";
    return;
  }


  // Якщо користувач зареєстрований - автозаповнення
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) {
    document.getElementById("fullName").value = user.name || "";
    document.getElementById("phone").value = user.phone || "";
  }
});

// 2. Відправка форми
async function finishOrder(event) {
  event.preventDefault();

  const cart = JSON.parse(localStorage.getItem("pizzaCart")) || [];
  const user = JSON.parse(localStorage.getItem("currentUser"));

  // Формуємо список ID піц
  let pizzaIdsList = [];
  cart.forEach((item) => {
    for (let i = 0; i < item.quantity; i++) {
      pizzaIdsList.push(parseInt(item.id));
    }
  });

  // Збираємо ВСІ дані
  const orderRequest = {
    clientId: user ? user.id : null, // Якщо гість - то null

    fullName: document.getElementById("fullName").value,
    phone: document.getElementById("phone").value,
    city: document.getElementById("city").value,
    street: document.getElementById("street").value,
    house: document.getElementById("house").value,
    apartment: document.getElementById("apartment").value,

    paymentMethod: document.querySelector('input[name="payment"]:checked')
      .value,
    deliveryTime: document.getElementById('deliveryTime').value || null,
    pizzaIds: pizzaIdsList,
  };

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderRequest),
    });

    if (response.ok) {
      localStorage.removeItem("pizzaCart");
      alert(
        "Вітаємо! Замовлення успішно оформлено! Чекайте дзвінка кур'єра. 🍕🏎"
      );
      window.location.href = "/";
    } else {
      alert("Помилка сервера. Спробуйте пізніше.");
    }
  } catch (e) {
    console.error(e);
    alert("Немає зв'язку з сервером");
  }
}
