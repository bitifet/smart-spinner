"use strict";
// Run me with 'node path/to/examples/simple-example.js'.

const spinner = require("../");



function banner(src, period, endStatus = true, spn) {
    return new Promise(function (resolve, reject) {
        var progress = spinner.create(src.shift(), spn);
        var updateItv = setInterval(function(){
            if (src.length > 1) {
                progress(src.shift());
            } else {
                clearInterval(updateItv);
                progress(endStatus, src.shift());
                setTimeout(resolve, period);
            };

        }, period);
    });
};

banner([
    "Hello Guys! I'm a smart-spinner.",
    "Next, some of my fellows are going to introduce us to you.",
    "So let's take a brief look to our features.",
    "Hope you enjoy it!!",
], 3000)
.then(()=> banner([
    "Yep! That's my turn!",
    "Here are some of our wonderful features...",
    "We provide continuous visual and colorful feedback for your background proceses.",
    "This amuse the user with one of my beautiful spinners preventing him to get anxious.",
    "You may also noticed that you can use fixed spinner or iterate over many of them.",
    "...just like I'm doing just now.",
    "But also IF YOU SEE THAT THE SPINNER STOPS, then you know YOUR PROGRAM IS BLOCKING.",
    "That was just a few of our wonderful features.",
], 3000, true, 'all'))
.then(()=> banner([
    "Hi there! More amazing features here...",
    "As you can see, my message can be updated anytime.",
    "...so user knows what your fucking program are doing all of the time.",
    "Even, if you don't want, you don't need to do so:",
    "Messages can also be provided as a callback, so some values can be dynamically updated.",
    ()=>"Yoo see. Now I'm gonna show you current time: "+(new Date()).toLocaleString(),
    ()=>"Suppose you noticed I used clock spinner, right? "+(new Date()).toLocaleString(),
    ()=>"That's funny! Isn't it? "+(new Date()).toLocaleString(),
    ()=>"We also have an exit status to visually report if things went wrong... "+(new Date()).toLocaleString(),
    ()=>"Now I will exit Ok... "+(new Date()).toLocaleString(),
    "See you!",
], 3000, true, 'clock'))
.then(()=> banner([
    "Hi guys!",
    "The bastard of my colleageus entrusted me the task of showing you a wrong exitstatus.",
    "That's sad. So here we go...",
    "This is a failed exit status",
], 3000, false, 'arrow'))
.then(()=> banner([
    "Last spinner demo here!",
    "You saw how much useful and useful we are when running interactively.",
    "...but what about when you need to run your app non interatively?",
    "Perhaps redirecting output to a log file or a pipe...",
    "You probably are thinking that things will be messed up because of a bunch of control characters...",
    "Aren't you?",
    "So... don't trust me!!! Simply try it yourself by piping me to a `cat` command.",
    "Yes: I will finish just now. Please: Try it!!",
    "Cheers!"
], 3000, true, 'earth'))
;
