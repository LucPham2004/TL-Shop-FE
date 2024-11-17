

// Display Product Infomation
document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    
    if (productId) {
        fetch(domain + "/api/v1/products/" + productId)
        .then(response => {
            if (!response.ok) {
                throw new Error('Product not found');
            }
            return response.json();
        })
        .then(product => {
            console.log(product);

            price = product.productPrice * (100 - product.discountPercent) / 100;

            document.querySelector(".main-container .product-name").textContent = product.productName;
            document.querySelector(".main-container .Type").textContent = product.categories;
            document.querySelector(".main-container .avgRating .rating").textContent = product.averageRating ;
            document.querySelector(".main-container .productReview .reviewCount").textContent = product.reviewCount + " đánh giá";
            document.querySelector(".main-container .price").textContent = formatNumber(price) + " đ";
            document.querySelector(".main-container .originPrice").textContent = formatNumber(product.productPrice) + " đ";
            document.querySelector(".main-container .description").innerHTML = `
                <div class="col-md-12">
            <h1 class="product-name">${product.productName}</h1>
            <p class="product-description">
                ${product.productName} là dòng giày chạy bộ cao cấp, nổi tiếng với sự thoải mái và hỗ trợ tối đa cho người dùng. Thiết kế của ${product.productName} không chỉ phù hợp cho việc chạy bộ mà còn rất phong cách, dễ dàng phối hợp với nhiều loại trang phục thường ngày.
            </p>
            <h3>Đặc điểm nổi bật</h3>
            <ul>
                <li>Công nghệ Boost: Đệm trả lại năng lượng tối ưu trong mỗi bước chạy.</li>
                <li>Primeknit Upper: Chất liệu mềm mại, ôm sát bàn chân nhưng vẫn thoáng khí.</li>
                <li>Thiết kế gót chân 3D: Giúp giữ chắc gót và tăng độ ổn định.</li>
                <li>Tấm Torsion: Hỗ trợ chuyển động linh hoạt và tự nhiên hơn.</li>
                <li>Đế cao su Continental™: Bám tốt ngay cả trên bề mặt ẩm ướt.</li>
            </ul>
            <h3>Thông số kỹ thuật</h3>
            <ul>
                <li>Trọng lượng: 333g (size US 9)</li>
                <li>Chiều cao đệm gót: 32mm</li>
                <li>Chiều cao đệm mũi: 22mm</li>
                <li>Chênh lệch độ cao gót - mũi giày: 10mm</li>
                <li>Chất liệu: Primeknit, Boost, cao su Continental™</li>
            </ul>
            <h3>Màu sắc</h3>
            <ul>
                <li>Trắng</li>
                <li>Đen</li>
                <li>Xanh dương</li>
                <li>Đen và cam</li>
            </ul>
            <h3>Đánh giá</h3>
            <p class="avgRating">4.8/5 từ hơn 400 đánh giá</p>
            <ul>
                <li>Rất thoải mái khi chạy bộ đường dài.</li>
                <li>Thiết kế đẹp, thời trang, dễ dàng kết hợp với quần áo hàng ngày.</li>
                <li>Chất liệu thân thiện với môi trường.</li>
            </ul>
            <h3>Kích cỡ</h3>
            <ul>
                <li>Size từ 36 đến 46</li>
            </ul>
            <h3>Sử dụng</h3>
            <p>Phù hợp cho các hoạt động thể thao, đặc biệt là chạy bộ đường dài, cũng có thể sử dụng hàng ngày với phong cách năng động.</p>
        </div>
            `;

            const colorSelect = document.getElementById('color');
            const sizeSelect = document.getElementById('size');

            colorSelect.innerHTML = '';
            sizeSelect.innerHTML = '';

            let colors = new Set();
            product.details.forEach(detail => {
                colors.add(detail.color);
            });

            colors.forEach(color => {
                let option = document.createElement('option');
                option.value = color;
                option.textContent = color;
                colorSelect.appendChild(option);
            });

            const updateSizeOptions = (selectedColor) => {
                sizeSelect.innerHTML = '';
                let sizes = new Set();
                product.details.forEach(detail => {
                    if (detail.color === selectedColor) {
                        sizes.add(detail.size);
                    }
                });
                sizes.forEach(size => {
                    let option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    sizeSelect.appendChild(option);
                });
            };

            if (colorSelect.value) {
                updateSizeOptions(colorSelect.value);
            }

            colorSelect.addEventListener('change', (event) => {
                updateSizeOptions(event.target.value);
            });

            showProductImages(product.productImage);
        })
        .catch(error => {
            document.querySelector(".main-container").textContent = "Server có thể đã dừng hoạt động. Mong quý khách thông cảm";
            console.log(error);
        });
    } else {
        document.querySelector(".main-container").textContent = "Không tìm thấy sản phẩm";
    }
});

// Display Similar products
document.addEventListener('DOMContentLoaded', () => {
    fetch(domain + '/api/v1/products')
        .then(response => response.json())
        .then(data => {
            const similarProductsTop = document.getElementById('similar-products-top');
            const carouselInner = document.getElementById('carousel-inner');
            let topProductsHTML = '';

            const firstCarouselItem = carouselInner.querySelector('.carousel-item:nth-child(1)');
            const secondCarouselItem = carouselInner.querySelector('.carousel-item:nth-child(2)');

            let carouselItemInnerContainer1 = document.createElement('div');
            carouselItemInnerContainer1.classList.add('carousel-item-innerContainer');

            let carouselItemInnerContainer2 = document.createElement('div');
            carouselItemInnerContainer2.classList.add('carousel-item-innerContainer');

            data.forEach((product, index) => {
                // Tạo một div mới để chứa thông tin sản phẩm
                let productContainer = document.createElement('div');
                productContainer.classList.add('similar-item');

                price = product.productPrice * (100 - product.discountPercent) / 100;

                // Thiết lập nội dung cho sản phẩm
                productContainer.innerHTML = `
                    <a href="/products.html?${convertProductName(product.productName)}&id=${product.id}">
                        <img alt="Giày similar" src="${imageBaseURL + product.productImage}">
                        <p class="product-name">${product.productName}</p>
                        <p class="description">${product.productDescription}</p>
                        <p class="price">${formatNumber(price)} đ
                            <span class="originPrice" style="text-decoration: line-through;">${formatNumber(product.productPrice)} đ</span>
                        </p>
                    </a>
                    <div class="product-tip" id="product-tip">
                        <a href="shop.html?category=${product.categories}">
                            <button id="similarBtn" type="button">
                                <i class="fas fa-shopping-cart" style="font-size: 20px;"></i> Xem sản phẩm tương tự
                            </button>
                        </a>
                    </div>
                `;

                if (index < 4) {
                    topProductsHTML += productContainer.outerHTML;
                } else if (index >= 4 && index < 8) {
                    carouselItemInnerContainer1.appendChild(productContainer);
                } else if (index >= 8 && index < 12) {
                    carouselItemInnerContainer2.appendChild(productContainer);
                }
            });

            similarProductsTop.innerHTML = topProductsHTML;
            firstCarouselItem.appendChild(carouselItemInnerContainer1);
            secondCarouselItem.appendChild(carouselItemInnerContainer2);
            
            
            const items = document.querySelectorAll('.similar-item');
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

        })
        .catch(error => console.log('Error fetching products:', error));
});

function showProductImages(productImage) {
    const picsDiv = document.querySelector('.pics');
    
    const underscoreIndex = productImage.lastIndexOf('_');
    const baseImagePath = productImage.substring(0, underscoreIndex + 1);
    const extensionIndex = productImage.lastIndexOf('.');
    const imageExtension = productImage.substring(extensionIndex);
    
    for (let i = 1; i <= 8; i++) {
        const img = document.createElement('img');
        img.src = `${imageBaseURL + baseImagePath}${i}${imageExtension}`;
        img.alt = `product image`
        picsDiv.appendChild(img);
    }
}

// New Review Form
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    displayReviews(productId);
    const customerId = getCustomerId();
    const reviewForm = document.getElementById('reviewForm');

    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if(!customerId) {
            alert("Quý khách vui lòng đăng nhập tài khoản!");
            window.location.href = "/login.html";
        }

        const reviewTitle = document.getElementById('reviewTitle').value;
        const rating = document.getElementById('rating').value;
        const comment = document.getElementById('comment').value;

        if(!validateReviewForm()) {
            return;
        }

        const reviewData = {
            reviewTitle: reviewTitle,
            reviewContent: comment,
            reviewDate: new Date(),
            reviewRating: parseInt(rating),
            productId: parseInt(productId),
            customerId: customerId
        }
        console.log(reviewData);
        
        try {
            const response = fetch(domain + '/api/v1/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });

            reviewForm.reset();
            
            window.alert('Đánh giá thành công!');
            displayReviews();

        } catch (error) {
            console.log('Error while creating review: ' + error);
        }
        
    });
});

// Display Reviews
async function displayReviews(productId) {
    try {
        const response = await fetch(domain + '/api/v1/reviews/product/' + parseInt(productId));
        const reviews = await response.json();

        const reviewContainer = document.querySelector('#collapseReview .card-body');
        reviewContainer.innerHTML = '';

        if(reviews.length == 0) {
            reviewContainer.innerHTML = 'Chưa có bình luận, đánh giá nào về sản phẩm này.'
        } else {
            reviews.forEach(review => {
                const reviewItem = document.createElement('div');
                reviewItem.classList.add(`review-item-${review.id}`);
        
                reviewItem.innerHTML = `
                    <div class="review-info">
                        <img class="user-icon" alt="user-icon" src="../assets/img/logo/user.png">
                        <p class="customer-name">${review.customerName}</p>
                        <p class="review-date">${extractDate(review.reviewDate)}</p>
                        <p class="star" data-rating=${review.reviewRating}>${displayStars(review.reviewRating)}</p>
                        <span class="editReview" onclick="editReview(${review.id})">Sửa</span>
                        <span class="deleteReview" onclick="deleteReview(${review.id})">Xóa</span>
                    </div>
                    <div>
                        <h6 class="review-title">${review.reviewTitle}</h6>
                        <p class="review-content">${review.reviewContent}</p>
                    </div>
                    <div style="display: flex;justify-content:center;"><hr style="width:80%;"></div>
                `;

                reviewContainer.appendChild(reviewItem);
            });
        }

    } catch (error) {
        const reviewContainer = document.querySelector('#collapseReview .card-body');
        reviewContainer.innerHTML = '';
        reviewContainer.innerHTML = 'Chưa có bình luận, đánh giá nào về sản phẩm này.'
        console.log('Error fetching reviews:', error);
    }
}

let originalReviewContent = {};

// Edit Review
function editReview(reviewId) {
    const reviewItem = document.querySelector(`.review-item-${reviewId}`);

    if (!reviewItem) {
        console.log(`Review item with ID ${reviewId} not found`);
        return;
    }
    
    originalReviewContent[reviewId] = reviewItem.innerHTML;

    const reviewTitle = reviewItem.querySelector('.review-title').innerText;
    const reviewContent = reviewItem.querySelector('.review-content').innerText;
    const reviewRating = reviewItem.querySelector('.star').getAttribute('data-rating');

    reviewItem.innerHTML = `
        <div class="review-info">
            <img class="user-icon" alt="user-icon" src="../assets/img/logo/user.png">
            <p class="customer-name">${reviewItem.querySelector('.customer-name').innerText}</p>
            <p class="review-date">${reviewItem.querySelector('.review-date').innerText}</p>
            <select id="rating" required>
                <option value="5">5★</option>
                <option value="4">4★</option>
                <option value="3">3★</option>
                <option value="2">2★</option>
                <option value="1">1★</option>
            </select>
        </div>
        <div>
            <input type="text" class="review-title" value="${reviewTitle}">
            <textarea class="review-content">${reviewContent}</textarea>
            <button class="saveReview" onclick="saveReview(${reviewId})">Lưu</button>
            <button class="cancelEditReview" onclick="cancelEditReview(${reviewId})">Hủy</button>
        </div>
        <div style="display: flex;justify-content:center;"><hr style="width:80%;"></div>
    `;
}

function cancelEditReview(reviewId) {
    const reviewItem = document.querySelector(`.review-item-${reviewId}`);
    
    if (!reviewItem) {
        console.log(`Review item with ID ${reviewId} not found`);
        return;
    }

    // Restore the original content
    reviewItem.innerHTML = originalReviewContent[reviewId];
}

// Save edited review
function saveReview(reviewId) {
    const reviewItem = document.querySelector(`.review-item-${reviewId}`);
    const updatedReview = {
        id: reviewId,
        reviewDate: reviewItem.querySelector('.review-date').innerText,
        reviewRating: reviewItem.querySelector('.star').value,
        reviewTitle: reviewItem.querySelector('.review-title').value,
        reviewContent: reviewItem.querySelector('.review-content').value
    };
    try {
        fetch(domain + '/api/v1/reviews', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedReview)
        })
            alert('Cập nhật đánh giá thành công!');
            window.location.reload();
            
    } catch(error) {
        console.log('Error:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
    };
}

// Delete review
async function deleteReview(id) {
    if(confirm("Bạn có chắc muốn xóa bình luận đánh giá này?")) {
        const response = await fetch(domain + `/api/v1/reviews/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            location.reload();
        } else {
            console.log('Failed to delete product');
        }
    } else {
        return
    }
}

function validateReviewForm() {
    const reviewTitle = document.getElementById('reviewTitle').value;
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;

    if (reviewTitle.trim() === "") {
        alert("Vui lòng nhập tiêu đề đánh giá.");
        return false;
    }

    if (!rating) {
        alert("Vui lòng chọn đánh giá.");
        return false;
    }

    if (comment.trim() === "") {
        alert("Vui lòng nhập bình luận.");
        return false;
    }

    return true; // Allow form submission
}

// Small helping functions
document.getElementById('increase').addEventListener('click', function() {
    const quantityInput = document.getElementById('quantity');
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
});

document.getElementById('decrease').addEventListener('click', function() {
    const quantityInput = document.getElementById('quantity');
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
});


function displayStars(rating) {
    let stars = "";

    for (let i = 0; i < rating; i++) {
        stars += "★";
    }

    for (let i = rating; i < 5; i++) {
        stars += "☆";
    }

    return stars;
}
