/**
 * @param {HTMLElement} dom 真实DOM
 * @param {vnode} 虚拟dom
 * @param {HTMLElement} 更新后的DOM
 */

function diff(oldDom,newVDom) {

    let resultDom = oldDom;

    if (newVDom == null) newVDom = '';

    if (typeof newVDom === 'string' || typeof newVDom === 'boolean') newVDom = String(newVDom);

    /**
     * 文本节点 1. mochixuan 2. <p>mochixuan</p> 3. <p style="display:none"></p>
     * 细节: 选textContent：当文本节点包含标签时会被转化为子节点所以不能用innerHTML, 当innerText不包含display:none文本
     */
    if (typeof newVDom === 'string') {
        if (oldDom && oldDom.nodeType === 3) {
            if (oldDom.textContent !== newVDom) {
                oldDom.textContent = newVDom;
            }
        } else {
            resultDom = document.createTextNode(newVDom);
            if (oldDom && oldDom.parentNode) {
                oldDom.parentNode.replaceChild(oldDom,resultDom);
            }
        }
	    return resultDom;
    }

    /**
     * 非文本节点
     */
    if (!resultDom || resultDom.nodeName.toLowerCase() != newVDom.nodeName.toLowerCase())  {
        resultDom = document.createElement(newVDom.nodeName);
        diffAttributes(resultDom,newVDom); // 添加所有属性
        if (resultDom && resultDom.parentNode) {
            resultDom.parentNode.replaceChild(resultDom,resultDom);
        }
        return resultDom;
    } else {
        diffAttributes(resultDom,newVDom); //如果属性不同: 修改属性
    }

    /**
     * 遍历子节点
     */



    return resultDom;

}

function diffComponent(oldDom,newVDom) {

}

function diffAttributes(oldDom,newVDom) {
    //删除无用属性,添加新属性
    const oldAttrs = {};
    const newAtrrs = {};
    for (let {name,value} of oldDom.attributes) {
        oldAttrs[name] = value;
    }
    for (let {name,value} of newVDom.attributes) {
        newAtrrs[name] = value;
    }
    for (let name in oldAttrs) {
        // 移除该属性
        if (!(name in newAtrrs)) setAttribute(oldDom,name,undefined);
    }
    for (let name in newAtrrs) {
        // 添加该属性
        if (!(name in oldDom)) setAttribute(oldDom,name,newAtrrs[name]);
    }
}

function setAttribute( dom, name, value ) {
    // 如果属性名是className，则改回class
    if ( name === 'className' ) name = 'class';

    // 如果属性名是onXXX，则是一个事件监听方法
    if ( /on\w+/.test( name ) ) {
        name = name.toLowerCase();
        dom[ name ] = value || '';
        // 如果属性名是style，则更新style对象
    } else if ( name === 'style' ) {
        if ( !value || typeof value === 'string' ) {
            dom.style.cssText = value || '';
        } else if ( value && typeof value === 'object' ) {
            for ( let name in value ) {
                // 可以通过style={ width: 20 }这种形式来设置样式，可以省略掉单位px
                dom.style[ name ] = typeof value[ name ] === 'number' ? value[ name ] + 'px' : value[ name ];
            }
        }
        // 普通属性则直接更新属性
    } else {
        if ( name in dom ) {
            dom[ name ] = value || '';
        }
        if ( value ) {
            dom.setAttribute( name, value );
        } else {
            dom.removeAttribute( name );
        }
    }
}

// Https、虚拟机、垃圾回收机制、Event-Loop、React细节、Handler
