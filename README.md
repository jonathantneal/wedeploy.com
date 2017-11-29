# WeDeploy.com [<img src="https://avatars3.githubusercontent.com/u/10002920" alt="WeDeploy logo" width="90" height="90" align="right">][wedeploy]

[![Build Status][cli-img]][cli-url]
[![Slack Group][irc-img]][irc-url]

This repository hosts the landing and suplementary pages of [WeDeploy.com][wedeploy].

WeDeploy is a development platform that helps you deploy your simple to complex
apps quickly. It also gives you access to intuitive APIs for backend
microservices that can enable you to create modern apps faster.

---

## Development

To work on the landing page itself;

1. From the [node/magnet](node/magnet) directory, install the local
   dependencies:

   ```sh
   npm install
   ```

2. Compile the page and its styles:

   ```sh
   npm run build && npm run build:css
   ```

3. Start the local server and watch for file changes (run these in separate
   tabs):

   ```sh
   npm run dev
   ```

   ```sh
   npm build:css:watch
   ```

The local server will be available at
[http://0.0.0.0:3001](http://0.0.0.0:3001).

---

To work on suplementary pages, including the blog and docs;

1. From the [node/electric](node/electric) directory, install the local
   dependencies:

   ```sh
   npm install
   ```

2. Compile the pages:

   ```sh
   npm run build
   ```

3. Start the local server and watch for file changes:

   ```sh
   npm start run
   ```

The local server will be available at
[http://localhost:8888](http://localhost:8888).

[wedeploy]: https://wedeploy.com/
[cli-url]: https://ci.wedeploy.com/job/wedeploy/job/wedeploy.com/job/master/
[cli-img]: https://ci.wedeploy.com/buildStatus/icon?job=wedeploy/wedeploy.com/master
[irc-url]: https://chat.wedeploy.com/
[irc-img]: https://chat.wedeploy.com/badge.svg
