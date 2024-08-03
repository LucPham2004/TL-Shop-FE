document.addEventListener("DOMContentLoaded", async function() {

    const orders = await fetchOrders();
    showOrders(orders);
});

// Fetch Orders Data
async function fetchOrders() {
    try {
        const orderResponse = await fetch(domain + '/api/v1/orders');
        return orderResponse.json();
    } catch (error) {
        console.error('Error fetching customer orders: ', error);
    }
}

// Show Order in Admin Page
function showOrders(orders) {
    const ordersContainer = document.getElementById("orders-container");
    ordersContainer.innerHTML = '';

    orders.forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.classList.add('order');

        const orderProducts = document.createElement('div');
        orderProducts.classList.add('orderProducts');
        orderProducts.classList.add('collapse');
        orderProducts.id = `order-id-${order.id}`;
        
        let totalQuantity = 0;

        order.orderDetails.forEach(orderDetails => {
            const orderProduct = document.createElement('div');
            orderProduct.classList.add('orderProduct');

            orderProduct.innerHTML = `
                <img alt="Giày ${orderDetails.productName}" src="${orderDetails.productImage}">
                <div class="productItem-info">
                    <div class="productInfo">
                        <p class="product-name">${orderDetails.productName}</p>
                        <p class="description">${orderDetails.categories}</p>
                        <p class="price">Đơn giá: ${formatNumber(parseInt(orderDetails.unitPrice))} đ</p>
                        <p class="color">Màu: ${orderDetails.color}</p>
                        <p class="size">Size: ${orderDetails.size}</p>
                        <p class="quantity">SL: ${orderDetails.quantity}</p>
                        <p class="total">Tổng: ${formatNumber(orderDetails.subtotal)} đ</p>
                    </div>
                </div>
            `
            orderProducts.appendChild(orderProduct);

            totalQuantity += orderDetails.quantity;

        });

        orderItem.innerHTML = `
            <div class="orderInfo" >
                <p><strong>Mã đơn hàng:</strong> ${order.id}</p>
                <p><strong>Ngày đặt hàng:</strong> ${extractDate(order.date)}</p>
                <p style="color:red;"><strong>Tổng tiền:</strong> ${formatNumber(parseInt(order.total))} VNĐ</p>
                <p><strong>Trạng thái:</strong> ${order.status}</p>
                <p><strong>Số lượng:</strong> ${totalQuantity}</p>
                <button type="button" class="SetOrderStatusBtn" onclick="setOrderStatus(${order.id})">Đổi trạng thái</button>
                <button type="button" class="showOrderProductsBtn" data-bs-toggle="collapse" data-bs-target="#order-id-${order.id}" aria-expanded="false" aria-controls="order-id-${order.id}">Xem sản phẩm</button>
                <button type="button" class="deleteOrderBtn" onclick="deleteOrder(${order.id})">Xóa</button>
            </div>
        `
        orderItem.appendChild(orderProducts);

        ordersContainer.appendChild(orderItem);
    })
}

async function filterOrders() {
    const orders = await fetchOrders();

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const minAmount = document.getElementById('minAmount').value;
    const maxAmount = document.getElementById('maxAmount').value;
    const orderStatus = document.getElementById('orderStatus').value;

    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
        const min = minAmount ? parseFloat(minAmount) : null;
        const max = maxAmount ? parseFloat(maxAmount) : null;

        return (!start || orderDate >= start) &&
               (!end || orderDate <= end) &&
               (!min || order.total >= min) &&
               (!max || order.total <= max) &&
               (!orderStatus || order.status === orderStatus);
    });

    showOrders(filteredOrders);
}

async function nonfilterOrders() {
    const orders = await fetchOrders();
    showOrders(orders);

    document.getElementById('filterForm').reset();
} 

function setOrderStatus(orderId) {
    console.log(orderId);
    // Create a new input element
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Nhập trạng thái đơn hàng mới';
    input.id = 'statusInput';

    // Create a new button element
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Xác nhận';
    submitButton.onclick = function() {
        const status = document.getElementById('statusInput').value;
        // Send the new status to the server
        if (orderId > 0 && status) {
            fetch(domain + '/api/v1/orders', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: parseInt(orderId), status: status })
            }).then(response => {
                if (response.ok) {
                    console.log(`Order ID: ${orderId}, New Status: ${status}`);
                    alert('Trạng thái đã được cập nhật!');
                } else {
                    console.error('Cập nhật trạng thái thất bại');
                    alert('Cập nhật trạng thái thất bại');
                }
                // Remove the input and buttons after submission
                document.body.removeChild(input);
                document.body.removeChild(submitButton);
                document.body.removeChild(cancelButton);
            }).catch(error => {
                console.error('Error:', error);
                alert('Có lỗi xảy ra');
                // Remove the input and buttons after submission
                document.body.removeChild(input);
                document.body.removeChild(submitButton);
                document.body.removeChild(cancelButton);
            });
        }
    };

    // Create a new button element for cancel
    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'Hủy';
    cancelButton.onclick = function() {
        // Remove the input and buttons when cancelled
        document.body.removeChild(input);
        document.body.removeChild(submitButton);
        document.body.removeChild(cancelButton);
    };

    // Style the input and buttons to appear in the center of the screen
    input.style.position = 'fixed';
    input.style.top = '50%';
    input.style.left = '50%';
    input.style.transform = 'translate(-50%, -50%)';
    input.style.zIndex = '1000'; // Ensure it appears above other elements

    submitButton.style.position = 'fixed';
    submitButton.style.top = '55%';
    submitButton.style.left = '45%';
    submitButton.style.transform = 'translate(-50%, -50%)';
    submitButton.style.zIndex = '1000'; // Ensure it appears above other elements

    cancelButton.style.position = 'fixed';
    cancelButton.style.top = '55%';
    cancelButton.style.left = '55%';
    cancelButton.style.transform = 'translate(-50%, -50%)';
    cancelButton.style.zIndex = '1000'; // Ensure it appears above other elements

    // Append the input and buttons to the body
    document.body.appendChild(input);
    document.body.appendChild(submitButton);
    document.body.appendChild(cancelButton);
}

// Delete Order By Id
async function deleteOrder(id) {
    if(confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
        const response = await fetch(domain + `/api/v1/orders/${parseInt(id)}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            
            showNotification();
            fetchOrders();
        } else {
            console.error('Failed to delete order');
        }
    } else {
        return;
    }
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