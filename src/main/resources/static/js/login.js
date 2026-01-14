async function handleLogin(event) {
    event.preventDefault();

    const loginData = {
        login: document.getElementById('login').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const user = await response.json();

            localStorage.setItem('currentUser', JSON.stringify(user));

            if (user.role === 'admin') {
                alert('Вітаю, Шеф!');
                window.location.href = '/admin-crud';
            } else {
                alert('Ви успішно увійшли');
                window.location.href = '/';
            }

        } else {
            alert('Невірний логін або пароль');
        }

    } catch (e) {
        console.error(e);
        alert('Помилка сервера');
    }
}
function togglePassword() {
    const input = document.getElementById('password');
    const btn = document.querySelector('.toggle-password');

    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '🐵';
    }
}

