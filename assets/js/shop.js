
document.addEventListener("DOMContentLoaded", async function() {
    insertPlaceholders('#products-container', 12);

    function insertPlaceholders(selector, count) {
        const container = document.querySelector(selector);
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            container.innerHTML += `<div class="product-item-placeholder"></div>`;
        }
    }

    const products = await fetchProducts();

    // Đọc tham số URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const sortBy = urlParams.get('sort');

    let filteredProducts = products;

    // Lọc sản phẩm theo danh mục nếu có
    if (category) {
        filteredProducts = products.filter(product => product.categories.includes(category) || product.brandName === category);
    }

    // Sắp xếp sản phẩm nếu có tham số sort
    if (sortBy) {
        filteredProducts = sortProducts(filteredProducts, sortBy);
    }

    await showProductsInShopPage(filteredProducts);

    const categoryItems = document.querySelectorAll('.category-item a');
    categoryItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const category = this.getAttribute('data-category');
            const filteredProducts = products.filter(product => product.categories.includes(category) || product.brandName === category);
            showProductsInShopPage(filteredProducts);
        });
    });

    const sortSelect = document.getElementById('sort');
    sortSelect.addEventListener('change', function() {
        const sortedProducts = sortProducts(filteredProducts, this.value);
        showProductsInShopPage(sortedProducts);
    });

    // Search products
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('keyword');

    if (keyword) {
        seachProductsAndShow(keyword);
    }

    const searchBtn = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    if(searchBtn) {
        searchBtn.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');
            this.previousElementSibling.focus();

            const keyword = document.getElementById('searchInput').value;

            if (keyword) {
                console.log(keyword);
                seachProductsAndShow(keyword);
            }
        })

        searchInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') { 
                event.preventDefault(); 
                const keyword = searchInput.value;
                if (keyword) {
                    seachProductsAndShow(keyword);
                }
            }
        });

    } else {
        console.log("not found search button")
    }

    changeCategoryMenu()
});

function seachProductsAndShow(keyword) {
    fetch(domain + `/api/v1/products/search?keyword=${encodeURIComponent(keyword)}`)
    .then(response => response.json())
    .then(data => {
        showProductsInShopPage(data);
        searchInput.value = ``;
    })
    .catch(error => {
        console.error('Error fetching products:', error);
    });
    
}

// Show Products In Shop Page
async function showProductsInShopPage(products){
    const productsContainer = document.querySelector('.main #products-container');
    productsContainer.innerHTML = '';

    if(products.length == 0) {
        productsContainer.innerHTML = 'Không có sản phẩm nào liên quan mà bạn đang tìm kiếm';
    }

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');

        price = product.productPrice * (100 - product.discountPercent) / 100;

        // Link ảnh tượng trưng
        productItem.innerHTML = `
            <a href="/products.html?${convertProductName(product.productName)}&id=${product.id}">
                <img alt="${product.productName}" src="${imageBaseURL + product.productImage}">
                <p class="product-name">${product.productName}</p>
                <p class="description">${product.categories}</p>
                <p class="price">${formatNumber(price)} đ 
                    <span class="originPrice" style="text-decoration: line-through;">${formatNumber(product.productPrice)} đ</span>
                </p>
            </a>
        `;

        productsContainer.appendChild(productItem);
    });
    document.getElementById('productsCount').innerHTML = `Hiển thị ${products.length} sản phẩm`;
}

function sortProducts(products, sortBy) {
    switch (sortBy) {
        case 'low-to-high':
            return products.sort((a, b) => a.productPrice - b.productPrice);
        case 'high-to-low':
            return products.sort((a, b) => b.productPrice - a.productPrice);
        case 'popularity':
            return products.sort((a, b) => {
                if (b.averageRating === a.averageRating) {
                    return b.productPrice - a.productPrice;
                }
                return b.averageRating - a.averageRating;
            });
        default:
            return products;
    }
}

async function filterProducts() {
    const products = await fetchProducts();

    const minAmount = document.getElementById('minAmount').value;
    const maxAmount = document.getElementById('maxAmount').value;


    const filteredProducts = products.filter(product => {
        price = product.productPrice * (100 - product.discountPercent) / 100;

        const min = minAmount ? parseFloat(minAmount) : null;
        const max = maxAmount ? parseFloat(maxAmount) : null;

        return (!min || price >= min) &&
               (!max || price <= max);
    });

    showProductsInShopPage(filteredProducts);
}

async function showAllProducts() {
    const products = await fetchProducts();

    const minAmount = document.getElementById('minAmount');
    const maxAmount = document.getElementById('maxAmount');

    minAmount.value = ``;
    maxAmount.value = ``;

    showProductsInShopPage(products);
}

function changeCategoryMenu() {
    const userAgent = navigator.userAgent;
        
    if (/mobile/i.test(userAgent)) {
        const categoryMenu = document.querySelector('.main .brand-category');
        categoryMenu.innerHTML = ``;

        categoryMenu.innerHTML = `
            <div class="d-lg-none">
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCategoryMenu" aria-controls="offcanvasCategoryMenu">
                    <img class="navbar-toggler-icon" src="../assets/img/logo/menu-bar.png">
                    Danh mục sản phẩm
                </button>
            </div>

            <!-- Offcanvas menu for mobile -->
            <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasCategoryMenu" aria-labelledby="offcanvasCategoryMenuLabel">
                <div class="offcanvas-header" style="margin-top:15%;">
                    <h5 class="offcanvas-title" id="offcanvasCategoryMenuLabel">Danh mục sản phẩm</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <ul>
                <li class="category-item" onclick="showAllProducts()" style="cursor: pointer;">Tất Cả</li>
                <li class="category-item"><a href="#" data-category="Adidas">Adidas</a></li>
                <li class="category-item"><a href="#" data-category="Nike">Nike</a></li>
                <li class="category-item"><a href="#" data-category="Biti's">Biti's</a></li>
                <li class="category-item"><a href="#" data-category="Puma">Puma</a></li>
                <li class="category-item"><a href="#" data-category="Vans">Vans</a></li>
                <li class="category-item"><a href="#" data-category="Converse">Converse</a></li>
                <li class="category-item"><a href="#" data-category="Louis Vuitton">Louis Vuitton</a></li>
                <li class="category-item"><a href="#" data-category="New Balance">New Balance</a></li>
                <li class="category-item"><a href="#" data-category="Thể Thao">Thể Thao</a></li>
                <li class="category-item"><a href="#" data-category="Giày Nam">Giày Nam</a></li>
                <li class="category-item"><a href="#" data-category="Giày Nữ">Giày Nữ</a></li>
                <li class="category-item"><a href="#" data-category="Giày Cao Gót">Giày Cao Gót</a></li>
                <li class="category-item"><a href="#" data-category="Giày Da">Giày Da</a></li>
                <li class="category-item"><a href="#" data-category="Dép">Dép</a></li>
                <li class="category-item"><a href="#" data-category="HangKhac">Hãng khác</a></li>
            </ul>
            </div>
        `;

    }
}