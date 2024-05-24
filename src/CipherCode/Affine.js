export const isPrimeWithM=(a, m)=>{
    for (let i = 2; i < m; i++) {
        if (a % i === 0 && m % i === 0) {
            return false;
        }
    }
    return true;
}