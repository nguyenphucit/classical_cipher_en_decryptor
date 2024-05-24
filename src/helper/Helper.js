export const charToNumber=(char)=>{
    return char.charCodeAt(0) - 'A'.charCodeAt(0);
}

export const NumberToChar=(number)=>{
    return String.fromCharCode(number + 'A'.charCodeAt(0));
}
export const modInverse=(a, m)=>{
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return null
}

export const mod=(n, p)=> {
    return n - p * Math.floor(n / p);
}

export  const checkCharPosition = (char) => {
    char = char.toUpperCase();
    if (/^[A-Z]$/.test(char)) {
      return char.charCodeAt(0) - "A".charCodeAt(0);
    } else {
      return -1;
    }
  };

  export const inverseMod26=(num)=>{
    for (let i = 0; i < 26; i++) {
        if ((num * i) % 26 === 1) {
            return i;
        }
    }
    return 1;
}

export const isStringContainsAllLetters=(str)=>{
    // Chuyển đổi chuỗi thành chữ thường để tránh sự phân biệt chữ hoa và chữ thường
    const lowerCaseStr = str.toLowerCase();
  
    // Sử dụng bảng chữ cái tiếng Anh để kiểm tra
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  
    // Kiểm tra xem mỗi chữ cái trong bảng có xuất hiện trong chuỗi không
    for (let char of alphabet) {
      if (lowerCaseStr.indexOf(char) === -1) {
        return false; // Nếu thiếu ít nhất một chữ cái, trả về false
      }
    }
  
    return true; // Nếu không có chữ cái nào thiếu, trả về true
  }