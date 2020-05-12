var romanToInt = function (s) {
    const arr = s.split("").reverse();
    for (let i = 0 ; i < arr.length ; i++) {
        switch (arr[i]) {
            case "I":
                arr[i] = 1;
                break;
            case "V":
                arr[i] = 5;
                break;
            case "X":
                arr[i] = 10;
                break;
            case "L":
                arr[i] = 50;
                break;
            case "C":
                arr[i] = 100;
                break;
            case "D":
                arr[i] = 500;
                break;
            case "M":
                arr[i] = 1000;
                break;
        }
    }
    let min = arr[0];
    result = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (min > arr[i]) {
            result = result - arr[i];
        } else {
            min = arr[i];
            result = result + arr[i];
        }
    }
    return result;
};

console.warn(romanToInt("IX"))