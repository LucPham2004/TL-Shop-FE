
const domain = "https://tl-shop-8b8514452c4e.herokuapp.com";        //https://tl-shop-8b8514452c4e.herokuapp.com // http://127.0.0.1:8080
const imageBaseURL = "https://github.com/LucPham2004/TL-Shop/raw/main/src/main/resources/static";


// functions
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