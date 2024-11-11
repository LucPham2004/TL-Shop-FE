
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

// // Check if user logged in or not
// async function checkLogin() {
//     const token = JSON.parse(localStorage.getItem('token')) || [];

//     if (token.length == 0) {
//         return false;
//     }

//     try {
//         const response = await fetch('http://127.0.0.1:8080/api/v1/auth/status', {
//             method: 'GET', 
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         if (!response.ok) {
//             if (response.status === 401) {
//                 console.log('Unauthorized: Token không hợp lệ hoặc đã hết hạn.');
//             }
//         }

//         const data = await response.json();
//         console.log(data.message);

//         if(data.code == 200) {
//             return true
//         } else {
//             confirm("Phiên làm việc đã hết. Vui lòng đăng nhập lại.");
//             logout();
//             return false
//         }
//     } catch (error) {
//         console.error('Có lỗi xảy ra:', error);
//     }
// }

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
    if (idleTime >= idleLimit) {
        logout();
    }
}
window.addEventListener('load', () => {
    const resetEvents = ['mousemove', 'keydown'];
  
    resetEvents.forEach(event => {
      document.addEventListener(event, resetIdleTime);
    });
  
    setInterval(checkIdleTime, 3600000); // Check every 60 minutes
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
