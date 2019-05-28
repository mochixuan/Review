function singleNumber(nums) {
    let temp = null;
    for (let i = 0 ; i < nums.length ; i++) {
        for (let j = 0  ; j < nums.length ; j++) {
            if (i == j) {
                if (i == nums.length - 1) {
                    temp = nums[i];
                } else {
                    continue;
                }
            }
            if (nums[i] == nums[j]) {
                break;
            } else if (j == nums.lenght - 1) {
                temp = nums[i];
                break;
            }
        }
        if (temp != null) break;
    }
    return temp;
};

singleNumber([4,1,2,1,2])
