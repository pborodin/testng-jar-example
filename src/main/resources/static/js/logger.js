'use strict';
console.log('Module logger.js');

import { socket } from "./socket.js";

const LOGGER_ELEMENT_ID = 'logger';
const logger = {};
const log =[];
const wsListener = {name:'logger.js'};

let autoscroll = false;
let listening = false;
let maxPrintRows = 1500;
let logLastCount = 0;
let intervalID;  // id таймера циклического вывода логов
let printIntervalMs = 300;

let logElement = document.getElementById(LOGGER_ELEMENT_ID);

function addKeyDownListener () {
    document.addEventListener('keydown', (event) => {
        const keyName = event.key;

        if (keyName === 'Pause') {
            if(listening) {
                stopListening();
                printLogOnce();
            } else {
                startListening();
            }
        }
    }, false);
}

function addWheelListener () {
    if(!logElement) logElement = document.getElementById(LOGGER_ELEMENT_ID);
    if (logElement.addEventListener) {
        if ('onwheel' in document) {
            // IE9+, FF17+, Ch31+
            logElement.addEventListener("wheel", onWheel);
        } else if ('onmousewheel' in document) {
            // устаревший вариант события
            logElement.addEventListener("mousewheel", onWheel);
        } else {
            // Firefox < 17
            logElement.addEventListener("MozMousePixelScroll", onWheel);
        }
    } else { // IE8-
        logElement.attachEvent("onmousewheel", onWheel);
    }
}

function onWheel(e) {
    autoscroll = false;
    let delta = e.deltaY || e.detail || e.wheelDelta;
    if (logElement) logElement.scrollTop = logElement.scrollTop + delta;
}

function printLog () {
     if(logLastCount == log.length) return;
     if(!autoscroll) return;
     printLogOnce();
}

function printLogOnce () {
    console.log('printLogOnce');
    if(!logElement) {
        console.log("[logger.printLogOnce] logElement не найден. Ищем заново");
        logElement = document.getElementById(LOGGER_ELEMENT_ID);
    }
    if(!logElement) {
        console.warn("logElement не найден");
        autoscroll = false;
        return
    };

    let size = maxPrintRows;
    let from = log.length - maxPrintRows;
    if(from < 0) {
        from = 0;
        size = log.length;
    }

    let arr = log.slice(from);
    let rows = "";
    for (let i = 0; i < arr.length; i++) {
       rows += arr[i] + "\n";
    }

    let fragment = document.createDocumentFragment();
    let itemText = document.createTextNode(rows);
    if(itemText) fragment.appendChild(itemText);

    logElement.removeChild(logElement.firstChild);
    logElement.appendChild(fragment);

     if(autoscroll) logElement.scrollTop = logElement.scrollHeight;
     logLastCount = log.length;
}

function onMessage (event) {
    let message = event.data;
    if(!message) return;
    if(message.includes("testStarted")) {
        console.log('logger.onMessage testStarted');
        startListening();
        autoscroll = true;
    }
    // если слушание отключено, сообщения в log[] не добавляем
    if(listening) log.push(message);
}

function startListening () {
    if(listening) return;
    listening = true;
    socket.subscribe(wsListener);
    intervalID = setInterval(printLog, printIntervalMs);
}

function stopListening () {
    if(listening == false) return;
    listening = false;
    if(intervalID) clearInterval(intervalID);

    // Не отписываемся, чтобы получать команды. Но при listening = false; не будем добавлять новые сообщения в log[]
    // socket.unsubscribe(wsListener);
}

function onMount () {
    logElement = document.getElementById(LOGGER_ELEMENT_ID);
    addWheelListener();
    startListening();
}

function init () {
    addKeyDownListener();
    wsListener.onmessage = onMessage;

    logger.printLogOnce = printLogOnce;
    logger.printLog = printLog;
    logger.onMount = onMount;
}

init();

export { logger };