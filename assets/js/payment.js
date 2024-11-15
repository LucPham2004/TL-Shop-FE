
document.addEventListener("DOMContentLoaded", function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    displayProductsInCart(cart);

    displayCustomerInfo();
});

function displayProductsInCart(cart) {
    const orderContainer = document.getElementById("products");
    orderContainer.innerHTML = '';
    
    const receiptBody = document.querySelector(".receipt-body");

    let subtotal = 0;

    cart.forEach(product => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("product-item");

        const receiItem = document.createElement("div");
        receiItem.classList.add("receipt-item");

        subtotal += product.quantity * product.price;

        // Display cart items
        cartItem.innerHTML = `
            <img alt="Giày ${product.productName}" src="${imageBaseURL + product.productImage}">
            <div class="productItem-info">
                <div class="productInfo">
                    <p class="product-name">${product.productName}</p>
                    <p class="description">${product.categories}</p>
                    <p class="price">${formatNumber(parseInt(product.price))} đ</p>
                    <p class="color">${product.color}</p>
                    <p class="size">${product.size}</p>
                    <p class="quantity">${product.quantity}</p>
                    <p class="total">${formatNumber(parseInt(product.quantity * product.price))} đ</p>
                </div>
                <div class="dropCartItem">
                    <button type="button" class="dropCartItemBtn" onclick="removeFromCart(${parseInt(product.id)})"><i class="fas fa-x"></i></button>
                </div>
            </div>
        `
        orderContainer.appendChild(cartItem);

        // Display receipt items
        receiItem.innerHTML = `
            <p>${product.productName}</p>
            <span>${formatNumber(parseInt(product.quantity * product.price))} đ</span>
        `

        receiptBody.appendChild(receiItem);
    });

    document.getElementById("date").textContent = new Date().toLocaleDateString();

    // Calculate order total
    const shipping = 15000.00;
    const tax = 0.08 * subtotal;
    const total = subtotal + shipping + tax;

    document.getElementById("subtotal").textContent = `${formatNumber(parseInt(subtotal))} đ`;
    document.getElementById("shipping").textContent = `${formatNumber(parseInt(shipping))} đ`;
    document.getElementById("tax").textContent = `${formatNumber(parseInt(tax))} đ`;
    document.getElementById("total").textContent = `${formatNumber(parseInt(total))} đ`;

}

document.getElementById("placeOrderBtn").addEventListener("click", function() {

    let customerInfo = JSON.parse(localStorage.getItem('user')) || [];
    if(customerInfo.address == null) {
        confirm("Quý khách vui lòng nhập địa chỉ trước khi đặt hàng");
        window.location.href = "/user/profile.html";
        return;
    }


    let customerId = getCustomerId();
    let orderDetails = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if(cart.length === 0) {
        alert("Bạn chưa có mặt hàng nào trong giỏ. Hãy thêm vào giỏ vài món nhé!");
        return;
    }

    cart.forEach(product => {
        let orderDetail = {
            productId: product.id,
            productName: product.productName,
            quantity: parseInt(product.quantity),
            unit_price: parseInt(product.price),
            size: parseInt(product.size),
            color: product.color,
            categories: product.categories,
            productImage: product.productImage
        };

        orderDetails.push(orderDetail);
    })

    createOrder(customerId, orderDetails);
});

async function createOrder(customerId, orderDetails) {
    if(orderDetails.length === 0) {
        alert("Bạn chưa có mặt hàng nào trong giỏ. Hãy thêm vào giở vài món nhé!");
        return;
    }
    const url = domain + '/api/v1/orders/placeOrder';
    const orderData = {
        customerId: customerId,
        orderDetails: orderDetails.map(detail => ({
            productId: detail.productId,
            quantity: detail.quantity,
            unit_price: detail.unit_price,
            productName: detail.productName,
            color: detail.color,
            size: detail.size,
            categories: detail.categories,
            productImage: detail.productImage
        }))
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }

        const data = await response.json();
        window.alert("Đơn hàng được đặt thành công!")
        clearCart();
        window.location.href = '/user/profile.html';
        console.log('Order created successfully:', data);
        return data;
    } catch (error) {
        alert("Có lỗi khi đặt hàng! Hãy thử lại sau.")
        console.error('Error creating order:', error);
    }
}

function displayCustomerInfo() {
    try {
        let customerInfo = JSON.parse(localStorage.getItem('user')) || [];

        const userName = document.getElementById('name');
        const email = document.getElementById('email');
        const phoneSpan = document.getElementById('phone');
        const addressSpan = document.getElementById('address');

        let address = customerInfo.address;
        if(address == null) {
            address = "Chưa có địa chỉ";
        }

        userName.innerHTML = `${customerInfo.name}`;
        email.innerHTML = `${customerInfo.email}`;
        phoneSpan.innerHTML = `${customerInfo.phone}`;
        addressSpan.innerHTML = `${address}`;

    } catch (error) {
        console.error('Error fetching customer infomation:', error);
    }
}

