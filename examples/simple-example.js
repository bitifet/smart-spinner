"use strict";
// Run me with 'node path/to/examples/simple-example.js'.

const spinner = require("../");

var progress = spinner.create("Here is my Spinner");

// Also try using demo() instead:
// var progress = spinner.demo();

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
    progress("I will finish just in 2 seconds more.");
}, 6000);

setTimeout(()=>{
    progress(false);
}, 8000);
