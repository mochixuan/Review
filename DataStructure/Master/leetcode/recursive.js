
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


function encodeData(data) {
  let start = data.lastIndexOf('[');
  let end = data.substr(start).indexOf(']')+start;
  while (start >= 0 && end >= 0) {
    let sectionData = data.slice(start + 1, end); // [start, end)
    let [m, n] = sectionData.split('|');
    m = parseInt(m);
    sectionData = '';
    for (let i = 0; i < m; i++) {
      sectionData = sectionData + n;
    }
    console.log(
      start,
      end,
      data.length,
      data.substr(0, start),
      sectionData,
      data.substr(end + 1)
    );
    data = data.substr(0, start) + sectionData + data.substr(end + 1);
    start = data.lastIndexOf('[');
    end = data.substr(start).indexOf(']')+start;
  }
  console.log(data);
}

//encodeData('H[2|ABC]G[8|B[4|CVA]]F[12|ABC]');
// encodeData('H[2|AB[3|CD]][2|EF]A');

function basicSum(preData, symbol, nextData) {
    if (symbol === '+') {
        return parseFloat(preData) + parseInt(nextData);
    } else if (symbol === '-') {
        return parseFloat(preData) - parseInt(nextData);
    }
}

function strToSum(str) {
    let arrs = str.split('');
    const length = arrs.length;
    let index = 0;
    let preData = '';
    let symbol = null;
    let nextData = null;
    
    let curData = null;
    let stack = [];
    while(index < length) {
        curData = arrs[index];
        console.log(preData)
        switch (curData) {
            case '(':
                if (symbol != null) {
                    stack.push({preData, symbol});
                    preData = '';
                    symbol = null;
                    nextData = null;
                }
                break;
            case ')':
                let preResult = stack.pop();
                if (preResult == null) {
                    preData = basicSum(preData, symbol, preData);
                } else {
                    if (nextData == null) {
                      preData = parseFloat(preData);
                    } else {
                      preData = basicSum(preData, symbol, preData);
                    }
                    preData = basicSum(preResult.preData, preResult.symbol, preData);
                }
                nextData = null;
                symbol = null;
                break;
            case '+':
                if (symbol != null) {
                    preData = basicSum(preData, symbol, nextData);
                    nextData = null;
                }
                symbol = '+';
                break;
            case '-':
                if (symbol != null) {
                  preData = basicSum(preData, symbol, nextData);
                  nextData = null;
                }
                symbol = '-';
                break;
            default:
                if (symbol == null) {
                    preData = preData+curData;
                } else {
                    nextData = nextData == null ? curData : nextData+curData; 
                }
                break;
        }
        index++;
    }

    if (nextData != null) {
        return basicSum(preData, symbol, nextData);
    } 

    return parseFloat(preData);
}

console.warn('str求几何运算114: ', strToSum('12+(13+(24+11+(12+18)))+(12+12)'));
console.warn('str求几何运算114: ', strToSum('123+123-123+321'));
console.warn('str求几何运算-1020: ', strToSum('12+34-(1213-(345+(123-345)))'));