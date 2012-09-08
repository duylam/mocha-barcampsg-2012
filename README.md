Sample test project using mocha
====================

The project contains tests for a sample web app allowing to save / get / remove simple object to server via browser:

- Save data by accessing to : */save?key=your_key&field1=value1&field2=value2*
- Remove object by accessing to : */remove?key=your_key*
- Get object by accessing to : */get?key=your_key*

Below is steps to setup the environment to run the web app and tests:

1. Install [node.js](http://nodejs.org/download/)
1. Get the all source code from git or download as zip package
1. Change current directory to here
1. Install required modules by typing: *$ npm install -d*
1. Create soft link for mocha: *$ ln -s \`pwd\`/node_modules/mocha/bin/mocha ~/bin/*
1. Run tests: *$ mocha*
1. If you'd like to have a look at the web app, run it: *$ node app.js*