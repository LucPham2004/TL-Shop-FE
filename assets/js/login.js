const domain = "https://tl-shop-8b8514452c4e.herokuapp.com";
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        if(!validateForm()) {
            return;
        };

        const loginRequest = {
            email: email,
            password: password
        };

        try {
            const loader = document.getElementById('loader');
            loader.style.display = 'block';

            const response = await fetch(domain + '/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginRequest)
            });

			console.log(response);

            if (!response.ok) {
                throw new Error('Đăng nhập thất bại');
            }

            const data = await response.json();
            console.log(data);

            const user = data.result.user;
			const token = data.result.jwt;
            loader.style.display = 'none';
            
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', JSON.stringify(token));
                window.location.href = 'index.html';
            } else {
                throw new Error('Không có thông tin người dùng');
            }
            
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
            alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        }
    });
});

function validateForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailPattern.test(email)) {
        alert("Vui lòng nhập địa chỉ email hợp lệ.");
        return false;
    }

    if (password.trim() === "") {
        alert("Vui lòng nhập mật khẩu.");
        return false;
    }

    return true;
}