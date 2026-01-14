document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("pizzaCart")) || [];
  if (cart.length === 0) {
    window.location.href = "/";
    return;
  }




  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) {
    if(document.getElementById("fullName")) document.getElementById("fullName").value = user.name || "";
    if(document.getElementById("phone")) document.getElementById("phone").value = user.phone || "";
  }
});

async function finishOrder(event) {
  event.preventDefault();

  const cart = JSON.parse(localStorage.getItem("pizzaCart")) || [];
  const user = JSON.parse(localStorage.getItem("currentUser"));

  let pizzaIdsList = [];
  cart.forEach((item) => {
    for (let i = 0; i < item.quantity; i++) {
      pizzaIdsList.push(parseInt(item.id));
    }
  });

  const orderRequest = {
    clientId: user ? user.id : null,
    fullName: document.getElementById("fullName").value,
    phone: document.getElementById("phone").value,
    city: document.getElementById("city").value,
    street: document.getElementById("street").value,
    house: document.getElementById("house").value,
    apartment: document.getElementById("apartment").value,
    paymentMethod: document.querySelector('input[name="payment"]:checked').value,
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
      alert("Вітаємо! Замовлення успішно оформлено! Чекайте дзвінка кур'єра.");
      window.location.href = "/";
    } else {
      const errorText = await response.text();
      alert("⚠️ " + errorText);
    }

  } catch (e) {
    console.error(e);
    alert("Немає зв'язку з сервером");
  }
}