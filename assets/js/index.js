
document.addEventListener("DOMContentLoaded", function() {
    displayProducts();
    showHomepageImages();

    
    const productImages = document.querySelectorAll('.product-item img');
    productImages.forEach((img) => {
        const originSrc = img.src;
        const hoverSrc = createHoverSrc(originSrc);
        applyFadeEffect(img, hoverSrc, originSrc);
    });

});

// Display products in homepage
async function displayProducts() {
    insertPlaceholders('.top-seller-products', 12);
    insertPlaceholders('.favorite-products', 12);
    insertPlaceholders('.onSale-products', 12);
    insertPlaceholders('.feature-products', 12);

    const products = await fetchTopProducts();

    const topSellerProducts = products.slice(0, 12);
    const favoriteProducts = products.slice(12, 24);
    const onSaleProducts = products.slice(24, 36);
    const featureProducts = products.slice(36, 48);

    

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
            </div>
        `;
    }

    function insertProducts(selector, products) {
        const container = document.querySelector(selector);
        container.innerHTML = products.map(createProductHTML).join('');
    }

    function insertPlaceholders(selector, count) {
        const container = document.querySelector(selector);
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            container.innerHTML += `<div class="product-item-placeholder"></div>`;
        }
    }

    insertProducts('.top-seller-products', topSellerProducts);
    insertProducts('.favorite-products', favoriteProducts);
    insertProducts('.onSale-products', onSaleProducts);
    insertProducts('.feature-products', featureProducts);
}

// Effect for product images
function applyFadeEffect(imgElement, hoverSrc, originSrc) {
    imgElement.addEventListener('mouseover', function () {
        imgElement.classList.add('fade-out');
        setTimeout(() => {
            imgElement.src = hoverSrc;
            imgElement.classList.remove('fade-out');
        }, 200); 
    });

    imgElement.addEventListener('mouseout', function () {
        imgElement.classList.add('fade-out');
        setTimeout(() => {
            imgElement.src = originSrc;
            imgElement.classList.remove('fade-out');
        }, 200); 
    });
}

function createHoverSrc(originSrc) {
    const extensionIndex = originSrc.lastIndexOf('.');
    if (extensionIndex !== -1) {
        let fileName = originSrc.slice(0, extensionIndex);
        fileName = fileName.replace(/_1$/, '_2');
        return fileName + originSrc.slice(extensionIndex);
    }
    return originSrc;
}

