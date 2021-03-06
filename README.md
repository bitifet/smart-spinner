Smart-Spinner
=============

Simple tool to create smart text spinner.

Helps to provide continous feedback of your application internal status without
flooding out console or logs.


![Small Gif Demo](media/smartSpinner-small-demo.gif)

>
Large demo [here](media/smartSpinner-banner-demo.mp4).
>


Index
-----

<!-- vim-markdown-toc GitLab -->

* [Features](#features)
* [Setup](#setup)
* [Usage](#usage)
    * [Module loading](#module-loading)
    * [Spinner Creation](#spinner-creation)
    * [Other functions](#other-functions)
        * [demo()](#demo)
        * [list()](#list)
* [Simple example](#simple-example)
* [Contributing](#contributing)

<!-- vim-markdown-toc -->


Features
--------

  * Provide continuous visual and colorful feedback thought
    [cli-spinners](https://www.npmjs.com/package/cli-spinners) and
    [chalk](https://www.npmjs.com/package/chalk).

  * Helps to detect when you run into blocking code (spinning will pause while
    long processing bloking code takes place).

  * Automatically detects when stdout is not connected to the terminal and just
    initial message (and updates if any) are shown to avoid flooding unattended
    operation logs.

  * Also detects if terminal supports unicode and ansi color codes gracefully
    failing back to textual / uncolorized (respectively) approaches.

  * Accepts message as string or callback function (so you can easlily monitor
    any variable you want).

  * Returns simple API function that lets you:
    - Modify message anytime (even changing from string to callback and
        vice-versa) by passing new one.
    - Stop spinner (finalization) by passing boolean value indicating whether
      the whole process finished correctly or not and, optionally, second
      parameter with new message update.


For better and easier understanding see [example](#simple-example) below.


Setup
-----

```sh
npm install --save smart-spinner
```

Usage
-----

### Module loading

```javascript
const spinner = require("smart-spinner");
```

### Spinner Creation


```javascript
var progress = spinner.create(<message> [, <spinner_list>]);
```

**Where:**

  * `<message>`: Message string or callback to generate it. If callback is
    used, then it is called with single boolean argument indicating if output
    is actually connected to terminal or not. So complex calculations can be
    avoided if needed (also callback will be called single time in this case).
    
  * `<spinner_list>`: Array of spinner names (See [list()](#list) or
    [demo()](#demo) to know which ones are available) or string "all" to use
    all.
    - Specified spinners will be rotated regularly.
    - If "all" keyword is specified instead, all available ones will be used.
    - If "demo" keyword is specified instead, it will operate just like if
      [demo()](#demo) were used instead.
    - If string (distinct of "all" and "demo" is used) it wil be threated as
      single spinner list.


**Return value:** Callback to control spinner:

__Syntax:__

  * `progress (String <newMsg>)`: Set message to provided string or callback.
  * `progress (Boolean <stop>)`: Stop spinning with success (stop = true) or failed (stop = false).
  * `progress (Boolean <stop>, String <newMsg>)` Stop spinning but also updates message.



### Other functions


#### demo()


```javascript
var progress = spinner.demo([<message>]);
```

Works like `spinner.create()` but rotate over all available spinners also
showing its name when called without parameters.

>
In fact it is just a wrapper over `create()` forcing "demo" keyword as spinner list.
>


#### list()


```javascript
var progress = spinner.list();
```

Simply shows list of available spinners (More info about them at
[cli-spinners](https://www.npmjs.com/package/cli-spinners)).



Simple example
--------------


```javascript
const spinner = require("smart-spinner");

var progress = spinner.create("Here is my Spinner");

setTimeout(()=>{
    progress("Now text is updated");
}, 2000);


setTimeout(()=>{
    progress(function(){
        var someStatus = (new Date()).toLocaleString();
        return "Current time: " + someStatus;
    });
}, 4000);


setTimeout(()=>{
    progress("I will finish just in a few seconds more.");
}, 6000);


// Finally: This random timeouts will race to impose its status.  Even not good
// pattern to trigger both success and fail status this example shows how, if it
// happens, the last will be silently ignored.
setTimeout(()=>{
    progress(true, "Success!!");
    // This will replace spinner icon with green check mark and set message to
    // "Success!!".
}, 7000 + Math.random()*3000);

setTimeout(()=>{
    progress(false, "Failed!!");
    // This will replace spinner icon with red cross mark and set message to
    // "Failed!!".
}, 7000 + Math.random()*3000);
```

>
See more examples in the `examples` directory of the project repository.
>


Contributing
------------

If you are interested in contributing with this project, you can do it in many ways:

  * Creating and/or mantainig documentation.

  * Implementing new features or improving code implementation.

  * Reporting bugs and/or fixing it.
  
  * Sending me any other feedback.

  * Whatever you like...
    
Please, contact-me, open issues or send pull-requests thought [this project GIT repository](https://github.com/bitifet/smart-spinner)

