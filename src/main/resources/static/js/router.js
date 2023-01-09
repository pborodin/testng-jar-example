'use strict';
console.log('Module router.js');

import { Route } from "./route.js";

function Router(routes) {
    try {
        if (!routes) {
            throw 'error: routes param is mandatory';
        }
        this.constructor(routes);
        this.init();
    } catch (e) {
        console.error(e);
    }
}

// функция добавления html кода, содержащего в себе JavaScript
// добавление через создание фрагмента делается для того, чтобы содержащийся в html
// JavaScript код после добавления исполнялся.
function appendInnerHTML(el, html) {
    // удаляем все дочерние узлы элемента el
    // нельзя использовать el.innerHtml = "", т.к. этот способ не удалет узлы по настоящему и не удаляет привязанные обработчки
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }

    /**
       * Creating a "contextual fragment" will allow the execution
       * of any scripts included in the received HTML.
       */
    let range = document.createRange();
    let fragment = range.createContextualFragment(html);
    el.appendChild(fragment);
}

Router.prototype = {
    routes: undefined,
    rootElem: undefined,
    constructor: function (routes) {
        this.routes = [];
        routes.forEach((item) => {
            this.routes.push(new Route(item));
        });
        this.rootElem = document.getElementById('app');
    },
    init: function () {
        let r = this.routes;
        (function(scope, r) {
            window.addEventListener('hashchange', function (e) {
                scope.hasChanged(scope, r);
            });
        })(this, r);
        this.hasChanged(this, r);
    },
    hasChanged: function(scope, r){
        if (window.location.hash.length > 0) {
            for (var i = 0, length = r.length; i < length; i++) {
                let route = r[i];
                if(route.isActiveRoute && route.isActiveRoute(window.location.hash.substr(1))) {
                    scope.goToRoute(route);
                }
            }
        } else {
            for (var i = 0, length = r.length; i < length; i++) {
                let route = r[i];
                if(route.isDefault) {
                    scope.goToRoute(route);
                }
            }
        }
    },
    goToRoute: function (route) {
        (function(scope) {
            let url = 'views/' + route.htmlName,
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    appendInnerHTML(scope.rootElem, this.responseText);
                    if(route.controller) route.controller.onMount();
                }
            };
            xhttp.open('GET', url, true);
            xhttp.send();
        })(this);
    }
};

export { Router };