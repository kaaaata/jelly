A silly Mac terminal clone for web browsers

Setup: npm install

Run: npm start

Complete documentation of (useful) commands and flags:

alias description: allow users to edit & load alias profiles, linking shortcut commands to pre-existing commands. flags: -e: open alias text editor and edit the active profile -l: load the active profile (currently useless) -i: display the info of currently active alias profile sample: alias -e

open description: opens a web page. default behavior opens in a new tab or window, depending on what the user's browser is configured to do with new page openings. note: popup blocker or other security measures should be disabled :) flags: -n (default): algorithmically generate URL given a string, and open in new window/tab (super basic algorithm :)) -a: open in active tab, setting the 'back' page to be germinal -e: open exact URL in a new window/tab sample: open youtube sample: open -e https://www.youtube.com/

wait description: wait some time and then execute a command. can be used with aliases. the maximum wait time is the maximum time setTimeout can take, which is around 300 hours. flags: -ms (default): wait milliseconds (currently broken) -s: wait seconds -m: wait minutes sample: wait -s 2 open youtube

clear description: clear the current log of commands. only clears the commands from memory, and not persistently. flags: none sample: clear

To-do: -Fix broken commands -Implement server/databae for complete command logs and multiple alias profiles -Add more commands -Add multiple-commands on same line separated by ; -Implement multi-flagging when appropriate