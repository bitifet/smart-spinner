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
const hasUnicode = require('has-unicode')();
const chalk = require("chalk");

// Symbols and colors://{{{
// ===================

const symbols = {
    ok: chalk.green(hasUnicode ? "✓" : "[Ok]"),
    error: chalk.red(hasUnicode ? "✗" : "[Error]"),
    arrow: chalk.yellow(hasUnicode ? "→" : "->"),
};


// Pre-colorize spinners:
if (
    // Terminal supports color:
    'x' != chalk.yellow('x')
) (function coloryzeSpinners(spinners){ // IIFE
    for (let sp in spinners) {
        for (let i in spinners[sp].frames) {
            spinners[sp].frames[i] = chalk.yellow(spinners[sp].frames[i]);
        };
    };
})(cliSpinners);

// ===================//}}}


function smartSpinner(cbk, spinners = ['dots']) {//{{{

    var messageCbk;

    var stopped = false;
    let frame = 0;
    let spinner = 0;
    let next;
    let is_tty = tty.isatty(process.stdout.fd);


    function showNextFrame () {//{{{
        const frames = cliSpinners[spinners[spinner]].frames;
        logUpdate(frames[frame++ % frames.length] + ' ' + messageCbk(true));
    };//}}}

    function ctrlAPI(stop, newCbk) {//{{{

        // Ignore calls after spinning finished:
        if (stopped) return false;

        // Make stop parameter optinal:
        if ("boolean" != typeof stop) {
            newCbk = stop;
            stop = undefined;
        };

        // Message string/callback updating operation:
        if (newCbk !== undefined) {
            // Accept callback or literal string:
            messageCbk = ("function" == typeof newCbk)
                ? newCbk
                : ()=>newCbk
            ;
            if (! is_tty) {
                if (stop !== undefined) {
                    stop || process.stdout.write("\n");
                } else {
                    console.log(symbols.arrow + ' ' + messageCbk(false));
                };
            };
        };

        // Handle Stopping operation:
        if (stop !== undefined) {
            clearInterval(next);
            stopped = true;

            let s = symbols[stop ? "ok" : "error"];
            logUpdate(s + ' ' + messageCbk(true));

            if (is_tty) process.stdout.write("\n");
        }

        return true; // Success.

    };//}}}

    ctrlAPI(cbk);


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

    return ctrlAPI;
    
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

