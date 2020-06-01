
var calculate = function(s) {

    let arr = s.split("");
    let stack = [];
    let curNums = [];
    let index = 0;
    let length = arr.length;
    let isAllCal = false;

    while(index < length) {
        if (arr[index] === '+' || arr[index] === '-') {
            stack.push( parseInt(curNums.join(""))); // 计算
            numsCalculate(stack, true);
            curNums = [];
            stack.push(arr[index])
        } else if (arr[index] === '*' || arr[index] === '/') {
            stack.push(parseInt(curNums.join('')));
            if (stack.length >= 2) {
                let endTwoSymbol = stack[stack.length - 2];
                if (endTwoSymbol === '*' || endTwoSymbol === '/') {
                    numsCalculate(stack, false);
                    curNums = [];
                    stack.push(arr[index]);
                } else {
                    curNums = [];
                    stack.push(arr[index]);
                }
            } else {
                curNums = [];
                stack.push(arr[index]);
            }
        }  else if (arr[index] === ' '){

        } else {
            curNums.push(arr[index]);
        }
        console.warn('stack', stack);
        index++;
    }
    if (curNums.length != 0) stack.push(parseInt(curNums.join('')));
    if (stack.length > 1) numsCalculate(stack, true);
    return stack[0];
};

var numsCalculate = function(stack, isAllCal) {
    if (stack.length < 3) return;

    let three = stack.pop();
    let twoSymbol = stack.pop();
    let one = stack.pop();
    console.warn(one, twoSymbol, three)
    
    if (twoSymbol === '/' || twoSymbol === '*') {
        if (twoSymbol === '/') {
            stack.push(one / three);
        } else {
            stack.push(one * three);
        }
    } else  {
        if (twoSymbol === '+') {
          stack.push(one + three);
        } else {
          stack.push(one - three);
        }
    }

    if (isAllCal) {
        console.warn(stack);
        numsCalculate(stack, isAllCal);
    }
}   

console.warn(calculate('3+2*2'));