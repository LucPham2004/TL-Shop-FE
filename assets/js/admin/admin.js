
const userAgent = navigator.userAgent;
if (/mobile/i.test(userAgent)) {
    alert("Vui lòng sử dụng bằng máy tính!");
    window.location.href = "/index.html";
}
const roles = checkRoles();
if(!roles.includes("ADMIN")) {
    alert("Bạn không có quyền truy cập trang này!");
    window.location.href = "/index.html";
}

// Show shop data from server
document.addEventListener("DOMContentLoaded", async function() {
    await displaySummaryData();

});


async function displaySummaryData() {
    const data = await fetchSummary();

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
    data.orderList.content.forEach(order => {
        if(j > 9) {
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


async function fetchSummary() {
    try {
        const response = await fetch(domain + `/api/v1/admin/summary`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
        
    } catch (error) {
        console.log('Error fetching summary:', error);
    }
}

// Helping functions
