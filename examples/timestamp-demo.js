"use strict";
// Run me with 'node path/to/examples/simple-example.js'.

const spinner = require("../");

var progress = spinner.create("Here a Spinner with timestamp", {timestamp: "local"});

// Also try using demo() instead:
// var progress = spinner.demo();

setTimeout(()=>{
    progress("If you don't see it, try to pipe the output to a file or a command like `cat`.");
}, 2000);


setTimeout(()=>{
    progress(function(){
        var someStatus = (new Date()).toLocaleString();
        return "You already know that current time is: " + someStatus;
    });
}, 4000);


setTimeout(()=>{
    progress("But if you read a logged file later, you won't.");
}, 6000);

setTimeout(()=>Math.round(Math.random())
    ?  progress(true, "Job done!!")
    :  progress(false, "Error!!")
, 8000);
