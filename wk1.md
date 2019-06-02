
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
- use command line tool - `dig` to trace a DNS request
- when tracing is enabled, dig makes iterative queries to resolve the name being looked up
- it will follow referrals from the root servers, showing the answer from each server that was used to resolve the lookup 
`dig +trace google.com` produces list of 268bytes from a root IP in < 100ms: ie:
```
; <<>> DiG 9.8.3-P1 <<>> +trace google.com
;; global options: +cmd
.           11205   IN  NS  a.root-servers.net.
.           11205   IN  NS  b.root-servers.net.
.           11205   IN  NS  c.root-servers.net.
.           11205   IN  NS  d.root-servers.net.
.           11205   IN  NS  e.root-servers.net.
.           11205   IN  NS  f.root-servers.net.
.           11205   IN  NS  g.root-servers.net.
.           11205   IN  NS  h.root-servers.net.
.           11205   IN  NS  i.root-servers.net.
.           11205   IN  NS  j.root-servers.net.
.           11205   IN  NS  k.root-servers.net.
.           11205   IN  NS  l.root-servers.net.
.           11205   IN  NS  m.root-servers.net.
;; Received 228 bytes from 8.8.8.8#53(8.8.8.8) in 13 ms

com.            172800  IN  NS  a.gtld-servers.net.
com.            172800  IN  NS  b.gtld-servers.net.
com.            172800  IN  NS  c.gtld-servers.net.
com.            172800  IN  NS  d.gtld-servers.net.
com.            172800  IN  NS  e.gtld-servers.net.
com.            172800  IN  NS  f.gtld-servers.net.
com.            172800  IN  NS  g.gtld-servers.net.
com.            172800  IN  NS  h.gtld-servers.net.
com.            172800  IN  NS  i.gtld-servers.net.
com.            172800  IN  NS  j.gtld-servers.net.
com.            172800  IN  NS  k.gtld-servers.net.
com.            172800  IN  NS  l.gtld-servers.net.
com.            172800  IN  NS  m.gtld-servers.net.
;; Received 488 bytes from 192.203.230.10#53(192.203.230.10) in 10 ms

google.com.     172800  IN  NS  ns2.google.com.
google.com.     172800  IN  NS  ns1.google.com.
google.com.     172800  IN  NS  ns3.google.com.
google.com.     172800  IN  NS  ns4.google.com.
;; Received 164 bytes from 192.41.162.30#53(192.41.162.30) in 159 ms
```
Notice that there were four request-response stages,

1. Starting the journey at the root name servers - (*.root-servers.net)
2. continuing to the .com top level domain (TLD) - (*.gtld-servers.net)
3. followed by the google.com Name Servers (NS) - (ns*.google.com)
4. and concluded with fifteen (!) Address Records (A) - (66.199.151.*)

**IP addresses listed in the A Records are servers hosting Google.com, many websites only require one web server node - however scale of course provides a collection of servers to choose from

|                                 |Similarities    | Differences |
|---------------------------------|:--------------:|------------:|
|dig +trace www.lighthouselabs.ca |28 bytes in 1ms |             |
|dig +trace canada.gc.ca          |same            |             |
|dig +trace bbc.co.uk             |same            | but 0ms     |
*all recieved from from 10.0.2.3#53(10.0.2.3)*

- didn't follow the above example bc there are various ways that DNS can be set up
- ? not showing answer? other commands for this

## What is an API

- good simplified explanation: APIs are sets of requirements that govern how one application can talk to another 
- **windows to the code**
- system-level APIs make it possible for applications like office to cut and paste into excel & for office apps to run on top of an OS in the first place
- within web terms, APIs make if possible for big services to let other apps 'piggyback' on their offerings **Yelp, displays nearby restaurants on a Google Map in its app**

- APIs do so by 'exposing' some of the program's internal fns to the outside world in a limited fashion
- therefore can share data, take actions without requiring devs to share all of their software's code (secret AND inefficient if did)
- REpresentional State Transfer
- REST api calls similar to any server request (client -> server) but in this case `maps.googleapis.com`
- the response from REST typically a JSON object
- HTTP Reqeust Methods with GET and POST (write data to the api request) - best practice to put data in the body of the request, normal web browser wouldn't allow this - could use Postman Client, and can add body to your http request
- authentication across many api's use OAuth , using access tokens
- 