const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 4
};

var token = jwt.sign(data,'celakanth');

console.log(token);

var decoded = jwt.verify(token,'celakanth');

console.log(decoded);


// var preHashString = 'Cfm341345!!';
//
// var Hash = SHA256(preHashString).toString();
//
// console.log(`String before hash: ${preHashString}  Hashed string ${Hash}`);
//
// var data = {
//   id:4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'celakanth').toString()
// };
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'celakanth2').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// }
// else {
//   console.log('Data changed');
// }
