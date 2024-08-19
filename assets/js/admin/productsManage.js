
// Products Methods
// Search products
document.addEventListener("DOMContentLoaded", function() {
    const searchBtn = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    if(searchBtn) {
        searchBtn.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');
            this.previousElementSibling.focus();


            const keyword = document.getElementById('searchInput').value.trim();

            if (keyword) {
                searchProductAndDisplay(keyword);
            }
    })

    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const keyword = searchInput.value;
            if (keyword) {
                searchProductAndDisplay(keyword);
            }
        }
    });

    } else {
        console.log("not found search button")
    }
})

function searchProductAndDisplay(keyword) {
    console.log(keyword);

    const searchInput = document.getElementById('searchInput');
                
    // Chuyển đổi keyword thành số nếu có thể
    const parsedKeyword = parseInt(keyword, 10);
    
    if (!isNaN(parsedKeyword)) {
        // Nếu parsedKeyword là số hợp lệ
        fetch(domain + `/api/v1/products/search/${parsedKeyword}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            showProductsInAdminPage(data);
            searchInput.value = ``;
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });

    } else {
        // Nếu keyword không phải là số
        fetch(domain + `/api/v1/products/search?keyword=${encodeURIComponent(keyword)}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            showProductsInAdminPage(data);
            searchInput.value = ``;
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
    }
}

// Show Products In Admin Page
function showProductsInAdminPage(products){
    const tbody = document.querySelector('#product-table tbody');
    tbody.innerHTML = '';

    products.forEach(product => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.productName}</td>
            <td>${formatNumber(product.productPrice)} đ</td>
            <td>${product.productDescription}</td>
            <td>${product.productQuantity}</td>
            <td>${product.brandName}, ${product.categories}</td>
            <td>${product.averageRating}</td>
            <td>
                <button class="productBtn-edit" onclick="editProduct(${product})">Sửa</button>
                <button class="productBtn-addImage" onclick="addProductImageBtn('${convertProductName(product.productName)}')">Thêm ảnh</button>
                <button class="productBtn-delete" onclick="deleteProduct(${product.id})">Xóa</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// Creare product and upload images
document.getElementById('addproductForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = document.getElementById('addproductForm');
    const formData = new FormData(form);

    let productQuantity = 0;
    for (let i = 0; i < detailCount; i++) {
        const quantity = parseInt(formData.get(`details[${i}].quantity`));
        if (!isNaN(quantity)) {
            productQuantity += quantity;
        }
    }
    const productImages = document.getElementById('productImages').files;
    const FirstImageFile = productImages[0];

    formData.set('productImage', '/img/products/' + convertProductName(formData.get('productName'))
                                    + "/" + `${convertProductName(formData.get('productName'))}_1.${FirstImageFile.name.split('.').pop()}`);
    formData.set('productQuantity', productQuantity);
    formData.set('reviewCount', 0);
    formData.set('averageRating', 0);

    const productDTO = {
        productName: formData.get('productName'),
        productDescription: formData.get('productDescription'),
        productImage: formData.get('productImage'),
        productPrice: parseFloat(formData.get('productPrice')),
        productQuantity: parseInt(productQuantity),
        productQuantitySold: 0,
        discountPercent: parseFloat(formData.get('discountPercent')),
        reviewCount: 0,
        averageRating: 0,
        brandName: formData.get('productBrandName'),
        categories: formData.get('categories').split(',').map(item => item.trim()),
        details: []
    };

    for (let i = 1; i < detailCount; i++) {
        const detail = {
            color: formData.get(`details[${i}].color`),
            size: parseInt(formData.get(`details[${i}].size`)),
            quantity: parseInt(formData.get(`details[${i}].quantity`)),
            quantitySold: 0,
        };
        productDTO.details.push(detail);
    }
    console.log(productDTO)

    fetch(domain + '/api/v1/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productDTO)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        alert("Tạo sản phẩm thành công!")
        return response.json();
    })
    .then(data => {
        uploadProductImages(productDTO.productName, "productImages");
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        alert('Đã xảy ra lỗi khi tạo sản phẩm: ' + error.message);
    });
});

async function uploadProductImages (productName, imageInputId) {
    const productImages = document.getElementById(imageInputId).files;

    if (productImages.length > 0) {
        const imageFormData = new FormData();
        imageFormData.append('productName', convertProductName(productName));
        for (let i = 0; i < productImages.length; i++) {
            const originalFile = productImages[i];
            const newFileName = `${convertProductName(productName)}_${i + 1}.${originalFile.name.split('.').pop()}`;
            const renamedFile = new File([originalFile], newFileName, { type: originalFile.type });
            console.log(newFileName)
            imageFormData.append('productImages', renamedFile);
        }

        fetch(domain + '/api/v1/products/uploadImages', {
            method: 'POST',
            body: imageFormData
        })
        .then(imageResponse => {
            if (!imageResponse.ok) {
                throw new Error('Network response was not ok ' + imageResponse.statusText);
            }
            alert("Tải ảnh sản phẩm thành công!")
            return imageResponse.text();
        })
        .then(imageData => {
            document.getElementById(imageInputId).value = '';
        })
        .catch(imageError => {
            console.error('There was a problem with your image upload operation:', imageError);
            alert('Đã xảy ra lỗi khi tải lên hình ảnh: ' + imageError.message);
        });
    } else {
        console.log("Không có hình ảnh nào được tải lên!");
        alert("Không có hình ảnh nào được tải lên!")
    }
}

async function addProductImageBtn(productName) {
    console.log(productName);
    const addProductImageContainer = document.getElementById('addProductImage-container');
    addProductImageContainer.style.display = "flex";

    document.getElementById('addImage_submit').addEventListener('click', function() {
        uploadProductImages (productName, "addProductImages");
    })
}

function cancelAddImages() {
    const addProductImageContainer = document.getElementById('addProductImage-container');
    addProductImageContainer.style.display = "none";
}

function editProduct() {

}

async function nonfilterProducts() {
    const products = await fetchProductsWithDetails();
    showProductsInAdminPage(products);

} 

// Delete product
async function deleteProduct(id) {
    if(confirm("Bạn có chắc muốn xóa sản phẩm?")) {
        const response = await fetch(domain + `/api/v1/products/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            const products = await fetchProductsWithDetails();
            showProductsInAdminPage(products);
        } else {
            console.error('Failed to delete product');
        }
    } else {
        return
    }
}

function validateAddProductForm() {
    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = document.getElementById('productPrice').value;
    const productBrandName = document.getElementById('productBrandName').value;
    const categories = document.getElementById('categories').value;
    const productImages = document.getElementById('productImages').files;

    if (productName.trim() === "") {
        alert("Vui lòng nhập tên sản phẩm.");
        return false;
    }

    if (productDescription.trim() === "") {
        alert("Vui lòng nhập mô tả sản phẩm.");
        return false;
    }

    if (productPrice.trim() === "" || parseFloat(productPrice) <= 0) {
        alert("Vui lòng nhập giá sản phẩm hợp lệ.");
        return false;
    }

    if (productBrandName.trim() === "") {
        alert("Vui lòng nhập thương hiệu sản phẩm.");
        return false;
    }

    if (categories.trim() !== "" && !categories.split(',').every(cat => cat.trim() !== "")) {
        alert("Vui lòng nhập các danh mục hợp lệ (không để trống giữa các dấu phẩy).");
        return false;
    }

    if (productImages.length === 0) {
        alert("Vui lòng tải lên ít nhất một hình ảnh cho sản phẩm.");
        return false;
    }

    return true; // Allow form submission
}

let detailCount = 1;

function addDetail() {
    const detailsDiv = document.getElementById('productDetails');
    const newDetail = document.createElement('div');
    newDetail.classList.add('productDetail');
    newDetail.innerHTML = `
        <label for="detailColor${detailCount}">Màu Sắc:</label>
        <input type="text" id="detailColor${detailCount}" name="details[${detailCount}].color" required>

        <label for="detailSize${detailCount}">Kích Thước:</label>
        <input type="number" id="detailSize${detailCount}" name="details[${detailCount}].size" required>

        <label for="detailQuantity${detailCount}">Số Lượng:</label>
        <input type="number" id="detailQuantity${detailCount}" name="details[${detailCount}].quantity" required> 

        <button type="button" onclick="cancelAddDetail(this)">Hủy</button>
    `;
    detailsDiv.appendChild(newDetail);
    detailCount++;
}

function cancelAddDetail(button) {
    const detailDiv = button.parentElement;
    detailDiv.remove();
    detailCount--;
}