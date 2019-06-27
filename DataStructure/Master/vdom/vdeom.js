function createElement(tag,attrs,children) {
    return {
        tag,
        attrs,
        children
    }
}

function diff(newDom,oldDom) {

    let patchDom;

    // string
    if (typeof newDom === 'string') {
         if (oldDom && oldDom.nodeType === 3) {
            if (newDom !== oldDom.innerHTML) {
                oldDom.innerHTML = newDom;
            }
         } else {
             patchDom = document.createTextNode(newDom);
         }
         return patchDom;
    }

    // tag
    if (newDom.type === oldDom.type) {
        // 修改属性和判断子孩子
        diffAttribute(newDom,oldDom);
        let newChildrens = diffChildrens(newDom,oldDom);
    } else {
        return newDom;
    }

}

function diffChildrens(newDom,oldDom) {
    const isHasNewChildrens = newDom.childrens && newDom.childrens.length > 0;
    const isHasOldChildrens = oldDom.childrens && oldDom.childrens.length > 0;
    if (!isHasOldChildrens && isHasNewChildrens) {
        return oldDom;
    }
}

function diffAttribute(newDom , oldDom) {
    const newAttrsObj = newDom.attrs;
    const oldAttrsObj = oldDom.attrs;

    const newAtrrs = [];
    for (let key in newAttrsObj) {
        newAtrrs[key] = newAttrsObj[key];
    }

    for (let key in newAttrsObj) {
        if (oldAttrsObj[key] !== newAttrsObj[key]) {
            oldDom.setAttribute(key,newAttrsObj[key])
        }
    }

    for (let key in oldAttrsObj) {
        if (!newAttrsObj.includes(key)) {
            oldDom.removeAttribute(key);
        }
    }
}
