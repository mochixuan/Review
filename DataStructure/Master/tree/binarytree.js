function BinaryTree(value) {
    this.value = value;
    this.left = null;
    this.right = null;
}

console.log("===== 排序二叉树 开始=====")
console.log("排序二叉树(二叉查找树：查找的时间复杂度为树的高度)：没个树节点的左孩子一定该节点，右孩子一定大于该节点")

function sortInsertNode(node,newNode) {
    if (node.value < newNode.value ) {
        if (node.right == null) {
            node.right = newNode;
        } else {
            sortInsertNode(node.right,newNode)
        }
    } else {
        if (node.left == null) {
            node.left = newNode;
        } else {
            sortInsertNode(node.left,newNode)
        }
    }
}

const sortBinaryTreeData = [8,1,4,2,9,12,4,10,16]

let mSortRoot = null;

sortBinaryTreeData.forEach((item,index) => {
    const node = new BinaryTree(item);
    if (mSortRoot == null) {
        mSortRoot = node;
    } else {
        sortInsertNode(mSortRoot,node)
    }
})

console.log('排序二叉树',mSortRoot)

console.log("===== 排序二叉树 结束=====")

console.warn('------------------------')
console.warn('------------------------')
console.warn('------------------------')

console.log("===== 前序、中序、后序排序 开始 =====")
// https://blog.csdn.net/qq_33243189/article/details/80222629
const qzhBinaryA = new BinaryTree('A')
const qzhBinaryB = new BinaryTree('B')
const qzhBinaryC = new BinaryTree('C')
const qzhBinaryD = new BinaryTree('D')
const qzhBinaryE = new BinaryTree('E')
const qzhBinaryF = new BinaryTree('F')
const qzhBinaryG = new BinaryTree('G')
const qzhBinaryH = new BinaryTree('H')
const qzhBinaryK = new BinaryTree('K')

qzhBinaryA.left = qzhBinaryB;
qzhBinaryB.right = qzhBinaryC;
qzhBinaryC.left = qzhBinaryD;

qzhBinaryA.right = qzhBinaryE;
qzhBinaryE.right = qzhBinaryF;
qzhBinaryF.left = qzhBinaryG;
qzhBinaryG.left = qzhBinaryH;
qzhBinaryG.right = qzhBinaryK;


// 前序排序
function preOrderTraversal(node,tempOrderTraversal) {
    if (node != null) {
        tempOrderTraversal.push(node.value)
        if (node.left != null) {
            preOrderTraversal(node.left,tempOrderTraversal)
        }
        if (node.right != null) {
            preOrderTraversal(node.right,tempOrderTraversal)
        }
    }
}

const tempPreOrder = []
preOrderTraversal(qzhBinaryA,tempPreOrder);
console.log('前序排序结果',tempPreOrder)

//中序排序
function inOrderTraversal(node,tempOrderTraversal) {
    if (node != null) {
        if (node.left != null) {
            inOrderTraversal(node.left,tempOrderTraversal);
        }
        tempOrderTraversal.push(node.value)
        if (node.right != null) {
            inOrderTraversal(node.right,tempOrderTraversal);
        }
    }
}

const tempInOrder = []
inOrderTraversal(qzhBinaryA,tempInOrder);
console.log('中序排序结果',tempInOrder)

//后序排序
function postOrderTraversal(node,tempOrderTraversal) {
    if (node != null) {
        if (node.left != null) {
            postOrderTraversal(node.left,tempOrderTraversal);
        }
        if (node.right != null) {
            postOrderTraversal(node.right,tempOrderTraversal);
        }
        tempOrderTraversal.push(node.value)
    }
}

const tempPostOrder = []
postOrderTraversal(qzhBinaryA,tempPostOrder);
console.log('后序排序结果',tempPostOrder)

// 通过前序和中序推理出后序
function preAndInToPostOrder(preOrder, inOrder, node) {

    if (preOrder.length == 0) return;

    node.value = preOrder[0];

    // 拆分两份
    const tempIndex = inOrder.indexOf(preOrder[0]);
    const oneInOrder = inOrder.filter((item,index) => (index < tempIndex));
    const twoInOrder = inOrder.filter((item,index) => (index > tempIndex));
    const onePreOrder = preOrder.filter((item,index) => (index > 0 && index <= oneInOrder.length) );
    const twoPreOrder = preOrder.filter((item,index) => (index > oneInOrder.length) );


    if (onePreOrder.length > 0) {
        node.left = new BinaryTree(null)
        preAndInToPostOrder(onePreOrder,oneInOrder,node.left)
    }

    if (twoPreOrder.length > 0) {
        node.right = new BinaryTree(null)
        preAndInToPostOrder(twoPreOrder,twoInOrder,node.right)
    }
}

const tempRoot = new BinaryTree(null);
preAndInToPostOrder(tempPreOrder,tempInOrder, tempRoot)

let tempPostData = []
preOrderTraversal(tempRoot,tempPostData);
console.log('通过前序和中序推理出前序',tempPostData);
tempPostData = []
inOrderTraversal(tempRoot,tempPostData);
console.log('通过前序和中序推理出中序',tempPostData);
tempPostData = []
postOrderTraversal(tempRoot,tempPostData);
console.log('通过前序和中序推理出后序',tempPostData);

console.log("===== 前序、中序、后序排序 结束 =====")

// 排序二叉树最小值左孩子，最大为右孩子

console.log("===== 二叉树查找 开始 =====")

function queryMinMaxFix(node,fix,result) {

    if (result == null) result = {};

    if (node != null) {
        if (result.min == null) result.min = node.value;
        if (result.max == null) result.max = node.value;
        if (result.fix == null) result.fix = []

        if (node.value < result.min) result.min = node.value;
        if (node.value > result.max) result.max = node.value;
        if (node.value == fix) result.fix.push(node);

        if (node.left != null) queryMinMaxFix(node.left,fix,result);
        if (node.right != null) queryMinMaxFix(node.right,fix,result);

    }

    return result;
}

const minMaxFixObg = queryMinMaxFix(tempRoot,'G');
console.warn(`查找固定住${minMaxFixObg.fix.map((item,index) => index+item.value).join(':')}最大值${minMaxFixObg.max}最小值${minMaxFixObg.min}`)

console.log("===== 二叉树查找 开始 =====")