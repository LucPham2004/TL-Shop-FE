document.addEventListener('DOMContentLoaded', function() {
    displayCustomerInfo();
    fetchCustomerOrders();

    const changeInfo = document.querySelector('.user-info');
    const changeInfoBtn = document.querySelector('.changeInfo-btn');
    const editForms = document.getElementById('editForms');
    const userInfoForm = document.getElementById('userInfoForm');
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const phoneInput = document.getElementById('phoneInput');
    const addressInput = document.getElementById('addressInput');

    const nameSpan = document.getElementById('name');
    const emailSpan = document.getElementById('email');
    const phoneSpan = document.getElementById('phone');
    const addressSpan = document.getElementById('address');

    changeInfoBtn.addEventListener('click', function() {
        editForms.classList.remove('hidden');
        changeInfo.classList.add('hidden');

        // Populate input fields with current info
        nameInput.value = nameSpan.textContent;
        emailInput.value = emailSpan.textContent;
        phoneInput.value = phoneSpan.textContent;
        addressInput.value = addressSpan.textContent;
    });

    userInfoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if(!validateUserInfoForm()) {
            return;
        }

        const customerDTO = {
            id: getCustomerId(),
            email: emailInput.value,
            name: nameInput.value,
            phone: phoneInput.value,
            address: addressInput.value
        };
        const loader = document.getElementById('loader');
        loader.style.display = 'block';

        fetch(domain + '/api/v1/customers', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerDTO)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        })
        .then(data => {
            // Update info
            let customerInfo = fetchCustomerInfo();
            nameSpan.textContent = customerInfo.name;
            emailSpan.textContent = customerInfo.email;
            phoneSpan.textContent = customerInfo.phone;
            addressSpan.textContent = customerInfo.address;

            // Hide form, show info
            editForms.classList.add('hidden');
            changeInfo.classList.remove('hidden');
            loader.style.display = 'none';
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });

    cancelBtn.addEventListener('click', function() {
        // Hide form, show info
        editForms.classList.add('hidden');
        changeInfo.classList.remove('hidden');
    });
});

async function fetchCustomerInfo() {
    try {
        const userInfo = JSON.parse(localStorage.getItem('user')) || [];

        if(userInfo.length != 0) {
            return userInfo;
        } else {
            const loader = document.getElementById('loader');
            loader.style.display = 'block';

            const token = JSON.parse(localStorage.getItem('token')) || [];
        
            const response = await fetch(domain + '/api/v1/customers/' + parseInt(getCustomerId()), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
            }})
            loader.style.display = 'none';
            
            return await response.json();
        }

    } catch (error) {
        console.error('Error fetching customer infomation:', error);
    }
}

async function displayCustomerInfo () {

    const customerInfo = await fetchCustomerInfo();

    const nameSpan = document.getElementById('name');
    const emailSpan = document.getElementById('email');
    const phoneSpan = document.getElementById('phone');
    const addressSpan = document.getElementById('address');

    nameSpan.innerHTML = `${customerInfo.name}`;
    emailSpan.innerHTML = `${customerInfo.email}`;
    phoneSpan.innerHTML = `${customerInfo.phone}`;
    addressSpan.innerHTML = `${customerInfo.address}`;
}

async function fetchCustomerOrders() {
    try {
        const loader = document.getElementById('loader');
        loader.style.display = 'block';

        const orderResponse = await fetch(domain + '/api/v1/orders/customer/' + getCustomerId());
        const orders = await orderResponse.json();

        const ordersContainer = document.getElementById("orders-container");
        ordersContainer.innerHTML = '';
        const userAgent = navigator.userAgent;

        if(orders.length == 0) {
            ordersContainer.innerHTML = `Bạn chưa có đơn hàng nào cả. Hãy đi mua sắm vài món đi nào.`;
            return;
        }

        orders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('order');

            const orderProducts = document.createElement('div');
            orderProducts.classList.add('orderProducts');
            
            order.orderDetails.forEach(orderDetails => {
                const orderProduct = document.createElement('div');
                orderProduct.classList.add('orderProduct');
                

                if (/mobile/i.test(userAgent)) {
                    orderProduct.innerHTML = `
                    <img alt="Giày ${orderDetails.productName}" src="${imageBaseURL + orderDetails.productImage}">
                    <div class="productItem-info">
                        <div class="productInfo">
                            <p class="product-name">${orderDetails.productName}</p>
                        </div>
                    </div>
                `
                } else {
    
                    orderProduct.innerHTML = `
                        <img alt="Giày ${orderDetails.productName}" src="${imageBaseURL + orderDetails.productImage}">
                        <div class="productItem-info">
                            <div class="productInfo">
                                <p class="product-name">${orderDetails.productName}</p>
                                <p class="description">${orderDetails.categories}</p>
                                <p class="price">Đơn giá: ${formatNumber(parseInt(orderDetails.unitPrice))} đ</p>
                                <p class="color">Màu: ${orderDetails.color}</p>
                                <p class="size">Size: ${orderDetails.size}</p>
                                <p class="quantity">SL: ${orderDetails.quantity}</p>
                                <p class="total"><strong>Tổng:</strong> ${formatNumber(orderDetails.subtotal)} đ</p>
                            </div>
                        </div>
                    `
                }
                orderProducts.appendChild(orderProduct);

            });

            if (/mobile/i.test(userAgent)) {
                if(order.status !== "Completed" && order.status !== "Cancelled") {
                    orderItem.innerHTML = `
                    <div class="orderInfo">
                        <p style="color:red;"><strong>Tổng đơn:</strong> ${formatNumber(parseInt(order.total))} VNĐ</p>
                        <p><strong>Trạng thái:</strong> <span style="font-size:15px;" class="badge ${order.status === 'Processing' ? 'bg-info' : order.status === 'Delivering' ? 'bg-warning' : order.status === 'Completed' ? 'bg-success' : 'bg-danger'}">${order.status}</span></p>
                        <button type="button" class="deleteOrderBtn" onclick="cancelOrder(${order.id})">Hủy đơn</button>
                    </div>
                `
                } else {
                    orderItem.innerHTML = `
                    <div class="orderInfo">
                        <p style="color:red;"><strong>Tổng đơn:</strong> ${formatNumber(parseInt(order.total))} VNĐ</p>
                        <p><strong>Trạng thái:</strong> <span style="font-size:15px;" class="badge ${order.status === 'Processing' ? 'bg-info' : order.status === 'Delivering' ? 'bg-warning' : order.status === 'Completed' ? 'bg-success' : 'bg-danger'}">${order.status}</span></p>
                        <button type="button" class="deleteOrderBtn" onclick="deleteOrder(${order.id})">Xóa đơn</button>
                    </div>
                `
                }
            } else {

                if(order.status !== "Completed" && order.status !== "Cancelled") {
                    orderItem.innerHTML = `
                    <div class="orderInfo">
                        <p><strong>Mã đơn hàng:</strong> ${order.id}</p>
                        <p><strong>Ngày đặt hàng:</strong> ${extractDate(order.date)}</p>
                        <p style="color:red;"><strong>Tổng đơn:</strong> ${formatNumber(parseInt(order.total))} VNĐ</p>
                        <p><strong>Trạng thái:</strong> <span style="font-size:15px;" class="badge ${order.status === 'Processing' ? 'bg-info' : order.status === 'Delivering' ? 'bg-warning' : order.status === 'Completed' ? 'bg-success' : 'bg-danger'}">${order.status}</span></p>
                        <button type="button" class="deleteOrderBtn" onclick="cancelOrder(${order.id})">Hủy đơn</button>
                    </div>
                `
                } else {
                    orderItem.innerHTML = `
                    <div class="orderInfo">
                        <p><strong>Mã đơn hàng:</strong> ${order.id}</p>
                        <p><strong>Ngày đặt hàng:</strong> ${extractDate(order.date)}</p>
                        <p style="color:red;"><strong>Tổng đơn:</strong> ${formatNumber(parseInt(order.total))} VNĐ</p>
                        <p><strong>Trạng thái:</strong> <span style="font-size:15px;" class="badge ${order.status === 'Processing' ? 'bg-info' : order.status === 'Delivering' ? 'bg-warning' : order.status === 'Completed' ? 'bg-success' : 'bg-danger'}">${order.status}</span></p>
                        <button type="button" class="deleteOrderBtn" onclick="deleteOrder(${order.id})">Xóa đơn</button>
                    </div>
                `
                }
            }
            
            orderItem.appendChild(orderProducts);

            ordersContainer.appendChild(orderItem);
            loader.style.display = 'none';
        })

    } catch (error) {
        console.error('Error fetching customer orders: ', error);
    }
}

async function cancelOrder(orderId) {
    if(confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
        const loader = document.getElementById('loader');
        loader.style.display = 'block';

        await fetch(domain + '/api/v1/orders', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: parseInt(orderId), status: "Cancelled" })
        }).then(response => {
            if (response.ok) {
                console.log(`Order ID: ${orderId}, New Status: Cancelled`);
                alert('Hủy đơn hàng thành công!');
                loader.style.display = 'none';
            } else {
                console.error('Hủy đơn hàng thất bại, hãy thử lại sau');
                alert('Hủy đơn hàng thất bại, hãy thử lại sau');
            }
        }).catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra');
        });
    } else {
        return;
    }
}

async function deleteOrder(id) {
    if(confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
        const loader = document.getElementById('loader');
        loader.style.display = 'block';

        const response = await fetch(domain + `/api/v1/orders/${parseInt(id)}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            
            showNotification();
            fetchCustomerOrders();
            loader.style.display = 'none';
        } else {
            console.error('Failed to delete order');
        }
    } else {
        return;
    }
}

function validateUserInfoForm() {
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const phone = document.getElementById('phoneInput').value;
    const address = document.getElementById('addressInput').value;

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phonePattern = /^[0-9]{10}$/; // Pattern for a 10-digit phone number

    if (name.trim() === "") {
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

    if (address.trim() === "") {
        alert("Vui lòng nhập địa chỉ.");
        return false;
    }

    return true; 
}

function formatNumber(number) {
    return number.toLocaleString('vi-VN');
}

function removeVietnameseTones(str) {
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
    return str;
}

function convertProductName(productName) {
    // Bỏ dấu tiếng Việt
    let noToneName = removeVietnameseTones(productName);
    
    // Thay thế khoảng trắng bằng dấu gạch ngang
    let convertedName = noToneName.replace(/\s+/g, '-');
    
    return convertedName;
}

function extractDate(datetimeString) {
    let datePart = datetimeString.split('T')[0];
    
    return datePart;
}