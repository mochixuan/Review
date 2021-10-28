function sum(a, b){
    let [sI1 , sF1=''] = a.split('.');
    let [sI2 , sF2=''] = b.split('.');

    sI1 = sI1.split('').map((item) => parseInt(item)).reverse();
    sI2 = sI2.split('').map((item) => parseInt(item)).reverse();

    if (sF1.length + sF2.length === 0) {
        return sumInterger(sI1, sI2);
    }

    sF1 = sF1.split('').map((item) => parseInt(item));
    sF2 = sF2.split('').map((item) => parseInt(item));

    return sumInterger(sI1, sI2) + '.' + sumInterger(sF1, sF2, true);
}

function sumInterger(sI1, sI2, isFloat) {
    let s1 = [];
    let sIIndex = 0;
    let Junit = 0;
    
    while (sI1.length > sIIndex && sI2.length > sIIndex) {
        let twoISum = sI1[sIIndex] + sI2[sIIndex] + Junit;
        Junit = 0;
        if (twoISum >= 10) {
            s1.push(twoISum - 10);
            Junit = 1;
        } else {
            s1.push(twoISum);
        }
        sIIndex++;
    }
    if (sI1.length > sIIndex) {
        for (let i = sIIndex; i < sI1.length; i++) {
            s1.push(sI1[i] + Junit);
            Junit = 0;
        }
    } else if (sI2.length > sIIndex) {
        for (let i = sIIndex; i < sI2.length; i++) {
            s1.push(sI2[i] + Junit);
            Junit = 0;
        }
    }
    if (isFloat) {
        return s1.join('');
    } else {
        return s1.reverse().join('');
    }
    
}

console.log(sum('12345.123456789', '234.123456789'));

function upsetPoker() {
     let result = [];
     let origin = [];
     for (let i = 0 ; i < 54 ; i++) {
        origin.push(i);
     }
    //  for (let i = 0; i < 54; i++) {
    //      origin.push(i);
    //      const random = parseInt(Math.random()*(54-i));
    //      const deleteNum = origin[random];
    //      origin.splice(random,1);
    //      result.push(deleteNum);
    //  }

     for (let i = 53; i > 0; i--) {
         const random = parseInt(Math.random()*i);
         const index = origin[random]; // 取出一个随机数
         result.push(origin[index]); // 存进数组
         origin[index] = origin[i]; // 把已使用的数据换了
     }

     return result;
}

console.warn(upsetPoker())

function sort(nums) {
    if (nums.length <= 1) return nums;
    const middle = parseInt(nums.length / 2);
    let leftNums = nums.slice(0,middle);
    let rightNums = nums.slice(middle);
    return merge(sort(leftNums), sort(rightNums));
}

function merge(leftNums, rightNums) {
    let i = 0;
    let j = 0;
    const result = []
    while (i < leftNums.length && j < rightNums.length) {
        if (leftNums[i] < rightNums[j]) {
            result.push(leftNums[i]);
            i++;
        } else {
            result.push(rightNums[j]);
            j++;
        }
    }
    if (i < leftNums.length-1) result.push(leftNums.slice(i)); 
    if (j < rightNums.length-1) result.push(rightNums.slice(j)); 
    return result;
}

class Person {
    getName() {
        let a = 1;
        setTimeout(function(){
            console.log(a);
        }, 0)
    }
}

const person = new Person();
person.getName();