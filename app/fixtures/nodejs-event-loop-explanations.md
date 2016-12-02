# The NodeJs Event Loop explained

## Introduction

"The event loop is what allows Node.js to perform non-blocking I/O operations 
by offloading operations to the system kernel whenever possible." [[1]](#ref1)

Javascript language and operating system internals (threads) make this event loop possible.

The main ideas here are 

- - to be able to keep calling context functions called (closure).

- - to be able to execute functions out of the NodeJs event loop in a non blocking way (use of thread pool). 
 

## Javascript background

"JavaScript (JS) is a lightweight, interpreted, programming language with first-class functions. 

While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as node.js and Apache CouchDB.

JS is a prototype-based, multi-paradigm, dynamic scripting language, supporting object-oriented, imperative, and declarative (e.g. functional programming) styles." [[2]](#ref2)

"Javascript is (also) a single-threaded, event-driven language. This means that we can attach listeners to events, and when a said event fires, the listener executes the callback we provided." [6](#ref6) 

### First-class functions

A variable can reference a function. [[3]](#ref3)

ie:
```Javascript
const a = (x) => console.log('a is function, param: ' + x);
```

### Higher order function

A function can have functions as parameters. [[4]](#ref4)

ie:
```Javascript
const b = (f, x) => f(x);
b(a,5); // a is function, param: 5
```

### Closures

It allows function to access non-local variable from calling context. [[5]](#ref5)

ie:
```Javascript
f = (x) => {
    var a=x;
    g = () => console.log(a);
    return g();
}
f("closure"); // "closure"
```


## Operating system background

The event loop itself runs in a single thread.

Execution of I/O asynchronous operations is performed through libuv which uses (mainly) a thread pool to run them in the background. [[6]](#ref6)

```txt
How the I/O is run in the background is not of our concern, but due to the way our computer hardware works, 
with the thread as the basic unit of the processor, libuv and OSes will usually run background/worker threads 
and/or polling to perform tasks in a non-blocking manner.
```

## NodeJs

### Event loop

Here is the basic idea. [[6]](#ref6)

```txt
while there are still events to process:
    e = get the next event
    if there is a callback associated with e:
        call the callback
```


## NodeJs automata

Here is a more detailed schema presenting actual phases. [[1]](#ref1)


```txt
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
|             V
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
|             V
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
|             V
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
|             V
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
|             V
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

### Phases


```txt
    timers: this phase executes callbacks scheduled by setTimeout() and setInterval().
    I/O callbacks: executes almost all callbacks with the exception of close callbacks, the ones scheduled by timers, and setImmediate().
    idle, prepare: only used internally.
    poll: retrieve new I/O events; node will block here when appropriate.
    check: setImmediate() callbacks are invoked here.
    close callbacks: e.g. socket.on('close', ...).
```

Each phases has 2 FIFO queues of callbacks to execute.

### Micro tasks and macro tasks

A queue of macrotasks, that contains tasks relative to current phase.

And a queue of microtasks, that contains kind of "blocking" tasks and are run after each phases.


examples of microtasks:

    process.nextTick
    promises
    Object.observe

examples of macrotasks:

    setTimeout
    setInterval
    setImmediate
    I/O

### process.nextTick

It's a way to bypass the event loop.

By using process.nextTick(callback) we guarantee that callback() always runs after the rest of the user's code and before the event loop is allowed to proceed. [[1]](#ref1)

ie:
```Javascript
function someAsyncApiCall (callback) {
  process.nextTick(callback);
};

someAsyncApiCall(() => {
  console.log('bar', bar); // 1
});

var bar = 1;
``` 


## References

[1] <a name="ref1"></a>[https://github.com/nodejs/node/blob/master/doc/topics/event-loop-timers-and-nexttick.md](https://github.com/nodejs/node/blob/master/doc/topics/event-loop-timers-and-nexttick.md)

[2] <a name="ref2"></a>[https://developer.mozilla.org/en-US/docs/Web/JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[3] <a name="ref3"></a>[https://en.wikipedia.org/wiki/First-class_function](https://en.wikipedia.org/wiki/First-class_function)

[4] <a name="ref4"></a>[https://en.wikipedia.org/wiki/Higher-order_function](https://en.wikipedia.org/wiki/Higher-order_function)

[5] <a name="ref5"></a>[https://en.wikipedia.org/wiki/Closure_(computer_programming)](https://en.wikipedia.org/wiki/Closure_(computer_programming))

[6] <a name="ref6"></a>[https://blog.risingstack.com/node-js-at-scale-understanding-node-js-event-loop/](https://blog.risingstack.com/node-js-at-scale-understanding-node-js-event-loop/)

[7] <a name="ref7"></a>[https://html.spec.whatwg.org/multipage/webappapis.html#task-queue](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue)