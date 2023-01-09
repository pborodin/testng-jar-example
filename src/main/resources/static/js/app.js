'use strict';
console.log('Module app.js');
window.app = {};

import { Route } from "./route.js";
import { Router } from "./router.js";
import { socket } from "./socket.js"
import * as test from "/views/test.js"

function init() {
  let routes = [
      {
        name: 'home',
        view: 'home.html',
        isDefault: true
      },
      {
        name: 'tests',
        view: 'tests.html',
        controller: test
      },
      {
        name: 'settings',
        view: 'settings.html'
      }
    ]
  let router = new Router(routes);
}

init();
