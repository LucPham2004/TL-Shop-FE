document.addEventListener("DOMContentLoaded", function() {
    const searchBtn = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');
            searchInput.focus();

            const keyword = searchInput.value;
            if (keyword) {
                window.location.href = `/shop.html?keyword=${encodeURIComponent(keyword)}`;
            }
        });

        // Lắng nghe sự kiện khi nhấn phím trên ô nhập liệu
        searchInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') { 
                event.preventDefault();
                const keyword = searchInput.value;
                if (keyword) {
                    window.location.href = `/shop.html?keyword=${encodeURIComponent(keyword)}`;
                }
            }
        });
    } else {
        console.log("not found search button or search input");
    }
});

