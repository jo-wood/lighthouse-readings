
# Homework

*jump to:*

* [tech Stack](#tech-stack)

* [Event-Driven Architecture](#event-driven-architecture)

* [Event Propagation](#event-propagation)
  * [Stopping Bubbling](#stopping-bubbling)
  * [Capturing](#capturing)

* [jQuery](#jquery)
  * [Event Delegation](#event-delegation)
  * [The Event Object](#the-event-object)

---

## Tech Stack

Often refers to the collection of technologies in a given system. 

For example from our tinyApp:

* Web Server: NodeJS
* Middleware: Express
* Template Engine: EJS
* Database: Npne, just an *'In-Memory Object'*

Depending on your company, your definition of the stack could also include the infrastructure...

* Hosting/Infrastructure: Heroku

A common stack (by no means the most popular as many) is the **MEAN stack** (which includes NodeJS, Express, but also Angular.js and MongoDB)

## Event-Driven Architecture

**EDA**

* When `x` happens, do `Y`
* Where `x` is the event and `y` is the event handler

### Client-Side Events

The DOM has custom events such as `onClick`, `onFocus`, `onLoad`. One library that we will use to demo client-side events is **jQuery**.

### Server-Side Events

On a server running NodeJS, and incoming request can be thought of as an event, with a callback function that handles the event (and could render a response). The Node.js core API provides an `EventEmitter` class that is the basis for event-driven patterns

## Event Propagation

An event that affects a child element **bubbles up** through its parents (since DOM elements are nested within other elements - this will always be true, you are always writing within the html and body tags, if nothing else, your events would bubble up to these parents).

It is possible to prevent an event from continuing its propagation at any stage using `stopPropagation()`.

* When an event happens on an element, it first runs the handlers on it, then on its parent, then all the way up on other ancestors.

Let’s say we have 3 nested elements FORM > DIV > P with a handler on each of them:

```html
<style>
  body * {
    margin: 10px;
    border: 1px solid blue;
  }
</style>

<form onclick="alert('form')">FORM
  <div onclick="alert('div')">DIV
    <p onclick="alert('p')">P</p>
  </div>
</form>
```

A click on the inner `<p`> first runs onclick:

1. On that `<p>`.
2. Then on the outer `<div>`.
3. Then on the outer `<form>`.
4. And so on upwards till the document object.

So if we click on `<p>`, then we’ll see 3 alerts: p → div → form.

The process is called “bubbling”, because events “bubble” from the inner element up through parents like a bubble in the water.

*Almost* all events bubble.
The key word in this phrase is “almost”.

For instance, a `focus` event does not bubble. There are other examples too but still it’s an exception, rather than a rule, most events do bubble.

### event.target

A handler on a parent element can always get the details about where it actually happened.

**The most deeply nested element that caused the event is called a target element, accessible as `event.target`.**

Note the differences from `this` (= `event.currentTarget`):

* `event.target` – is the “target” element that initiated the event, it doesn’t change through the bubbling process.

* `this` – is the “current” element, the one that has a currently running handler on it.

For instance, if we have a single handler `form.onclick`, then it can “catch” all clicks inside the `form`. No matter where the click happened, it bubbles up to `<form>` and runs the handler.

In `form.onclick` handler:

* `this` (= `event.currentTarget`) is the `<form>` element, because the handler runs on it.

* `event.target` is the concrete element inside the form that actually was clicked.

It’s possible that event.target equals this – when the click is made directly on the `<form>` element.

Example:

The `onclick`  is set on the form element. But if the `<p>` tag is clicked, it will turn yellow. It in this case is the `event.target` while the form is the `this.tagName` as the `this` refers to the form.onclick being invoked by an event. 

```html
<!DOCTYPE HTML>
<html>

<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="example.css">
</head>

<body>
  A click shows both <code>event.target</code> and <code>this</code> to compare:

  <form id="form">FORM
    <div>DIV
      <p>P</p>
    </div>
  </form>

  <script src="script.js"></script>
</body>
</html>
```

```javascript
form.onclick = function(event) {
  event.target.style.backgroundColor = 'yellow';

  // chrome needs some time to paint yellow
  setTimeout(() => {
    alert("target = " + event.target.tagName + ", this=" + this.tagName);
    event.target.style.backgroundColor = ''
  }, 0);
};
```

### Stopping bubbling

A bubbling event goes from the target element straight up. Normally it goes upwards until `<html>`, and then to `document` object, and some events even reach `window`, calling all handlers on the path.

But any handler may decide that the event has been fully processed and stop the bubbling.

The method for it is `event.stopPropagation()`.

For instance, here `body.onclick` doesn’t work if you click on `<button>`:

```html
<body onclick="alert(`the bubbling doesn't reach here`)">
  <button onclick="event.stopPropagation()">Click me</button>
</body>
```

* **event.stopImmediatePropagation()**

If an element has multiple event handlers on a single event, then even if one of them stops the bubbling, the other ones still execute.

In other words, `event.stopPropagation()` stops the move upwards, but on the current element all other handlers will run.

To stop the bubbling and prevent handlers on the current element from running, there’s a method `event.stopImmediatePropagation()`. After it no other handlers execute.

```
* **Don’t stop bubbling without a need!**

Bubbling is convenient. Don’t stop it without a real need: obvious and architecturally well-thought.

Sometimes `event.stopPropagation()` creates hidden pitfalls that later may become problems.

For instance:

We create a nested menu. Each submenu handles clicks on its elements and calls `stopPropagation` so that the outer menu won’t trigger.

Later we decide to catch clicks on the whole window, to track users’ behavior (where people click). Some analytic systems do that. Usually the code uses `document.addEventListener('click'…)` to catch all clicks.

Our analytic won’t work over the area where clicks are stopped by   stopPropagation . We’ve got a “dead zone”.

There’s usually no real need to prevent the bubbling. A task that seemingly requires that may be solved by other means. One of them is to use custom events, we’ll cover them later. Also we can write our data into the event object in one handler and read it in another one, so we can pass to handlers on parents information about the processing below.
```

### Capturing

There’s another phase of event processing called “capturing”. It is rarely used in real code, but sometimes can be useful.

The standard **DOM Events** describes 3 phases of event propagation:

1. Capturing phase – the event goes down to the element.
2. Target phase – the event reached the target element.
3. Bubbling phase – the event bubbles up from the element.

* **Before we only talked about bubbling, because the capturing phase is rarely used. Normally it is invisible to us**

Handlers added using `on<event>`-property or using HTML attributes or using `addEventListener(event, handler)` don’t know anything about capturing, they only run on the 2nd and 3rd phases.

To catch an event on the capturing phase, we need to set the handler `captur`e option to `true`:

```javascript
elem.addEventListener(..., {capture: true})
// or, just "true" is an alias to {capture: true}
elem.addEventListener(..., true)
```

There are two possible values of the capture option:

* If it’s `false` (default), then the handler is set on the bubbling phase.
* If it’s `true`, then the handler is set on the capturing phase.

Note that while formally there are 3 phases, the 2nd phase (“target phase”: the event reached the element) is not handled separately: **handlers on both capturing and bubbling phases trigger at that phase**.

```css
<style>
  body * {
    margin: 10px;
    border: 1px solid blue;
  }
</style>
```

```html
<form>FORM
  <div>DIV
    <p>P</p>
  </div>
</form>
```

```javascript
<script>
  for(let elem of document.querySelectorAll('*')) {
    elem.addEventListener("click", e => alert(`Capturing: ${elem.tagName}`), true);
    elem.addEventListener("click", e => alert(`Bubbling: ${elem.tagName}`));
  }
</script>
```

The code sets click handlers on every element in the document to see which ones are working.

If you click on `<p>`, then the sequence is:

1. `HTML` → `BODY` → `FORM` → `DIV` → `P` (**capturing phase**, the first listener), and then:

2. `P` → `DIV` → `FORM` → `BODY` → `HTML` (**bubbling phase**, the second listener).

Please note that `P` shows up two times: at the end of capturing and at the start of bubbling.

```
**To remove the handler, `removeEventListener` needs the same phase**

If we `addEventListener(..., true)`, then we should mention the same phase in `removeEventListener(..., true)` to correctly remove the handler.
```

**The capturing phase is used very rarely, usually we handle events on bubbling. And there’s a logic behind that.

In real world, when an accident happens, local authorities react first. They know best the area where it happened. Then higher-level authorities if needed.**

**The same for event handlers. The code that set the handler on a particular element knows maximum details about the element and what it does. A handler on a particular `<td>` may be suited for that exactly `<td>`, it knows everything about it, so it should get the chance first. Then its immediate parent also knows about the context, but a little bit less, and so on till the very top element that handles general concepts and runs the last.**

**Bubbling and capturing lay the foundation for *“event delegation”* – an extremely powerful event handling pattern that we study in the next chapter.**

## jQuery

Why does jQuery exist?

* **Reason 1: Fixes Browser Compatibility issues**

While most browsers have a function called `window.innerWidth`, Internet Explorer uses `document.documentElement.clientWidth` to return the viewport width. If you tried to run `window.innerWidth` in Internet Explorer you would get an error.

jQuery gives us a handy function to prevent crazy code handling for different browsers - `$(window).width()`

* **Reason 2: Cleaner API**

The browser has built-in JavaScript functions to help you write code that interacts with the page. Working with DOM events can be a bit painful. `getElementById` and `addEventListener` are quite the mouthful.

One of the nice things that jQuery does, is it wraps the native functions with a cleaner API.

```javascript
$("#foo").click(function() {
  console.log("Foo element clicked");
});
```

### Events and Callbacks with jQuery

As of jQuery 1.7, all events are bound via the `on` method, whether you call it directly or whether you use an alias/shortcut method such as `bind` or `click`, which are mapped to the `on` method internally. With this in mind, it's beneficial to use the `on` method because the others are all just syntactic sugar, and utilizing the `on` method is going to result in faster and more consistent code.

```javascript
$( "body" ).on({
    click: function( event ) {
        alert( "Hello." );
    }
}, "button" );


$( "body" ).on( "click", "button", function( event ) {
    alert( "Hello." );
});
```

The final example above is exactly the same as the one preceding it, but instead of passing an object, we pass an **event string**, a **selector string**, and the **callback**. Both of these are examples of event delegation, a process by which an element higher in the DOM tree listens for events occurring on its children.

We can also add an event specifically on a direct element:

```javascript
$( "#helloBtn" ).on( "click", function( event ) {
    alert( "Hello." );
});
```

### Event Delegation

While event bubbling and delegation work well, the delegating element should always be as close to the delegatees as possible so the event doesn't have to travel way up the DOM tree before its handler function is called.

The two main pros of event delegation over binding directly to an element (or set of elements) are performance and the aforementioned event bubbling. Imagine having a large table of 1,000 cells and binding to an event for each cell. That's 1,000 separate event handlers that the browser has to attach, even if they're all mapped to the same function. Instead of binding to each individual cell though, we could instead use delegation to listen for events that occur on the parent table and react accordingly. One event would be bound instead of 1,000, resulting in way better performance and memory management.

The event bubbling that occurs affords us the ability to add cells via Ajax for example, without having to bind events directly to those cells since the parent table is listening for clicks and is therefore notified of clicks on its children. If we weren't using delegation, we'd have to constantly bind events for every cell that's added which is not only a performance issue, but could also become a maintenance nightmare.

### The Event Object

```javascript
// Binding a named function
function sayHello( event ) {
    alert( "Hello." );
} 
$( "#helloBtn" ).on( "click", sayHello );
```

It is important to know that named functions can be passed to events as well (not just anon) if different elements or different events should perform the same functionality. This helps to keep your code **DRY**.

 In all DOM event callbacks, jQuery passes an **event object** argument which contains information about the event, such as precisely when and where it occurred, what type of event it was, which element the event occurred on, and a plethora of other information. Of course you don't have to call it `event`; you could call it `e` or whatever you want to, but `event` is a pretty common convention.

If the element has default functionality for a specific event (like a link opens a new page, a button in a form submits the form, etc.), that default functionality can be canceled. This is often useful for Ajax requests. When a user clicks on a button to submit a form via Ajax, we'd want to cancel the *button/form's default action (to submit it to the form's action attribute), and we would instead do an Ajax request to accomplish the same task for a more seamless experience**. To do this, we would utilize the event object and call its `.preventDefault()` method. We can also prevent the event from bubbling up the DOM tree using `.stopPropagation()` so that parent elements aren't notified of its occurrence (in the case that event delegation is being used).

```javascript
// Preventing a default action from occurring and stopping the event bubbling
$( "form" ).on( "submit", function( event ) {
 
    // Prevent the form's default submission.
    event.preventDefault();
 
    // Prevent event from bubbling up DOM tree, prohibiting delegation
    event.stopPropagation();
 
    // Make an AJAX request to submit the form data
});
```

It's also important to note that the event object contains a property called `originalEvent`, which is the event object that the browser itself created. jQuery wraps this native event object with some useful methods and properties, but in some instances, you'll need to access the original event via `event.originalEvent` for instance. This is especially useful for touch events on mobile devices and tablets.