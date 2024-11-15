
// Read Cookies value
function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    
    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        
        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    return null;
}


function checkRoles() {
    let customerInfo = JSON.parse(localStorage.getItem('user')) || [];
    if (customerInfo.authorities && Array.isArray(customerInfo.authorities)) {
        return customerInfo.authorities.map(auth => auth.authority);
    }
    
    return [];
}

// Get user's id
function getCustomerId() {
    let customerInfo = JSON.parse(localStorage.getItem('user')) || [];
    return parseInt(customerInfo.id);
}

// Refresh token before access_token exprired
const token = JSON.parse(localStorage.getItem('token')) || [];
const timeLogedin = JSON.parse(localStorage.getItem('timeLogedin')) || [];

if (token && timeLogedin) {
    const expirationTime = timeLogedin + 86400 * 1000; // Token hết hạn sau 1 ngày
    const timeToRefresh = expirationTime - Date.now() - 60000; // Làm mới trước 1 phút

    // console.log("Token:", token);
    // console.log("Thời gian đăng nhập:", timeLogedin);
    // console.log("Thời gian hết hạn:", expirationTime);
    // console.log("Thời gian đến khi làm mới:", timeToRefresh);

    if (timeToRefresh > 0) {
        setTimeout(() => {
            fetch(domain + '/api/v1/auth/refresh', { 
                method: "GET",
                credentials: 'include'
            })
            .then((res) => res.json())
            .then((refreshData) => {
                if (refreshData.code === 1000) {
                    console.log("Token mới:", refreshData.result.jwt);
                    localStorage.setItem("token", JSON.stringify(refreshData.result.jwt));
                    localStorage.setItem("timeLogedin", JSON.stringify(Date.now())); // Cập nhật thời gian mới
                }
            })
            .catch((err) => console.log("Error refreshing token:", err));
        }, timeToRefresh);
    } else {
        console.log("Token đã hết hạn. Vui lòng đăng nhập lại.");
    }
} else {
    console.log("Người dùng chưa đăng nhập.");
}

// Log out
async function logout() {
    try {
        const response = await fetch(domain + '/api/v1/auth/logout', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },
        });

        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/index.html';

    } catch (error) {
        console.log('Có lỗi xảy ra:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    }
}
