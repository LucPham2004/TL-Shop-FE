
document.addEventListener("DOMContentLoaded", function() {
    displayProducts();
    showHomepageImages();

    

});

// Display products in homepage
async function displayProducts() {

    function insertPlaceholders(selector, count) {
        const container = document.querySelector(selector);
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            container.innerHTML += `<div class="product-item-placeholder"></div>`;
        }
    }

    insertPlaceholders('.top-seller-products', 12);
    insertPlaceholders('.onSale-products', 12);

    const products = await fetchTopProducts();

    if(products) {
        const topSellerProducts = products.slice(0, 12);
        const onSaleProducts = products.slice(24, 36);

    function createProductHTML(product) {
        price = product.productPrice * (100 - product.discountPercent) / 100;
        return `
            <div class="product-item">
                <a href="/products.html?${convertProductName(product.productName)}&id=${product.id}">
                    <img alt="${product.productName}" src="${imageBaseURL + product.productImage}">
                    <p class="product-name">${product.productName}</p>
                    <p class="description">${product.categories}</p>
                    <p class="price">${formatNumber(price)} đ
                        <span class="originPrice" style="text-decoration: line-through;">${formatNumber(product.productPrice)} đ</span>
                    </p>
                </a>
                <div class="product-tip" id="product-tip">
                    <a href="shop.html?category=${product.categories}">
                        <button id="seeMoreBtn" type="button">
                            <i class="fas fa-shopping-cart" style="font-size: 20px;"></i> Xem sản phẩm tương tự
                        </button>
                    </a>
                </div>
                <div class="discount-banner">${product.discountPercent}% OFF</div>
            </div>
        `;
    }

    function insertProducts(selector, products) {
        const container = document.querySelector(selector);
        container.innerHTML = products.map(createProductHTML).join('');
    }

    insertProducts('.top-seller-products', topSellerProducts);
    insertProducts('.onSale-products', onSaleProducts);
    
    const items = document.querySelectorAll('.product-item');
    const productTips = document.querySelectorAll('.product-tip');

    items.forEach((item, index) => {
        const productTip = productTips[index];
        
        item.addEventListener('mouseenter', (e) => {
            productTip.style.display = 'block';
        });

        item.addEventListener('mouseleave', () => {
            productTip.style.display = 'none';
        });
    });
    } else {
        console.log('No products found.');
    }

}


