// 最大公约数
let gcd1 = (a, b) => {
    let min = a > b ? b : a;
    let max = a > b ? a : b;
    let temp;
    while (min !== 0) {
        temp = max%min;
        max = min;
        min = temp;
    }
    return max;
}
let gcd = (max,min) => {
    if (min === 0) return max;
    let temp = max%min;
    if (temp === 0) return min;
    return gcd(min, temp);
}
