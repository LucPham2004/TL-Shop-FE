const domain = "https://tl-shop-8b8514452c4e.herokuapp.com";
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('#signup_form');

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fullName = document.querySelector('#fullName').value;
        const email = document.querySelector('#email').value;
        const phone = document.querySelector('#phone').value;
        const password = document.querySelector('#password').value;

        if(!validateSignupForm()) {
            return;
        }

        const signupData = {
            name: fullName,
            email: email,
            phone: phone,
            password: password
        };

        try {
            const loader = document.getElementById('loader');
            loader.style.display = 'block';

            const signupResponse = await fetch(domain + '/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupData)
            });

            if (!signupResponse.ok) {
                const errorMessage = await signupResponse.text();
                throw new Error(errorMessage || 'Đăng ký thất bại');
            }

            alert('Đăng ký thành công!');
            loader.style.display = 'none';

            if(window.location.href ==  '/admin/admin.html'){
                const customers = await fetchCustomers();
                showCustomersInAdminPage(customers);
            } else {
                window.location.href = 'login.html';
            }

        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
            alert('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
        }
    });
});

function validateSignupForm() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phonePattern = /^[0-9]{10}$/; // Basic pattern for a 10-digit phone number

    if (fullName.trim() === "") {
        alert("Vui lòng nhập họ và tên.");
        return false;
    }

    if (!emailPattern.test(email)) {
        alert("Vui lòng nhập địa chỉ email hợp lệ.");
        return false;
    }

    if (!phonePattern.test(phone)) {
        alert("Vui lòng nhập số điện thoại hợp lệ (10 chữ số).");
        return false;
    }

    if (password.trim() === "") {
        alert("Vui lòng nhập mật khẩu.");
        return false;
    }

    return true;
}