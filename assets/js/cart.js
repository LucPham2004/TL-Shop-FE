
const maxCartProducts = 5;

// Add product to Cart when click add-to-cart button
const addToCartBtn = document.getElementById("addToCart");
if(addToCartBtn) {
    addToCartBtn.addEventListener("click", AddProductToCart);
};

// Add product to cart and redirect to ordering page
const buyNowBtn = document.getElementById('buyNow');
if(buyNowBtn) {
    buyNowBtn.addEventListener("click", async function() {
        await AddProductToCart();
        window.location.href = "/payment.html";
    });
};

async function AddProductToCart() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    
    if (productId) {
        await fetch(domain + "/api/v1/products/" + productId)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                return response.json();
            })
            .then(product => {
                const cartContainer = document.getElementById("cart-items");
                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");

                price = product.productPrice * (100 - product.discountPercent) / 100;

                const color = document.getElementById("color").value;
                const size = document.getElementById("size").value;
                const quantity = document.getElementById("quantity").value;

                cartItem.innerHTML = `
                    <img alt="Giày ${product.productName}" src="${imageBaseURL + product.productImage}">
                    <div class="item-info">
                        <div class="cartItemInfo">
                            <p class="product-name">${product.productName}</p>
                            <p class="description">${product.categories}</p>
                            <p class="price">${formatNumber(price)} đ</p>
                        </div>
                        <div class="dropCartItem">
                            <button type="button" class="dropCartItemBtn" onclick="removeFromCart(${product.id})"><i class="fas fa-x"></i></button>
                        </div>
                    </div>
                `

                if(countItemsInCart() < maxCartProducts) {
                    cartContainer.appendChild(cartItem);
                    showNotification();
                    addToCartInLocalStorage({ id: `${product.id}`, productName: `${product.productName}`, 
                                price: `${price}`, categories: `${product.categories}`, 
                                color: `${color}`, size: `${size}`,
                                quantity: `${quantity}`, productImage: `${product.productImage}`})
                } else {
                    window.alert("Giỏ hàng chỉ được tối đa 5 sản phẩm!")
                }
                
        })
        .catch(error => {
            console.log("Product not found. Error: " + error);
        });
    } else {
        console.log("No product selected");
    }
}

// Add to Cart and Load Cart functions
function addToCartInLocalStorage(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    displayCart(cart);
}

function displayCart(cart) {
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = '';

    cart.forEach(product => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <img alt="Giày ${product.productName}" src="${imageBaseURL + product.productImage}">
            <div class="item-info">
                <div class="cartItemInfo">
                    <p class="product-name">${product.productName}</p>
                    <p class="description">${product.categories}</p>
                    <p class="price">${formatNumber(parseInt(product.price))} đ</p>
                </div>
                <div class="dropCartItem">
                    <button type="button" class="dropCartItemBtn" onclick="removeFromCart(${parseInt(product.id)})"><i class="fas fa-x"></i></button>
                </div>
            </div>
        `
        cartContainer.appendChild(cartItem);
    });
}

// Remove an item from Cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let updatedCart = cart.filter(product => product.id != productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    loadCart();
    const cartItem = document.querySelector(`.product-item button[onclick="removeFromCart(${productId})"]`).closest('.product-item');
    if (cartItem) {
        cartItem.remove();
    }
}

// Count items in Cart
function countItemsInCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.length;
}

// Delete Cart
function clearCart() {
    localStorage.removeItem('cart');
}

window.onload = function() {
    loadCart();
};


























