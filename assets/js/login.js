const domain = "http://tlshop.ap-southeast-1.elasticbeanstalk.com";
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        const loginRequest = {
            email: email,
            password: password
        };

        try {
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
            
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', JSON.stringify(token));
                window.location.href = '/index.html';
            } else {
                throw new Error('Không có thông tin người dùng');
            }
            
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
            alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        }
    });
});

