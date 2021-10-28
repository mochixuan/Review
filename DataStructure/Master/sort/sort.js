function generateTestData() {
    return [10,4,1,6,5,7,2,9,6,3,8,0]
}

// https://lrh1993.gitbooks.io/android_interview_guide/content/data-structure/sort.html ：最后
 
/**
 * 冒泡排序
 * 规则: 比较相邻的元素。如果第一个比第二个大，就交换他们两个
 * 时间复杂度: O(n^2)
 */
function bubbleSort(items) {
    for (let i = 0 ; i < items.length - 1; i++) {
        for (let j = 0 ; j < items.length - 1 - i ; j++) {
            if (items[j] > items[j+1]) {
                let temp = items[j];
                items[j] = items[j+1];
                items[j+1] = temp;
            }
        }
    }
    return items;
}
console.log('bubble sort: ',bubbleSort(generateTestData()))

/**
 * 选择排序
 * 规则: 在要排序的一组数中，选出最小的一个数与第一个位置的数交换；然后在剩下的数当中再找最小的与第二个位置的数交换，如此循环到倒数第二个数和最后一个数比较为止
 * 时间复杂度O(n^2)
 * 交换次数比冒泡排序少,性能上要好于冒泡排序
 */
function selectSort(items) {
    for (let i = 0 ; i < items.length ; i++) {
        let tempIndex = i;
        for (let j = i+1 ; j < items.length ; j++) {
            if (items[j] < items[tempIndex]) {
                tempIndex = j;
            }
        }
        if (i != tempIndex) {
            let temp = items[i];
            items[i] = items[tempIndex];
            items[tempIndex] = temp;
        }
    }
    return items;
}
console.log('select sort: ',selectSort(generateTestData()))

/**
 * 插入排序
 * 规则: 每步将一个待排序的记录，按其顺序码大小插入到前面已经排序的字序列的合适位置.
 * 时间复杂度: O(n^2)
 * 性能要好于冒泡和选择排序,数据移动时赋值更少。
 */
function insertSort(items) {
    if (items.length <= 1) return items
    for (let i = 1 ; i < items.length ; i++) {
        let temp = items[i];
        let isExChange = false
        for (let j = i - 1 ; j >= 0 && temp < items[j]; j--) {
            items[j+1] = items[j];
            isExChange = true
        }
        if (isExChange) items[j] = temp;
    }
    return items;
}
console.log('insert sort: ',selectSort(generateTestData()))

/**
 * 快速排序
 * 规则: 二分法
 * 时间复杂度O(nlogn)
 * 数据少时用插入排序，因为空间复杂度大
 */
function quick(items,low,high) {

    if (low == null && high == null) {
        low = 0;
        high = items.length - 1;
    }

    if (low >= high) return items;

    let middle = getMiddle(items,low,high);
    if (middle > low) quick(items,low,middle-1);
    if (middle < high) quick(items,middle+1,high)

    return items;
}

function getMiddle(items,start,end) {
    let temp = items[start];
    while (start < end) {
        while (start < end && items[end] >= temp) --end;
        items[start] = items[end];
        while (start < end && items[start] <= temp)  ++start;
        items[end] = items[start];
    }
    items[start] = temp;
    return start;
}

console.log('quick sort:',quick(generateTestData()))

function mergeArr(a, b) {
    let result = [];
    let i = 0,j = 0;
    while(i <= a.length -1 && j <= b.length - 1 ) {
        if (a[i] < b[j]) {
            result.push(a[i]);
            i++;
        } else {
            result.push(a[j]);
            j++;
        }
    };
    if (i <= a.length - 1) result = result.concat(a.slice(i));
    if (j <= b.length - 1) result = result.concat(b.slice(j));
    return result;
}

// 归并排序: nlog(n)
function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    return mergeArr(mergeSort(left), mergeSort(right));
}

console.warn("快速排序: ", mergeSort([13, 14, 15, 17, 20, 23, 28, 42]));


function maxTotal(arr) {
    if (arr.length === 0) return null;
    let max = arr[0];
    let curMax = arr[0];
    for (let i = 1 ; i < arr.length ; i++) {
        if (curMax < arr[i]) {
            curMax = arr[i];
            max = curMax;
        }
    }
    return max;
}
