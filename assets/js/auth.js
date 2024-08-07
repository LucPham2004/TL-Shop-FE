
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

// Check if user logged in or not
async function checkLogin() {
    const token = JSON.parse(localStorage.getItem('token')) || [];

    try {
        const response = await fetch(domain + '/api/v1/auth/status', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log(data.message);

        if(data.code == 200) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
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

// Check if user is active or not
let idleTime = 0;
const idleLimit = 120 * 60; // 2 hours

function resetIdleTime() {
    idleTime = 0;
}

function checkIdleTime() {
    idleTime += 600;
    if (idleTime >= idleLimit && checkLogin()) {
        logout();
    }
}
window.addEventListener('load', () => {
    const resetEvents = ['mousemove', 'keydown'];
  
    resetEvents.forEach(event => {
      document.addEventListener(event, resetIdleTime);
    });
  
    setInterval(checkIdleTime, 600000); // Check every 10 minutes
});

// Log out
async function logout() {
    try {
        const response = await fetch(domain + '/api/v1/auth/logout', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },
        });

        if (!response.ok) {
            throw new Error('Đăng xuất thất bại');
        }
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/public/index.html';

    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
        alert('Đăng xuất thất bại.');
    }
}
