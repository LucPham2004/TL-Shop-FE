document.addEventListener("DOMContentLoaded", function() {

    // Searching customers
    const searchBtn = document.getElementById('CustomerSearchBtn');
    const searchInput = document.getElementById('CustomerSearchInput');
    if(searchBtn) {
        searchBtn.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');
            this.previousElementSibling.focus();

            const keyword = document.getElementById('CustomerSearchInput').value.trim();

            if (keyword) {
                console.log(keyword);
                searchCustomersAndDisplay(keyword);
            }
    }) 

    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') { 
            event.preventDefault(); 
            const keyword = searchInput.value;
            if (keyword) {
                searchCustomersAndDisplay(keyword);
            }
        }
    });

    } else {
        console.log("not found search button")
    }
})

function searchCustomersAndDisplay(keyword) {
    const CustomerSearchInput = document.getElementById('CustomerSearchInput');
    const parsedKeyword = parseInt(keyword, 10);
                
    if (!isNaN(parsedKeyword)) {
        // Nếu parsedKeyword là số hợp lệ
        fetch(domain + `/api/v1/customers/search/${parsedKeyword}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            showCustomersInAdminPage(data);
            CustomerSearchInput.value = ``;
        })
        .catch(error => {
            console.error('Error fetching customers:', error);
        });

    } else {
        // Nếu keyword không phải là số
        fetch(domain + `/api/v1/customers/search?keyword=${encodeURIComponent(keyword)}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            showCustomersInAdminPage(data);
            CustomerSearchInput.value = ``;
        })
        .catch(error => {
            console.error('Error fetching customers:', error);
        });
    }
}

// Show customers data in admin page
function showCustomersInAdminPage(customers) {
    const tbody = document.querySelector('#customer-table tbody');
    tbody.innerHTML = '';
    
    customers.forEach(customer => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>
                <button class="customerBtn-edit" onclick="openEditModal(${customer.id}, '${customer.name}', '${customer.email}', '${customer.phone}', '${customer.address}')">Sửa</button>
                <button class="customerBtn-delete" onclick="deleteCustomer(${customer.id}, '${customer.email}')">Xóa</button>
                <button class="customerBtn-showOrders" onclick="showOrders(${customer.id})">Xem Đơn Hàng</button>
            </td>
        `;

        tbody.appendChild(tr);
    })
};

async function nonfilterCustomers() {
    const customers = await fetchCustomers();
    showCustomersInAdminPage(customers);

} 

// Delete Customer
async function deleteCustomer(id, email) {
    if(confirm("Bạn có chắc muốn xóa tài khoản của khách hàng này?")) {
        const response = await fetch(domain + `/api/v1/customers?id=${id}&email=${email}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchCustomers();
        } else {
            console.error('Failed to delete customer');
        }
    } else {
        return
    }
}