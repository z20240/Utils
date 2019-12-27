var args = {
    a: 1,
    b: 2,
    c: 3,
    d: "4",
    e: 3,
};


var form = [
    "a",
    "b",
    "c",
    {key: "d", type: "number" },
];


let formVerify = require('./formVerify');

console.log(formVerify(form, args));