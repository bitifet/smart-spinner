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


function smartSpinner(cbk, spinners = ['dots'], opts = {}) {//{{{

    var messageCbk;

    var stopped = false;
    let frame = 0;
    let spinner = 0;
    let next;
    let is_tty = tty.isatty(process.stdout.fd);

    var tsEnabled = !!(opts && opts.timestamp);
    var tsOpt = opts && opts.timestamp;
    if (tsEnabled) {
        if (tsOpt === true) tsOpt = 'utc';
        if (typeof tsOpt !== 'string') tsOpt = 'utc';
    };
    function fmtTS() {
        if (!tsEnabled) return '';
        var now = new Date();
        var s;
        if (tsOpt === 'utc') {
            s = now.toISOString().replace(/\.\d+Z$/, 'Z');
        } else {
            var dtfOpt = {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false, timeZoneName: 'shortOffset'
            };
            if (tsOpt !== 'local') dtfOpt.timeZone = tsOpt;
            var map = {};
            Intl.DateTimeFormat('en-CA', dtfOpt).formatToParts(now).forEach(function(p) { map[p.type] = p.value; });
            var tz = map.timeZoneName || 'Z';
            if (tz === 'UTC') tz = 'Z';
            else if (tz.slice(0, 3) === 'GMT') {
                var off = tz.slice(3);
                if (!off) { tz = 'Z'; }
                else {
                    var sign = off.charAt(0);
                    var rest = off.slice(1);
                    var parts = rest.split(':');
                    var hh = parts[0].length < 2 ? '0' + parts[0] : parts[0];
                    var mm = parts[1] ? (parts[1].length < 2 ? '0' + parts[1] : parts[1]) : '00';
                    tz = sign + hh + ':' + mm;
                };
            };
            s = map.year + '-' + map.month + '-' + map.day + 'T' + map.hour + ':' + map.minute + ':' + map.second + tz;
        };
        return '[' + s + '] ';
    };

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
                    console.log(fmtTS() + symbols.arrow + ' ' + messageCbk(false));
                };
            };
        };

        // Handle Stopping operation:
        if (stop !== undefined) {
            clearInterval(next);
            stopped = true;

            let s = symbols[stop ? "ok" : "error"];
            if (is_tty) {
                logUpdate(s + ' ' + messageCbk(true));
                process.stdout.write("\n");
            } else {
                console.log(fmtTS() + s + ' ' + messageCbk(true));
            };
        }

        return true; // Success.

    };//}}}

    ctrlAPI.update = function (newCbk) {
        messageCbk = ("function" == typeof newCbk) ? newCbk : ()=>newCbk;
        if (!is_tty) {
            console.log(fmtTS() + symbols.arrow + ' ' + messageCbk(false));
        };
    };

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

