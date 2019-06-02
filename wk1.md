
---
### Notes from Assignment Readings

[Scopes](/lighthouse-labs/lectures/day2/days-notes.md)
* Helpful notes on considerations with examples when setting scopes (ie, closures, prototype-based scope etc...)

---
# Homework

* [Clean Code](#clean-code)

* [HTTP in Depth](#http)

* [JSON](#json)

* [Command Line cURL](#command-line-curl)

* [File IO in NodeJS](#file-io-in-nodejs)

* [Character Encoding](#character-encoding)

* [Streams in NodeJS](#streams-in-nodejs)

* [HTTP Client and Streams](#http-client-and-steams)

* [Domain Name System](#domain-name-system)

* [What is an API](#what-is-an-api)

---

## Clean Code

- TODO: ask if why we don't just always use `let` and `const` if they are blocked scope, and we don't want to effect any potentially referenced variables
- use object method shorthand, ie NOT: `{... getValue: function ()...`} USE: `{...getValue(){ }...}`
- Use `Array.from` instead of spread `...` for mapping over iterables, because it avoids creating an intermediate array.

- convert an iterable object to an array, use spreads `...` instead of `Array.from`.
```javascript
const foo = document.querySelectorAll('.foo');

// good
const nodes = Array.from(foo);

// best
const nodes = [...foo];
```
- Use `Array.from` for converting an array-like object to an array.
```javascript
const arrLike = { 0: 'foo', 1: 'bar', 2: 'baz', length: 3 };

// bad
const arr = Array.prototype.slice.call(arrLike);

// good
const arr = Array.from(arrLike);
```

- explicitly name functions still when using fn expressions (& use expressions over declarations) 

```javascript
// good
// lexical name distinguished from the variable-referenced invocation(s)
const short = function longUniqueMoreDescriptiveLexicalFoo() {
  // ...
};
```


## HTTP

- GET, POST, OPTIONS, HEAD, DELETE, PUT
- status codes; 2xx - ok, 3xx - redirect, 4xx, client-side error, 5xx server-side error
- common request headers including User-Agent, Referer (where coming from), Authorization(user and passcode). 
- URL/ protocol, domain, port, resource path, query parameters, anchor

## JSON

- data sending across web using RESTful requests/responses, Media Type for JSON data is `application/json` (another type of header that can be set in HTTP req/res)
- using `curl -i ipinfo.io` in terminal , get HTTP response where content-type is listed as application/json (media type) and charset=utf-8 - character encoding of the `response body`. 
  - also sidenote, why does my time log 4 hours ahead when ui says correct current time? saw this earlier too...

## Command Line cURL
- curl www.example.com CLI utility to make HTTP requests to a given URL and output the response (allows you to see the *URL*)
- **including `-i` to your cURL command allows the response head to be inspected

- `-o` with curl request will save the output in the filename provided in the command line (ie.... example.com  *mygettext.html*)
  - this way display the progress meter for the download
- `-O` the filename in the URL will be used as the filename to store result
- can obtain multiple files (curl -O URL1 -O URL2)
- `-L` flag in curl cmd will force any redirects to follow to the right html source code
- `Ctrl-C` will STOP a big download midway, can use the '-C -' offest in curl to find where to start resuming the download

- **download a file only if its been modified before/after the given time**
  - this is using the `-z` option in curl (works in both FTP & HTTP)
  - `$ curl -z -21-Dec-11 http://www.example.com/yy.html`
  - the cmd will download `yy.html` *only* if it is modified **BEFORE** than the given data and time... remove the dash before the date and time and will apply if modified **LATER** than given d&t

HTTP Authentication in cURL:
- if username and password requried to view content (can be done with .htaccess file) 
- `-u` option, can pass those credentials from cURL to the web server (ex for basic HTTP authen):
`$ curl -u username:password URL`

FTP:
- options avail to list/download using Ranges
- upload files to FTP server with `-T` option + "{file`, file2}" for multiple files at a time (note user/pass also below)
`$ curl -u ftpuser:ftppass -T - ftp://ftp.testserver.com/myfile_1.txt`

Verbose & Trace Option:
- to help know what is happening use `-v` in curl request , will print details
- `-trace` will provide a full trace dump of all incoming and outgoing data to the given file if more info needed

## File IO in NodeJS
- **Note:** **Callback functions in Node pass` err` as the first argument** (by convention). That means if there was a problem writing the file as requested, then the `err` argument will specify the exception details, otherwise it will be `null`.

- in the `fs` module of node, async methods take the last parameter as teh completion fn callback

- best to use async rather than the sync methods as asyn never block a program during its execution

- fs methods include:
  - `fs.open(path, flags[, mode], callback)`
  - `fs.stat(path cb(err, stats))` where stats has useful methods as well ie, stats.isFile(), stats.isCharacterDevice() etc *(info on file)* 
  - `fs.writeFile(filename, data[, options], cb)`
- *don't forget what running readFile and rendering cb fn's second arg of the actual data, turn data.toString() when running in node terminal 

- fs.read... also fs.close... fs.unlink (to delete a file) .. fs.mkdir(path[, mode], cb)


## Character Encoding

- ASCII was standard english characters plus some symbol char, and only wen tup to 127 therefore leaving an entire bit to spare (0-127 being 7 digits in binary)
- problem was many used the codes 128-255 for their own purposes/ and international transfer with character codes such as 130 ,some PCs coded this as accented e, and american sends to israel where a hebrew letter was coded to the computers sold in israel, all those cases would arrive incorrectly 
- within asian alphabets (thousands of letters would never fit into 8 bits). therefore used dbl byte character set, and *some* were stored in 1 byte and others took 2. 

- do not assume a plain text store in memory (file) is ASCII, need to KNOW the encoding or else it can not display correctly to user (and you can't interpret it)
- ie. for an email message, you are expected to have a string in the head of the form : 
  - **Content-Type: text/plain; charset="UTF-8"**
- in HTML, technically need to know the encoding of the file request before reading it? but luckily almost every encoding in common use does the same thing with characters btwn 32 and 127 so you can always get this far in the HTML page with starting to use funny letters:
  - <html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  - **THIS META TAG NEEDS TO BE FIRST THING IN HEAD TAG**


## Streams in NodeJS
- various types of streams that essentially allow us to read (or write) data in a cont way by sending data in chunks... focus will be on readable and writeable streams
- each stream is an EventEmitter instance (& throws several events at different instances of time) ie:
  - **data** is event fired when data is available to read
  - **end** is fired when there is no more data to read
  - **error** is fired when there is any error recieving OR writing data
  - **finish** is fired when all the data has been flushed to underlying system
- piping streams from one files output to another files input:
- can also use piping and chaining to compress a file and then decompreess the same into a new file (use require(zlib') to create a .gz of the .txt file for example)
```javascript
var fs = require("fs");

// Create a readable stream
var readerStream = fs.createReadStream('input.txt');

// Create a writable stream
var writerStream = fs.createWriteStream('output.txt');

// Pipe the read and write operations
// read input.txt and write data to output.txt
readerStream.pipe(writerStream);
```

## HTTP Client and Streams
- node does not use streams for readng and writing to the file system
- they work for any kind of I/O such as Network IO via `http` and `https`
- see GET request example with script for Monty Python in w1-reading.js file

- the response we get from passing argument `response` to the callback function and logging response will be a very long response... not the body we expected when view the page source in the browser.
- the response seems to be an object called `IncomingMessage`
  - researching this term in docs, this object is a stream
  - we can read/write data to network streams, however since this is an incoming (input) stream, we can only really read from this instance

- in the case of the example - only one CHUNK OF LENGTH output line which means the `data` cb fn was only called once (bc it was a small amount of data for the server to send us back)


## Domain Name System

## What is an API