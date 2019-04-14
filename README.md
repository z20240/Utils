
# Utils

這是一個集成一些時常使用的 function 的小工具。

包括，但不限於

## formVerify

這是一個專門檢查 javascript 物件屬性是否合法的小工具。

`支援 javascript 基本屬性、Array、複合屬性`

##使用方法

### 載入 formVerify

```javascript
/** 載入 formVerify */ 
let formVerify = require('./formVerify');
```
formVerify 接受兩個參數

- arg1: rule `(Array)`
- arg2: value `(Object)`

### Rule arg 規範

你可以使用 `string array`, 只單純檢查此屬性是否存在，或是使用 `Checking Object` 做進一步的檢查

### Checking Object 格式

```javascript
{
    "key": "property name",
    "type": "data type", // ex. number, string, number[], string[], [], object, ...etc
    "opt": {
        noEmpty_array:  boolean, // check if empty array then return false (invalid).
        noEmpty_object: boolean, // check if empty object then return false (invalid).
        nofalsy: boolean, // check if falsy then return false (invalid).
        errMsg: "return message if this property is invalid".
    },
}
```


### example

```javascript

let value = { 
    prop1: "this is a string",
    prop2: 1 // a number,
    prop3: ["1", "2", "test"],
};

let rule1 = [ "prop1", "prop2", "prop3" ]; 

let rule2 = [
    { key: "prop1" }, // only check if exist.
    { key: "prop2", type: "number" }, // check if prop2 is a number.
    { key: "prop3", type: "string[]" }, // check if prop3 is a string array.
]

console.log( formVerify(rules1, value) ); // return true. 
console.log( formVerify(rules1, value) ); // return true. 
```

## isEmpty

判斷一個Obj是否為null或者{}

## groupBy( array, fn )

對 array 進行分組, fn 接收一個 element 參數

## pipe(fn1, fn2, ...)

循序的執行給予的 function 並回傳最終的結果

## compose(fn1, fn2, ...)

倒序的執行給予的 function 並回傳最終的結果

## curry(fn, n) 

對所給予的 function 柯里化。若給予 n 值，則以 n 作為 fn 接收的參數數量。
        errMsg: "return message if this property is invalid".直
        errMsg: "return message if this property is invalid".
