let currentReviewIndex = 1;
showReview(currentReviewIndex);

// Hiển thị review hiện tại
function showReview(n) {
    let reviews = document.querySelectorAll('.review');
    let dots = document.querySelectorAll('.dot');

    if (n > reviews.length) {
        currentReviewIndex = 1;
    }
    if (n < 1) {
        currentReviewIndex = reviews.length;
    }

    // Ẩn tất cả các review
    reviews.forEach((review) => {
        review.style.display = 'none';
        review.classList.remove('active');
    });

    // Bỏ kích hoạt tất cả các dot
    dots.forEach((dot) => {
        dot.classList.remove('active');
    });

    // Hiển thị review hiện tại và kích hoạt dot tương ứng
    reviews[currentReviewIndex - 1].style.display = 'block';
    reviews[currentReviewIndex - 1].classList.add('active');
    dots[currentReviewIndex - 1].classList.add('active');
}

// Chuyển đến review tiếp theo
function nextReview() {
    showReview(currentReviewIndex += 1);
}

// Quay về review trước đó
function prevReview() {
    showReview(currentReviewIndex -= 1);
}

// Đặt review hiện tại theo dot
function currentReview(n) {
    showReview(currentReviewIndex = n);
}
