"use strict";
console.log('Module store.js');

import { socket } from "/js/socket.js"

const store = {}
const wsListener = {}

function loadFromSessionStorage(item, defaultObj) {
    let obj = sessionStorage.getItem(item);
    if(!obj) {
        obj = defaultObj;
        saveToSessionStorage(item, obj)
    } else {
        obj = JSON.parse(obj);
        if(!obj) return null;
    }
    return obj;
}

function saveToSessionStorage(item, obj) {
    if(obj) sessionStorage.setItem(item, JSON.stringify(obj));
}

store.saveState = function() {
    saveToSessionStorage("state", store.state)
}

store.saveLogs = function() {
    saveToSessionStorage("logs", store.logs)
}

store.save = function () {
    store.saveState();
    store.saveLogs();
}

store.load = function () {
    store.state = loadFromSessionStorage('state', getStateTemplate());
    store.logs = loadFromSessionStorage('logs', getLogsTemplate());
}

wsListener.onmessage = function (message) {
    if(!message) return;
    let all = store.logs.all;
    all.messages.push(message);
};

function getStateTemplate() {
    let stateTemplate = {
        "urls":{
            "ws": "/ws",
            "testConfigList": "/api/test/testConfigList",
            "runTestConfig":"/api/test/runTestConfig"
        },
        "session": {
            "id": "guid",
            "status": "CLOSED"
        },
        "testConfigs":[],
        "logs": {
            "session": {
                "messages": ["[sessionId] Сообщения отправляемые в текущую сессию", "---------------------------", ""],
                "maxSize": 30000
            },
            "all": {
                "messages": ["[ALL] сообщения отправляемые во все сессии", "---------------------------", ""],
                "maxSize": 0
            },
            "wsCommands": {
                "messages": ["Управляющие ws сообщения (команды) ", "---------------------------", ""],
                "maxSize": 10000
            }
        },
        "properties": []
    }
    return stateTemplate;
}

function getLogsTemplate() {
    let logsTemplate = {
        "session": {
            "messages": ["[sessionId] Сообщения адресованные текущей сессию", "---------------------------", ""],
            "maxSize": 30000
        },
        "all": {
            "messages": ["[ALL] сообщения отправляемые во все сессии", "---------------------------", ""],
            "maxSize": 10000
        },
        "wsCommands": {
            "messages": ["Управляющие ws сообщения (команды) ", "---------------------------", ""],
            "maxSize": 5000
        }
    }
    return logsTemplate;
}

function init() {
    store.load();
}

init();

export { store };