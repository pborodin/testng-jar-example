'use strict';
console.log('Module socket.js');

import { store } from "./store.js"

const WS_HOST_ELEMENT = 'ws-host';
const WS_STATUS_ELEMENT = 'ws-status';
const WS_OBSERVERS_ELEMENT = 'ws-status';

let wsUrl = window.location.host + store.state.urls.ws;
let socket = new WebSocket(((window.location.protocol === "https:") ? "wss://" : "ws://") + wsUrl);
let observers = [];

function setSessionId(event) {
    let message = event.data;
    let sessionId = message.replace("sessionId=", "");

    if(store && store.state && store.state.session) {
        store.state.session.id = sessionId;
        store.state.session.state = event.type;
    }
}

socket.subscribe = function(observer) {
  let name = observer.name ? observer.name : "";
  if (observers.filter(item => item === observer).length > 0) {
    console.log("[socket.subscribe]" + name + " уже был подписан ранее. Всего подписчиков: " + observers.length);
    return
  }
  observers.push(observer);
  console.log("[socket.subscribe] Новый подписчик " + name + ". Всего подписчиков: " + observers.length);
};

socket.unsubscribe = function(observer) {
  let name = observer.name ? observer.name : "";
  observers = observers.filter(item => item !== observer);
  console.log("[socket.unsubscribe] Подписчик " + name + " отписался. Всего подписчиков:" + observers.length);
};

socket.notifyAll = function(event) {
  observers.forEach(observer => {
     observer.onmessage(event)
  });
};

socket.onmessage = function(event) {
   let message = event.data;
   if(message.includes("sessionId")) setSessionId(event);
   socket.notifyAll(event);
};

socket.onopen = function(event) {
  let el = document.getElementById(WS_HOST_ELEMENT);
  if(el) el.textContent = 'host: ' + event.target.url;

  el = document.getElementById(WS_STATUS_ELEMENT);
  if(el) el.textContent = 'ws: ' + event.type;

  console.log("[socket.onopen] Connected to: " + event.target.url);
  socket.send("[socket.onopen] Connected to: " + event.target.url);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    alert('[socket.onclose] Connection died');
    console.log('[socket.onclose] Connection died');
  }
  if(store && store.state && store.state.session) {
    store.state.session.id = "[socket.onclose] connection closed";
    store.state.session.state = event.type;
  }
  let el = document.getElementById(WS_HOST_ELEMENT);
  if(el) el.textContent = 'host: unknown';

  el = document.getElementById(WS_STATUS_ELEMENT);
  if(el) el.textContent = 'ws: ' + event.type;
};

socket.onerror = function(error) {
  console.log(`[error]`);
};

export { socket };