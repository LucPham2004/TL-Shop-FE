document.addEventListener("DOMContentLoaded", async function() {

    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    const orders = await fetchOrders();
    showOrders(orders);
    
    loader.style.display = 'none';

    // Searching orders
    const searchBtn = document.getElementById('OrderSearchBtn');
    const searchInput = document.getElementById('OrderSearchInput');
    if(searchBtn) {
        searchBtn.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');
            this.previousElementSibling.focus();

            const keyword = document.getElementById('OrderSearchInput').value.trim();

            if (keyword) {
                searchOrdersAndDisplay(keyword);
            }

    })

    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const keyword = searchInput.value;
            if (keyword) {
                searchOrdersAndDisplay(keyword);
            }
        }
    });

    } else {
        console.log("not found search button")
    }
});

function searchOrdersAndDisplay(keyword) {
    console.log(keyword);
                
    const OrderSearchInput = document.getElementById('OrderSearchInput');

    // Chuyển đổi keyword thành số nếu có thể
    const parsedKeyword = parseInt(keyword, 10);
    
    if (!isNaN(parsedKeyword)) {
        const loader = document.getElementById('loader');
        loader.style.display = 'block';

        // Nếu parsedKeyword là số hợp lệ
        fetch(domain + `/api/v1/orders/search/${parsedKeyword}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            showOrders(data);
            OrderSearchInput.value = ``;
            loader.style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching Orders:', error);
        });

    } else {
        // Nếu keyword không phải là số
        const loader = document.getElementById('loader');
        loader.style.display = 'block';

        fetch(domain + `/api/v1/orders/search?keyword=${encodeURIComponent(keyword)}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            showOrders(data);
            OrderSearchInput.value = ``;
            loader.style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching Orders:', error);
        });
    }
}

// Fetch Orders Data
async function fetchOrders() {
    try {
        const orderResponse = await fetch(domain + '/api/v1/orders/sortByStatus');
        return orderResponse.json();
    } catch (error) {
        console.error('Error fetching Order orders: ', error);
    }
}

// Show Order in Admin Page
function showOrders(orders) {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';

    orders.forEach(order => {
        const orderItem = document.createElement('tr');

        orderItem.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${formatNumber(parseInt(order.total))} VNĐ</td>
            <td>${extractDate(order.date)}</td>
            <td style="text-align:center;"><span style="font-size:15px;" class="badge ${order.status === 'Processing' ? 'bg-info' : order.status === 'Delivering' ? 'bg-warning' : order.status === 'Completed' ? 'bg-success' : 'bg-danger'}">${order.status}</span></td>
            <td>
                <button type="button" class="SetOrderStatusBtn" onclick="setOrderStatus(${order.id})">Đổi trạng thái</button>
                <button type="button" class="showOrderProductsBtn" data-bs-toggle="collapse" data-bs-target="#order-id-${order.id}" aria-expanded="false" aria-controls="order-id-${order.id}">Xem sản phẩm</button>
                <button type="button" class="deleteOrderBtn" onclick="deleteOrder(${order.id})">Xóa</button>
            </td>
        `;

        // Hàng chứa chi tiết sản phẩm
        const orderProductsRow = document.createElement('tr');
        const orderProductsCell = document.createElement('td');
        
        orderProductsCell.colSpan = 6;

        const orderProducts = document.createElement('div');
        orderProducts.classList.add('collapse');
        orderProducts.id = `order-id-${order.id}`;

        order.orderDetails.forEach(orderDetails => {
            const orderProduct = document.createElement('div');
            orderProduct.classList.add('orderProduct');

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
                        <p class="total">Tổng: ${formatNumber(orderDetails.subtotal)} đ</p>
                    </div>
                </div>
            `;
            orderProducts.appendChild(orderProduct);
        });

        orderProductsCell.appendChild(orderProducts);
        orderProductsRow.appendChild(orderProductsCell);

        // Thêm hàng đơn hàng và hàng sản phẩm vào bảng
        ordersList.appendChild(orderItem);
        ordersList.appendChild(orderProductsRow);
    });
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

    // Create the container div
    const container = document.createElement('div');
    container.id = 'statusContainer';

    // Create a new select element
    const select = document.createElement('select');
    select.id = 'statusSelect';
    select.innerHTML = `
        <option value="Processing">Processing</option>
        <option value="Delivering">Delivering</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
    `;

    // Create a new button element for submit
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Xác nhận';
    submitButton.id = 'submitButton';
    submitButton.onclick = function() {
        const status = document.getElementById('statusSelect').value;
        // Send the new status to the server
        if (orderId > 0 && status) {
            const loader = document.getElementById('loader');
            loader.style.display = 'block';

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
                    loader.style.display = 'none';
                } else {
                    console.error('Cập nhật trạng thái thất bại');
                    alert('Cập nhật trạng thái thất bại');
                }

                document.body.removeChild(container);
            }).catch(error => {
                console.error('Error:', error);
                alert('Có lỗi xảy ra');

                document.body.removeChild(container);
            });
        }
    };

    // Create a new button element for cancel
    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'Hủy';
    cancelButton.id = 'cancelButton';
    cancelButton.onclick = function() {
        // Remove the container when cancelled
        document.body.removeChild(container);
    };

    // Append the select and buttons to the container
    container.appendChild(select);
    container.appendChild(submitButton);
    container.appendChild(cancelButton);

    // Append the container to the body
    document.body.appendChild(container);
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
