const { randomInt } = require("crypto");


function codeGen() {
  return Math.floor(new Date().valueOf() * randomInt(100, 999));
}

function codeGenForDriver() {
  const num = Math.floor(new Date().valueOf() * randomInt(100, 999)).toString().split("").slice(10);
  console.log(num)
  const code = Number(num.toString().replaceAll(",",""))
  console.log(code)
  return code
}

const isTrue = (value) => ["true", 1, true].includes(value);
const isFalse = (value) => ["false", 0, false].includes(value);


module.exports = {
    codeGen,
    codeGenForDriver,
    isFalse,
    isTrue
}