// Fetching products data
async function fetchProducts() {
    try {
        var notification = document.getElementById('notification');
        notification.style.display = 'flex';

        let productsInStorage = JSON.parse(localStorage.getItem('products')) || [];
        if(productsInStorage.length != 0) {
            notification.style.display = 'none';
            return productsInStorage;
        } else {
            const loader = document.getElementById('loader');
            loader.style.display = 'block';

            const response = await fetch(domain + '/api/v1/products');
            const products = await response.json();
            

            products.forEach(product => {
                price = product.productPrice * (100 - product.discountPercent) / 100;

                addProductToLocalStorage({ id: `${product.id}`, productName: `${product.productName}`, 
                                            price: `${price}`, productPrice: `${product.productPrice}`,
                                            discountPercent: `${product.discountPercent}`, 
                                            categories: `${product.categories}`, brandName: `${product.brandName}`, 
                                            productImage: `${product.productImage}`})
            })
            loader.style.display = 'none';
            notification.style.display = 'none';

            return products;
        }

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Fetching TOP products
async function fetchTopProducts() {
    try {
        // clearProductsInLocalStorage() 
        // clearTopProductsInLocalStorage()

        var notification = document.getElementById('notification');
        notification.style.display = 'flex';

        let TopProductsInStorage = JSON.parse(localStorage.getItem('topProducts')) || [];
        if(TopProductsInStorage.length != 0) {
            notification.style.display = 'none';
            return TopProductsInStorage;
        } else {
            const loader = document.getElementById('loader');
            loader.style.display = 'block';

            const response = await fetch(domain + '/api/v1/products/topproducts');
            const products = await response.json();

            products.forEach(product => {
                price = product.productPrice * (100 - product.discountPercent) / 100;

                addTopProductToLocalStorage({ id: `${product.id}`, productName: `${product.productName}`, 
                                            price: `${price}`, productPrice: `${product.productPrice}`, 
                                            discountPercent: `${product.discountPercent}`, 
                                            categories: `${product.categories}`, brandName: `${product.brandName}`,
                                            productImage: `${product.productImage}`})
            })
            loader.style.display = 'none';
            notification.style.display = 'none';

            return products;
        }

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function fetchProductsWithDetails() {
    try {
        let productsWithDetailsInStorage = JSON.parse(localStorage.getItem('productsWithDetails')) || [];
        if(productsWithDetailsInStorage.length != 0) {
            return productsWithDetailsInStorage;
        } else {
            const loader = document.getElementById('loader');
            loader.style.display = 'block';

            const response = await fetch(domain + '/api/v1/products/withdetails');
            const products = await response.json();
            

            products.forEach(product => {
                price = product.productPrice * (100 - product.discountPercent) / 100;

                addProductWithDetailToLocalStorage({ id: `${product.id}`, productName: `${product.productName}`, 
                                            price: `${price}`, productPrice: `${product.productPrice}`,
                                            discountPercent: `${product.discountPercent}`, 
                                            categories: `${product.categories}`, brandName: `${product.brandName}`, 
                                            productImage: `${product.productImage}`})
            })
            loader.style.display = 'none';

            return products;
        }

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function addProductToLocalStorage(product) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
}

function addTopProductToLocalStorage(topProduct) {
    let products = JSON.parse(localStorage.getItem('topProducts')) || [];
    products.push(topProduct);
    localStorage.setItem('topProducts', JSON.stringify(products));
}

function addProductWithDetailToLocalStorage(product) {
    let products = JSON.parse(localStorage.getItem('productsWithDetails')) || [];
    products.push(product);
    localStorage.setItem('productsWithDetails', JSON.stringify(products));
}

function clearProductsWithDetailsInLocalStorage() {
    localStorage.removeItem('productsWithDetails');
}

function clearProductsInLocalStorage() {
    localStorage.removeItem('products');
}

function clearTopProductsInLocalStorage() {
    localStorage.removeItem('topProducts');
}

// Minor functions

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

function formatNumber(number) {
    return number.toLocaleString('vi-VN');
}