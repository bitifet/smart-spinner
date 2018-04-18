// smartSpinner - index.js
// =========================================
//
// Simple tool to create smart text spinner
//
// @author: Joan Miquel Torres <jmtorres@112ib.com>
// @company: GEIBSAU
// @license: GPL
//
"use strict";
const logUpdate = require('log-update');
const cliSpinners = require('cli-spinners');
const tty = require('tty');


function smartSpinner(cbk, spinners = ['dots']) {//{{{

    var messageCbk;

    var stopped = false;
    let frame = 0;
    let spinner = 0;
    let next;
    let is_tty = tty.isatty(process.stdout.fd);

    // Accept callback or literal string:
    function setMessage(newCbk) {
        if (newCbk === false) { // Stopping operation
            clearInterval(next);
            stopped = true;
            if (is_tty) process.stdout.write("\n");
        } else { // Message string/callback updating operation.
            messageCbk = ("function" == typeof newCbk)
                ? newCbk
                : ()=>newCbk
            ;
            if (! is_tty) {
                console.log(messageCbk(false));
            };
        };
    };

    setMessage(cbk);


    if (is_tty) {
        
        if (spinners == "demo") {
            messageCbk = (function(cbk0){
                return x=>("["+spinners[spinner]+"] "+cbk0(x));
            })(messageCbk);
            spinners = "all";
        };

        if (spinners == "all") {
            spinners = Object.keys(cliSpinners);
        } else if (typeof spinners == 'string') {
            spinners = [spinners];

        };

        const showNextFrame = () => {
            const frames = cliSpinners[spinners[spinner]].frames;
            logUpdate(frames[frame++ % frames.length] + ' ' + messageCbk(true));
        };

        const showNextSpinner = () => {
            if (next) {
                clearInterval(next);
                spinner++;
            }

            if (spinner >= spinners.length) spinner = 0; // Loop.

            const s = cliSpinners[spinners[spinner]];

            if (! stopped) { next = setInterval(showNextFrame, s.interval);
                setTimeout(showNextSpinner, Math.max(s.interval * s.frames.length, 1000));
            };
        };

        showNextSpinner();

    };

    return setMessage;
    
};//}}}

function list() {//{{{
    const spinners = Object.keys(cliSpinners);
    console.log(spinners.length + ' spinners\n');
    spinners.map(sp=>console.log("  * "+sp));
};//}}}



module.exports = {
    list: list,
    create: smartSpinner,
    demo: function spinnerDemo(cbk) {
        console.log ("Smart Spinner DEMO");
        if (! cbk) cbk = "Call me with some string or callback function";
        return smartSpinner (cbk, "demo");
    },
};

