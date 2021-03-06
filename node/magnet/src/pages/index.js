/* eslint-disable */
import Component from 'metal-component';
import Soy from 'metal-soy';
import templates from './index.soy.js';
import {
  highlightAllCodeElementsInDoc,
  highlightCodeSnippetsFromMarkup,
} from '../utils/highlight.js';
import {userPlans} from '../utils/state.js';

import '../components/AuthDemo.js';
import '../components/Bubbles.js';
import '../components/DataDemo.js';
import '../components/Header.js'
import '../components/PlugNPlay.js';
import '../components/Start.js';

import '../partials/Answers.soy.js';
import '../partials/Auth.soy.js';
import '../partials/Benefits.soy.js';
import '../partials/Data.soy.js';
import '../partials/Email.soy.js';
import '../partials/Enterprise.soy.js';
import '../partials/Footer.soy.js';
import '../partials/Possibilities.soy.js';
import '../partials/Highlights.soy.js';
import '../partials/Hosting.soy.js';
import '../partials/Pricing.soy.js';
import '../partials/Support.soy.js';
import '../partials/Try.soy.js';

if (typeof __MAGNET_ROUTER__ !== 'undefined') {
  __MAGNET_ROUTER__.setUpdateScrollPosition(false);
}

export const route = {
  path: '/',
  method: 'get',
};

export default class Index extends Component {
  static renderLayout(req, content) {
    return `<!doctype html>
<html lang="en" dir="ltr">
  <title>WeDeploy™</title>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
	<meta name="twitter:card" content="summary_large_image">
	<meta property="og:description" content="Forget about infrastructure. Dedicate your time to what really matters: building great apps.">
	<meta property="og:image" content="https://wedeploy.com/images/open_graph.png">
	<meta property="og:image:alt" content="WeDeploy Logo">
  <meta property="og:image:height" content="630">
  <meta property="og:image:width" content="1200">
	<meta property="og:site_name" content="WeDeploy">
	<meta property="og:title" content="WeDeploy™">
	<meta property="og:type" content="website">
	<meta property="og:url" content="https://wedeploy.com/">
  <link rel="icon" href="/images/favicon.ico" type="image/x-icon">
  <link rel="stylesheet" href="/static/styles/main.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono:500,700">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:900&amp;text=%E2%80%A2">
  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.5.0/styles/arta.min.css">
  <script src="https://rawgit.com/web-animations/web-animations-js/master/web-animations.min.js"></script>
  <body>
    ${highlightCodeSnippetsFromMarkup(content)}
  </body>
</html>`;
  }

  static async getInitialState(req, res) {
    const plans = await userPlans(req, res);
    return {plans};
  }

  attached() {
    highlightAllCodeElementsInDoc();
  }
}

Soy.register(Index, templates);
