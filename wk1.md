
---
### Notes from Assignment Readings

[Scopes](/lighthouse-labs/lectures/day2/days-notes.md)
* Helpful notes on considerations with examples when setting scopes (ie, closures, prototype-based scope etc...)

---
# Homework

* [Clean Code](#clean-code)

* [HTTP in Depth](#http-in-depth)

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

## Character Encoding

## Streams in NodeJS

## HTTP Client and Streams

## Domain Name System

## What is an API