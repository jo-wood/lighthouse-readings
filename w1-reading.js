


//* Character Encoding






//* File IO in NodeJS

// FILE IO exercise:

// var fs = require('fs');

// var filePath = process.argv[2];
// var fileData = "This is checking if my callback to write in file worked. \n";

// fs.writeFile(filePath, fileData, function(err){
//   if (err) {
//     return console.log(err);
//   }
//   console.log(filePath + ' was updated! \n');  

//   fs.readFile(filePath, function (err, data) {
//     if (err) {
//       return console.log(err);
//     }
//     console.log('Async read: ' + data.toString());
//   });
// });


// console.log('This statement shows program kept executing outside fs calls');


// var fs = require("fs");

// var filePath = "/tmp/test_sync.txt";
// var fileData = "Testing synchronous file write.\n";
// //// sync:
// // fs.writeFileSync(filePath, fileData);
// //// async
// fs.writeFile(filePath, fileData, function(err) {
//   if (err) {
//     throw err;
//   }
// console.log("successfully wrote to", filePath);
// });





//* JSON 
// var str = '{"a":1, "b":2, "foo":"bar"}'; // string version of a JS Object
// var obj = JSON.parse(str);

// console.log(obj); // an Object that has been deserialized

// delete obj.foo; // modify the object
// JSON.stringify(obj); // serialize it back to a string
// console.log(obj);
