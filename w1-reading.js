var str = '{"a":1, "b":2, "foo":"bar"}'; // string version of a JS Object
var obj = JSON.parse(str);

console.log(obj); // an Object that has been deserialized

delete obj.foo; // modify the object
JSON.stringify(obj); // serialize it back to a string
console.log(obj);
