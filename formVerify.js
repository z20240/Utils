/**
 * currify the gave function
 * If number n is given, `curry` will currify the function base on the n arguments.
 * @param {Function} fn
 * @param {Number} n specify number of arguments given.
 */
export const curry = (fn, n) => {
    const arity = n || fn.length;
    return function curried(...args) {
        return args.length >= arity ?
            fn.call(this, ...args) :
            (...rest) => {
                return curried.call(this, ...args, ...rest);
            };
    };
}


/**
 *  pipe doing each functions and return the result.
 * @param any
 */
export const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

/**
 * compose doing each functions from right to left and return the result.
 * @param any
 */
export const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);


/**
 * 判断一个对象是否为null或者{}
 * @param obj
 * @returns {boolean}
 */
export function _isEmpty(obj) {
   if (obj) return Object.keys(obj).length == 0;

   return obj == null;
}


/**
 * 對 array 進行分組, fn 接收一個 element 參數
 * @param {Array<any>} array
 * @param {Function} fn
 */
export function groupBy( array , fn ) {

    let groups = {};

    array.forEach( function( ele ) {
        let group = JSON.stringify( fn(ele) );
        groups[group] = groups[group] || [];
        groups[group].push( ele );
    });

    return Object.keys(groups).map( function( group ) {
        return groups[group];
    });
}

/**
 *
 * @param {any} val 要被檢測的數值
 * @param {string} typeString 定義的數值型別
 * @param {any?} opt 額外的設定 {noEmpty_array, noEmpty_object, nofalsy}
 * @returns {boolean}
 */
function _checkType (val, typeString, opt) {
    let isTrueType = true;

    // 如果沒有給 type 則只單純檢查是否有值
    if (!typeString) return (val !== undefined && val !== null);

    // 支援 復合型別
    if (typeString.split("|").length > 1) {
        let typeList = typeString.split("|");
        let canBeTrueType = false;

        for (let k in typeList) {
            let typeStr = typeList[k];

            canBeTrueType = (canBeTrueType || _checkType(val, typeStr, opt));
        }

        return canBeTrueType;
    }

    // 支援 array類型 的判斷
    if (/^\w*\[\]$/.test(typeString)) {
        typeString = typeString.split("[]")[0];

        if ( !Array.isArray(val) ) return false;

        if (opt && opt.noEmpty_array && val.length == 0) return false;

        for (let i in val) {
            let ele = val[i];

            isTrueType = (isTrueType && _checkType(ele, typeString, opt));
        }

        return isTrueType;
    }

    if (typeString === "Date") { // Date 參數
        isTrueType = isTrueType && ( Object.prototype.toString.call(val) === "[object Date]" && !isNaN(val) );
    } else { // Date 參數
        isTrueType = isTrueType && ( (typeString === "number") ? !isNaN(val) : (typeof val === typeString) );
    }

    (opt && opt.noEmpty_object && typeString) && (isTrueType = isTrueType && (!_isEmpty(val)));
    (opt && opt.nofalsy) && (isTrueType = isTrueType && (!!val));

    return isTrueType;
}

/**
 *
 * @param {string} key 欄位的 key
 * @param {any} args 要被檢測的 參數 form
 */
function _getKeyValue(key, args) {
    let val = args[key];

    console.log("--------------------------------------- key", key);
    if (key.split(".").length > 1) {
        val = args;
        let steps = key.split(".");
        for (let i = 0 ; i < steps.length ; i++) {
            key = steps[i];

            if (typeof val !== 'object') return {}

            val = val[key];
        }
    }

    return {key, val}
}


/**
 * @description 檢查表單參數是否合法
 * @param {any[]} formSchema 檢查表單的參數格式
 * @param {any} args 要被檢查的參數
 * @returns {boolean|string} 回傳值是 boolean 或 errMsg(若有的話)
 */
module.exports = (formSchema, args) => {
    for (let i = 0 ; i < formSchema.length ; i++) {
        let checkObj = formSchema[i];
        let key = (typeof checkObj === `string`) ? checkObj : checkObj.key;
        let val = '';

        ({key, val} = _getKeyValue(key, args));

        if (typeof checkObj === `object` && !_checkType(val, checkObj.type, checkObj.opt)) {

            if (checkObj.opt && checkObj.opt.errMsg)
                return checkObj.opt.errMsg;

            return false;
        }

        if (val === undefined || val === null)
            return false;

    }
    return true;
}
