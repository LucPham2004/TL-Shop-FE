
const imageBaseURL = "https://github.com/LucPham2004/TL-Shop/raw/main/Shoe_Store/src/main/resources/static";
// Show shop data from server
document.addEventListener("DOMContentLoaded", async function() {
    const loginCheck = checkLogin();
    if(loginCheck == false) {
        console.log("loginCheck = false")
    }

    const products = await fetchProducts();
    showProductsInAdminPage(products);

    const brands = await fetchBrandData();
    showBrandsInAdminPage(brands);

    const categories = await fetchCategoryData();
    showCategoriesInAdminPage(categories);

    const customers = await fetchCustomers();
    showCustomersInAdminPage(customers);

    await displaySummaryData();
    await displayOrders_Customers_Products_Summary();
});

async function fethSummary() {
    try {
        const response = await fetch(domain + `/api/v1/admin/dashboard`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
        
    } catch (error) {
        console.error('Error fetching summary:', error);
    }
}

async function displayOrders_Customers_Products_Summary() {
    const data = await fethSummary();
    console.log(data);
    
    const listorders = document.querySelectorAll('#orders-summary li');

    listorders[0].innerText = `Tổng đơn hàng: ${data.totalOrders}`;
    listorders[1].innerText = `Đơn hàng đang xử lý: ${data.processingOrdersCount}`;
    listorders[2].innerText = `Đơn hàng đang vận chuyển: ${data.shippingOrdersCount}`;
    listorders[3].innerText = `Đơn hàng hoàn thành: ${data.deliveredOrdersCount}`;
    listorders[4].innerText = `Đơn hàng đã hủy: ${data.cancelledOrdersCount}`;

    const listcustomers = document.querySelectorAll('#customers-summary li');

    listcustomers[0].innerText = `Tổng khách hàng: ${data.totalCustomers}`;
    listcustomers[1].innerText = `Tài khoản được kích khoạt: ${data.enabledCustomersCount}`;
    listcustomers[2].innerText = `Tài khoản không bị khóa: ${data.nonLockedCustomersCount}`;
    listcustomers[3].innerText = `Tài khoản bị vô hiệu hóa: ${data.disabledCustomersCount}`;
    listcustomers[4].innerText = `Tài khoản bị khóa: ${data.lockedCustomersCount}`;

    const listproducts = document.querySelectorAll('#products-summary li');

    listproducts[0].innerText = `Tổng sản phẩm: ${data.totalProducts}`;
    listproducts[1].innerText = `Tổng Thương hiệu: ${data.totalBrands}`;
    listproducts[2].innerText = `Tổng Danh mục sản phẩm: ${data.totalCategories}`;
    listproducts[3].innerText = `Sản phẩm được kích khoạt: ${data.enabledProductsCount}`;
    listproducts[4].innerText = `Sản phẩm đã được đánh giá: ${data.reviewedProductsCount}`;
    listproducts[5].innerText = `Sản phẩm bị vô hiệu hóa: ${data.disabledProductsCount}`;

}

async function displaySummaryData() {
    const data = await fethSummary();

    document.getElementById('totalRevenue').innerText = `${data.totalRevenue.toLocaleString()} đ`;

    // Populate new customers
    const newCustomersTable = document.getElementById('newCustomers');
    data.new_customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.address || 'N/A'}</td>
            <td><span class="tag tag-success">${customer.phone}</span></td>
        `;
        newCustomersTable.appendChild(row);
    });

    document.getElementById('totalCustomers').innerHTML = `<b>${data.totalCustomers} khách hàng</b>`;

    document.getElementById('totalProducts').innerHTML = `<b>${data.totalProducts} sản phẩm</b>`;

    document.getElementById('totalOrders').innerHTML = `<b>${data.totalOrders} đơn hàng</b>`;

    document.getElementById('lowStock').innerHTML = `<b>${data.lowRemainingProducts.length} sản phẩm</b>`;

    // Populate order list
    const orderListTable = document.getElementById('orderList');
    let index = 1;
    data.orderList.forEach(order => {
        if(index > 8) {
            return;
        }
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>Sample Customer</td> <!-- Replace with actual customer data if available -->
            <td>${formatNumber(order.total)} đ</td>
            <td><span class="badge ${order.status === 'Processing' ? 'bg-info' : order.status === 'Delivering' ? 'bg-warning' : order.status === 'Completed' ? 'bg-success' : 'bg-danger'}">${order.status}</span></td>
        `;
        orderListTable.appendChild(row);
        index++;
    });
}