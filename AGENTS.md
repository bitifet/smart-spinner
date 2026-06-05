# smart-spinner — agent guide

Single-file npm package (`index.js`). No build, no tests, no CI.

## Commands

- **Run examples:** `node examples/simple-example.js` (from project root; uses `require("../")`)
- **Test:** none — `npm test` is a no-op stub

## Key architecture

- `spinner.create(msg, opts)` → returns `ctrlAPI(stopOrMsg, newMsg?)` — `opts` is an options object (`{ spinners, timestamp }`). For backward compat, a string/array is accepted as shorthand for `{ spinners: value }`. The returned API is overloaded: pass a `boolean` to stop, a `string`/`function` to update the message, or both. Also has `ctrlAPI.update(newMsg)` for non-TTY phase transitions.
- `opts.timestamp` (`'utc'`, `'local'`, or IANA timezone) prepends ISO-8601 timestamps to non-TTY log lines.
- Non-TTY detection (`tty.isatty`) silences animation; only the initial message + updates are `console.log`-ed once.
- `has-unicode` / `chalk` graceful fallback for non-Unicode / no-color terminals.

## Dependencies (old majors)

`chalk@^2`, `cli-spinners@^1`, `log-update@^2`, `has-unicode@^2` — be aware if bumping.
