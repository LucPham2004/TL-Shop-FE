const userAgent = navigator.userAgent;
if (/mobile/i.test(userAgent)) {
    alert("Vui lòng sử dụng bằng máy tính!");
    window.location.href = "/index.html";
}
const imageBaseURL = "https://github.com/LucPham2004/TL-Shop/raw/main/src/main/resources/static";
// Show shop data from server
document.addEventListener("DOMContentLoaded", async function() {
    await displaySummaryData();
    await displayOrders_Customers_Products_Summary();
    await showHomepageImages();

    const loginCheck = checkLogin();
    if(loginCheck == false) {
        console.log("loginCheck = false")
    }

    const brands = await fetchBrandData();
    showBrandsInAdminPage(brands);

    const categories = await fetchCategoryData();
    showCategoriesInAdminPage(categories);

    const customers = await fetchCustomers();
    showCustomersInAdminPage(customers);
    
    const products = await fetchProductsWithDetails();
    showProductsInAdminPage(products);
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
    
    const listorders = document.querySelector('#orders-summary tbody');
    listorders.innerHTML = ``;
    listorders.innerHTML = `
        <td style="text-align:center;">${data.totalOrders}</td>
        <td style="text-align:center;">${data.processingOrdersCount}</td>
        <td style="text-align:center;">${data.shippingOrdersCount}</td>
        <td style="text-align:center;">${data.deliveredOrdersCount}</td>
        <td style="text-align:center;">${data.cancelledOrdersCount}</td>
    `

    const listcustomers = document.querySelector('#customers-summary tbody');
    listcustomers.innerHTML = ``;
    listcustomers.innerHTML = `
        <td style="text-align:center;">${data.totalCustomers}</td>
        <td style="text-align:center;">${data.enabledCustomersCount}</td>
        <td style="text-align:center;">${data.nonLockedCustomersCount}</td>
        <td style="text-align:center;">${data.disabledCustomersCount}</td>
        <td style="text-align:center;">${data.lockedCustomersCount}</td>
    `

    const listproducts = document.querySelector('#products-summary tbody');
    listproducts.innerHTML = ``;
    listproducts.innerHTML = `
        <td style="text-align:center;">${data.totalProducts}</td>
        <td style="text-align:center;">${data.totalBrands}</td>
        <td style="text-align:center;">${data.totalCategories}</td>
        <td style="text-align:center;">${data.reviewedProductsCount}</td>
        <td style="text-align:center;">${data.enabledProductsCount}</td>
        <td style="text-align:center;">${data.disabledProductsCount}</td>
    `

}

async function displaySummaryData() {
    const data = await fethSummary();

    document.getElementById('totalRevenue').innerText = `${data.totalRevenue.toLocaleString()} đ`;

    // Populate new customers
    const newCustomersTable = document.getElementById('newCustomers');
    let i = 1;
    data.new_customers.forEach(customer => {
        if(i > 5) {
            return;
        }
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align:center;">${customer.id}</td>
            <td style="text-align:center;">${customer.name}</td>
            <td style="text-align:center;">${customer.address || 'N/A'}</td>
            <td style="text-align:center;"><span class="tag tag-success">${customer.phone}</span></td>
        `;
        newCustomersTable.appendChild(row);
        i++;
    });

    document.getElementById('totalCustomers').innerHTML = `<b>${data.totalCustomers} khách hàng</b>`;

    document.getElementById('totalProducts').innerHTML = `<b>${data.totalProducts} sản phẩm</b>`;

    document.getElementById('totalOrders').innerHTML = `<b>${data.totalOrders} đơn hàng</b>`;

    document.getElementById('lowStock').innerHTML = `<b>${data.lowRemainingProducts.length} sản phẩm</b>`;

    // Populate order list
    const orderListTable = document.getElementById('orderList');
    let j = 1;
    data.orderList.forEach(order => {
        if(j > 10) {
            return;
        }
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align:center;">${order.id}</td>
            <td style="text-align:center;">${order.customerName}</td>
            <td style="text-align:center;">${formatNumber(order.total)} đ</td>
            <td style="text-align:center;"><span class="badge ${order.status === 'Processing' ? 'bg-info' : order.status === 'Delivering' ? 'bg-warning' : order.status === 'Completed' ? 'bg-success' : 'bg-danger'}">${order.status}</span></td>
        `;
        orderListTable.appendChild(row);
        j++;
    });
}


function formatNumber(number) {
    return number.toLocaleString('vi-VN');
}

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

function extractDate(datetimeString) {
    let datePart = datetimeString.split('T')[0];
    
    return datePart;
}